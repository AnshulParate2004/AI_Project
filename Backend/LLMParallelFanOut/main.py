from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess
import json
import os
import sys

app = FastAPI()

PYTHON_EXE = r"C:\Users\KAIZEN\Desktop\AI_Project\Backend\LLMParallelFanOut\.venv\Scripts\python.exe"  # Adjust path to your Python

class QuestionRequest(BaseModel):
    question: str

def run_script(script_path, *args):
    """Run a Python script with optional arguments."""
    try:
        subprocess.run(
            [PYTHON_EXE, script_path] + list(args),
            check=True
        )
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Failed to run {script_path}: {e}")

@app.post("/full_pipeline")
def run_full_pipeline(request: QuestionRequest):
    # 1. Run question_variants.py with the question as argument
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

    return {
        "input_question": request.question,
        "final_answer": optimized_data
    }
