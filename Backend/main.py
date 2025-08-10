from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import json
import os

app = FastAPI()

# Allow your React app to access this API
origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",  # Adjust if your React dev server uses different port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to Python inside your venv
PYTHON_EXE = r"C:\Users\KAIZEN\Desktop\AI_Project\Backend\.venv\Scripts\python.exe"

# Base folder for all LLM scripts and data
LLM_DIR = os.path.join(os.path.dirname(__file__), "LLM")

class QuestionRequest(BaseModel):
    question: str

def run_script(script_name, *args):
    """
    Runs a Python script from the LLM folder with optional arguments.
    """
    script_path = os.path.join(LLM_DIR, script_name)

    if not os.path.exists(script_path):
        raise RuntimeError(f"Script not found: {script_path}")

    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"  # Force UTF-8 output from subprocess

    try:
        result = subprocess.run(
            [PYTHON_EXE, script_path] + list(args),
            check=True,
            capture_output=True,
            text=True,
            encoding='utf-8',
            env=env,
            cwd=LLM_DIR  # Ensure working directory is LLM folder
        )
        return result.stdout

    except subprocess.CalledProcessError as e:
        error_msg = e.stderr or e.stdout or str(e)
        raise RuntimeError(f"Failed to run {script_name}: {error_msg}")

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
    optimized_file = os.path.join(LLM_DIR, "optimized_llm_final_answers.json")
    try:
        with open(optimized_file, "r", encoding="utf-8") as f:
            optimized_data = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail=f"{optimized_file} not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail=f"{optimized_file} contains invalid JSON")

    return {
        "input_question": request.question,
        "final_answer": optimized_data
    }
