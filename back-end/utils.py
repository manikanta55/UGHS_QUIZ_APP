import json
from openai import OpenAI
import os
from dotenv import load_dotenv
from io import StringIO
from pdfminer.high_level import extract_text_to_fp
from pdfminer.layout import LAParams

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_text_from_pdf(file) -> str:
    """Extracts text from a PDF file using pdfminer.six."""
    laparams = LAParams(
        line_margin=0.5,
        char_margin=2.0,
        word_margin=0.1,
        boxes_flow=0.5,
        detect_vertical=False,
    )
    output_string = StringIO()
    try:
        with open(file, 'rb') as fin:
            extract_text_to_fp(fin, output_string, laparams=laparams)
        return output_string.getvalue()
    except FileNotFoundError:
        print(f"Error: File not found at {file}")
        return ""
    except Exception as e:
        print(f"An error occurred: {e}")
        return ""

def generate_mcqs_from_text(text: str):
    prompt = f"""
You are a helpful summarizer that specializes in generating easy-to-understand summaries and Multiple-Choice Questions for school students. You have to read the chapters from the school textbooks that we provide and rewrite them in simple words, making it easier for students (grades 6–10) to understand and learn. Your tone should be clear, neutral, and student-friendly.

PDF File: This is a textbook chapter provided in PDF format. It may contain images, headers, and formatting, but your focus should be only on the actual instructional text.

## Data Categories to Extract:

1. summary: Generate a summary of the chapter in **simple language** that a school student (grade 6–10) can easily understand.
2. mcqs: Generate **30 SCQs** based on the content present in the given chapter (Questions should not be repeated).
   Each question must have:
   - A question in clear, age-appropriate language.
   - 4 answer options (A, B, C, D).
   - One correct answer.
   - A short and clear explanation for the correct answer.

## Difficulty Levels (Important):

- The **first 10 questions** should be **easy** level.
- The **next 10 questions** should be **medium** level.
- The **last 10 questions** should be **hard** level.

## General Instructions

Always read the entire input in a chronological order and tag things only based on the entire understanding of the context.
Strictly do not assume or hallucinate anything.
All the tags should be in English, if any other languages are encountered, translate them to English.
Do not use complex words or technical jargon.
Keep the summary **under 1000 words** - in bullet points.
Include only **key ideas**, **important points**, and **main explanations** in the summary.
Do not list page numbers or refer to any layout elements like 'on this page' or 'as seen in the figure'.
Images should be ignored or not interpreted unless they contain clearly visible instructional text.
Ensure that all information is accurate and age-appropriate.
While generating the JSON file, for each question add a feature "difficulty" based on the difficulty of the question

## Output Format:

The output must be a JSON object with the following structure:
{{
  "summary": list[str],
  "mcqs": [
    {{
      "question": "<SCQ question>",
      "options": {{
        "A": "<option A>",
        "B": "<option B>",
        "C": "<option C>",
        "D": "<option D>"
      }},
      "answer": "A",
      "explanation": "<short explanation for the correct answer>",
      "difficulty": "easy"
    }},
    // ... 29 more questions ...
  ]
}}

Text:
{text[:5000]}
"""
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}]
        )
        # Just return the raw content for now
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return ""
