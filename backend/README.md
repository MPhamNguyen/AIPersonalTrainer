# AIPersonalTrainer Chatbot

An intelligent health and fitness backend that uses the Wger Exercise Database and Google Gemini to provide personalized workout routines, real-time coaching via chat, and progressive overload tracking.

## Quick Start

### 1. Installation

Make sure you have Python 3.9+ installed, then install dependencies:

```bash
pip install -r requirements.txt
```

### 2. Create a `.env` file

Create a file named `.env` in the **root of the `backend` folder**.

Example:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Your folder should look like this:

```bash
backend/
├── .env
├── main.py
├── user.json
├── requirements.txt
```

### 3. Load environment variables in your app

Make sure your backend loads the `.env` file. A common setup is:

```python
from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
```

If you do not already have it installed, add:

```bash
pip install python-dotenv
```

### 4. Start the local server

```bash
uvicorn main:app --reload
```

### 5. Open the API docs

Navigate to:

```bash
http://127.0.0.1:8000/docs
```

## Troubleshooting

### Gemini API key not working

Make sure:

- the `.env` file is in the **root of the `backend` folder**
- the variable name is exactly `GEMINI_API_KEY`
- your app calls `load_dotenv()`
- you restarted the server after creating or editing `.env`

### Example `.env`

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Security Notes

- Do **not** hardcode your API key in the source code
- Do **not** commit your `.env` file to GitHub
- Add `.env` to your `.gitignore`