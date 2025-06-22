from fastapi import FastAPI
from db import mcqs_collection

app = FastAPI()

@app.get("/quizzes/{subject}/{chapter}")
async def get_quiz(subject: str, chapter: str):
    doc = await mcqs_collection.find_one({"subject": subject, "chapter": chapter})
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc
