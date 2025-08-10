import subprocess

python_executable = r"C:\Users\KAIZEN\Desktop\AI_Project\Backend\LLMParallelFanOut\.venv\Scripts\python.exe"


# Ask the question here
question = input("Enter your question: ")

# Run question generator with the question passed as CLI arg
subprocess.run([python_executable, "question_variants.py", question], check=True)

# Run multi-LLM response generator
subprocess.run([python_executable, "multi_llm_answers.py"], check=True)

# Run aggregator/final answer optimizer
subprocess.run([python_executable, "optimize_final_answer.py"], check=True)

