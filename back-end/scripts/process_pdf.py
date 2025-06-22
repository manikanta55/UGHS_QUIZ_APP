import re
import json
from db import mcqs_collection
from models import MCQSet
from utils import extract_text_from_pdf, generate_mcqs_from_text

def extract_json_from_response(response_text):
    # Extract JSON object, even if wrapped in code fences
    match = re.search(r'```json\s*(\{.*\})\s*```', response_text, re.DOTALL)
    if not match:
        match = re.search(r'(\{.*\})', response_text, re.DOTALL)
    return match.group(1) if match else None

def process_single_pdf(filepath, subject, chapter):
    text = extract_text_from_pdf(filepath)
    word_count = len(text.split())
    print(f"Extracted text word count: {word_count}")

    print(f"Processing: {subject} - {chapter}")
    try:
        raw_output = generate_mcqs_from_text(text)
        print("\n--- RAW GPT OUTPUT START ---\n")
        print(raw_output)
        print("\n--- RAW GPT OUTPUT END ---\n")

        # Extract and parse only the JSON part
        json_str = extract_json_from_response(raw_output)
        if not json_str:
            print("❌ Error: No JSON found in OpenAI response.")
            return

        data = json.loads(json_str)
        summary = data.get("summary", [])
        mcqs = data.get("mcqs", [])

        # Build the MCQSet object with subject and chapter
        mcq_set = MCQSet(
            subject=subject,
            chapter=chapter,
            summary=summary,
            mcqs=mcqs
        )

        # Insert into MongoDB
        mcqs_collection.insert_one(mcq_set.model_dump())
        print(f"✅ Stored {len(mcq_set.mcqs)} MCQs for {subject} - {chapter}")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    filepath = "./pdfs/10_social_chapter_1.pdf"
    subject = "Social"
    chapter = "Chapter 1 - India Relief Features"

    process_single_pdf(filepath, subject, chapter)
