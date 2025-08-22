# AI_SoftSKill_Coach
The AI Soft Skills Coach is a web application designed to help users improve their interview skills through AI-powered feedback. It simulates a real interview environment, asks questions, and provides feedback on the user's answers based on clarity, relevance, and confidence.
# Features

    Interview Simulation: Users can start an interview by providing their name, experience level, and domain.

    AI-Powered Feedback: The application analyzes user responses and provides feedback on clarity, relevance, and confidence.

    Audio Recording: Users can record their answers using their microphone.

    Interview Summary: After completing the interview, users can view a summary of their performance, including feedback and improvement tips.

    Responsive Design: The application is fully responsive and works on both desktop and mobile devices.

# Technologies Used
Frontend

    React.js: A JavaScript library for building user interfaces.

    Next.js: A React framework for server-side rendering and static site generation.

    Tailwind CSS: A utility-first CSS framework for styling.

    Recharts: A charting library for React.

Backend

    FastAPI: A modern Python web framework for building APIs.

    Python: The programming language used for the backend.

    Sentence Transformers: A library for generating embeddings and analyzing text.

# Getting Started
Prerequisites

    Node.js (v16 or higher) for the frontend.

    Python (v3.8 or higher) for the backend.

    Git for version control.

# Installation

    Clone the Repository:
    git clone https://github.com/your-username/ai-soft-skills-coach.git
    cd ai-soft-skills-coach

  # Set Up the Backend:

    Navigate to the backend directory:
    cd backend

    Create a virtual environment:
    python -m venv venv

    Activate the virtual environment:

        On macOS/Linux:
        source venv/bin/activate

        On Windows:
        venv\Scripts\activate

    Install dependencies:
    pip install -r requirements.txt

    Start the backend server:
    uvicorn main:app --reload

  # Set Up the Frontend:

        Navigate to the frontend directory:

        cd ../frontend

        Install dependencies:

        npm install

        Start the frontend development server:

        npm run dev

    Access the Application:

        Open your browser and navigate to http://localhost:3000.
