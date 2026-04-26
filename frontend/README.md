# Frontend

This is the frontend for the AI Personal Trainer project.

## Requirements

Before starting, make sure you have these installed:

- Node.js
- npm

You can check with:

```bash
node -v
npm -v
```

## Getting Started

Open a terminal and move into the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

## Run the Frontend

Start the development server with:

```bash
npm run dev
```

After it starts, open the local URL shown in the terminal. In most setups, this is usually:

```bash
http://localhost:5173
```

## Typical Startup Flow

From the project root:

```bash
cd frontend
npm install
npm run dev
```

## Backend Note

If your frontend depends on the FastAPI backend, start the backend in a separate terminal:

```bash
cd backend
uvicorn main:app --reload
```

Backend usually runs at:

```bash
http://127.0.0.1:8000
```

## Troubleshooting

If `npm run dev` does not work:

1. Make sure you are inside the `frontend` folder.
2. Make sure dependencies were installed with `npm install`.
3. Check that Node.js and npm are installed.
4. Make sure the backend is running if the page loads but API requests fail.

## Stop the Dev Server

Press:

```bash
Ctrl + C
```

in the terminal where the frontend is running.