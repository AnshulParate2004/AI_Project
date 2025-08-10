from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import json
import os

app = FastAPI()

# Allow your React app to access this API
origins = [
    "http://localhost:8080",  # Adjust if your React dev server uses different port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PYTHON_EXE = r"C:\Users\KAIZEN\Desktop\AI_Project\Backend\LLMParallelFanOut\.venv\Scripts\python.exe"  # Adjust as needed

class QuestionRequest(BaseModel):
    question: str

def run_script(script_path, *args):
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"  # Force UTF-8 output from subprocess

    try:
        # Added encoding='utf-8' here to fix decode errors
        result = subprocess.run(
            [PYTHON_EXE, script_path] + list(args),
            check=True,
            capture_output=True,
            text=True,
            encoding='utf-8',   # <-- Explicitly decode output as UTF-8
            env=env,
        )
        return result.stdout  # optionally capture output if needed

    except subprocess.CalledProcessError as e:
        error_msg = e.stderr or e.stdout or str(e)
        raise RuntimeError(f"Failed to run {script_path}: {error_msg}")

@app.post("/full_pipeline")
async def run_full_pipeline(request: QuestionRequest):
    # 1. Run question_variants.py with the question argument
    try:
        run_script("question_variants.py", request.question)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    # 2. Run multi_llm_answers.py
    try:
        run_script("multi_llm_answers.py")
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    # 3. Run optimize_final_answer.py
    try:
        run_script("optimize_final_answer.py")
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    # 4. Load and return final optimized answer
    try:
        with open("optimized_llm_final_answers.json", "r", encoding="utf-8") as f:
            optimized_data = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="optimized_llm_final_answers.json not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="optimized_llm_final_answers.json contains invalid JSON")

    return {
        "input_question": request.question,
        "final_answer": optimized_data
    }
    