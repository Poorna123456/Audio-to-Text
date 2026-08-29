# VoiceText

A modern, full-stack web application that allows users to instantly transcribe spoken audio into text using state-of-the-art AI.

## Features
- Record audio directly from the browser
- Upload existing audio files for transcription
- Multilingual language detection
- Outputs native scripts for languages like Hindi, Kannada, etc.
- Export transcripts as TXT or SRT files

## Tech Stack
- **Frontend**: React, TailwindCSS, Vite
- **Backend**: Python, Flask
- **AI Model**: Faster-Whisper (optimized for local CPU inference)

## How to Run Locally

### 1. Start the Backend
1. Open a terminal and navigate to the `backend-api` folder.
2. Install dependencies (if you haven't already): `pip install -r requirements.txt`
3. Run the Flask server: `python app.py`

### 2. Start the Frontend
1. Open a second terminal and navigate to the `frontend-ui` folder.
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`

The application will now be running on `http://localhost:5174/`.
