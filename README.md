# UGHS_QUIZ_APP

## Project Overview

One evening, while contemplating ways to add value to my parents' educational organization (Unique Grammar High School) using AI (LLMs), I conceived the idea of generating quiz content. I shared this concept with my friend Sri Ram, who was enthusiastic about it and believed it would significantly benefit the organization and make learning more engaging for students.

During our discussions on content generation using LLMs, we decided to utilize the OpenAI API. We crafted a well-structured prompt and leveraged the PDF files of chapters to request content generation from the LLM. After receiving the responses, we parsed and stored the content in JSON files.

We then developed a full-stack application using React and FastAPI, with MongoDB serving as our database and JWT for authentication.

Recently, we identified a more efficient approach to content generation using LLMs. We are currently implementing a Retrieval Augmented Generation (RAG) system with ChatGPT to generate quiz content. Once generated, this content will be validated by teachers before being stored in our MongoDB database.

## Tech Stack

### Frontend

- React
- Tailwind CSS
- Axios
- JWT

### Backend

- FastAPI
- MongoDB
- JWT
- OpenAI

### Database

- MongoDB

### UI screens of my Application
<img width="200" height="200" alt="Screenshot 2025-08-04 at 9 54 35 PM" src="https://github.com/user-attachments/assets/d56c3bd4-1d44-400d-80bd-daa28f884ee2" />
<img width="200" height="200" alt="Screenshot 2025-08-04 at 9 54 49 PM" src="https://github.com/user-attachments/assets/20ec6f22-522f-4b55-b021-b71ecbe4a20d" />

