from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import json
import os

from sqlalchemy.orm import Session
from db import get_db, engine
from models import Base, PipelineResult

# Create tables if not exist
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow React
origins = ["http://localhost:8080", "http://127.0.0.1:8080"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PYTHON_EXE = r"C:\Users\KAIZEN\Desktop\AI_Project\Backend\.venv\Scripts\python.exe"
LLM_DIR = os.path.join(os.path.dirname(__file__), "LLM")

class QuestionRequest(BaseModel):
    question: str

def run_script(script_name, *args):
    script_path = os.path.join(LLM_DIR, script_name)
    if not os.path.exists(script_path):
        raise RuntimeError(f"Script not found: {script_path}")

    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"

    try:
        result = subprocess.run(
            [PYTHON_EXE, script_path] + list(args),
            check=True,
            capture_output=True,
            text=True,
            encoding="utf-8",
            env=env,
            cwd=LLM_DIR
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        error_msg = e.stderr or e.stdout or str(e)
        raise RuntimeError(f"Failed to run {script_name}: {error_msg}")

@app.post("/full_pipeline")
async def run_full_pipeline(request: QuestionRequest, db: Session = Depends(get_db)):
    # Run pipeline scripts
    try:
        run_script("question_variants.py", request.question)
        run_script("multi_llm_answers.py")
        run_script("optimize_final_answer.py")
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Load result JSON
    optimized_file = os.path.join(LLM_DIR, "optimized_llm_final_answers.json")
    try:
        with open(optimized_file, "r", encoding="utf-8") as f:
            optimized_data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        raise HTTPException(status_code=500, detail=f"Error reading {optimized_file}: {e}")

    # Save to DB
    new_result = PipelineResult(
        input_question=request.question,  # <-- keep original user question here
        original_question = optimized_data["original"]["question"],
        original_optimized_final = optimized_data["original"]["optimized_final"],
        abstract_question = optimized_data["abstract"]["question"],
        abstract_optimized_final = optimized_data["abstract"]["optimized_final"],
        detailed_question = optimized_data["detailed"]["question"],
        detailed_optimized_final = optimized_data["detailed"]["optimized_final"]
    )
    db.add(new_result)
    db.commit()
    db.refresh(new_result)
    
    return {
        "status": "success",
        "id": new_result.id,
        "input_question": request.question,
        "final_answer": optimized_data
    }
