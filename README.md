# CareerClarity – Frontend

A career guidance web application built with React, Vite, and Tailwind CSS as part of SIH 25094.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/navaneeth2205/career-clarity.git
cd career-clarity
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and update the values as needed:

```bash
cp .env.example .env
```

The default `.env.example` points the API to `http://localhost:5000/api`. Update `VITE_API_URL` if your backend runs on a different host or port.

### 4. Run the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5180**.

## Available Scripts

| Command           | Description                                  |
|-------------------|----------------------------------------------|
| `npm run dev`     | Start the Vite development server (port 5180) |
| `npm run build`   | Build the app for production (output: `dist/`) |
| `npm run preview` | Preview the production build (port 4180)      |

## Project Structure

```
career-clarity/
├── public/
├── src/
│   ├── assets/          # Static assets (images, SVGs)
│   ├── components/      # Shared UI components (Navbar, Footer, Chatbot, …)
│   ├── pages/           # Route-level page components
│   ├── services/        # API service modules (auth, career, resume, …)
│   ├── App.jsx          # Root application component & routing
│   ├── index.css        # Global styles (Tailwind base)
│   └── main.jsx         # React DOM entry point
├── .env.example         # Example environment variables
├── index.html           # HTML entry point
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Environment Variables

| Variable        | Default                        | Description              |
|-----------------|--------------------------------|--------------------------|
| `VITE_API_URL`  | `http://localhost:5000/api`    | Backend API base URL     |
