# ECU Housing Assistant

A React application built with Vite and Tailwind CSS that provides information about ECU Housing using an AI-powered RAG (Retrieval-Augmented Generation) system via Gradio.

## Features

- **AI Chatbot**: Get answers to your ECU housing questions.
- **College-Age Tone**: Responses are tailored for students.
- **Clean UI**: Modern, responsive design using Tailwind CSS and Motion.

## Local Development

1.  **Clone the repository**:
    ```bash
    git clone <your-github-repo-url>
    cd <repo-name>
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

## Deployment

### GitHub

1.  Create a new repository on GitHub.
2.  Push your code to the repository:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin <your-github-repo-url>
    git push -u origin main
    ```

### Vercel

1.  Go to [Vercel](https://vercel.com).
2.  Click **New Project**.
3.  Import your GitHub repository.
4.  Vercel will automatically detect the Vite project.
5.  Click **Deploy**.

## Environment Variables

This project currently uses a public Gradio space. If you decide to use a private space or add other services, you can add environment variables in Vercel's project settings.
