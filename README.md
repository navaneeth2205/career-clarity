# Career Clarity

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.15-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)]()

## Description

Career Clarity is a full-stack career guidance platform designed to help users make informed academic and professional decisions. The application combines a modern React frontend with a Django-based backend to deliver personalized insights, structured recommendations, and a clean user experience.

## Live Demo

Explore the deployed application here:

- [ADD LIVE DEMO LINK](https://career-clarity-three.vercel.app/)

## Screenshots / UI Preview

All UI images and screenshots are stored inside the root-level `/screenshots` folder, outside `src`.

### Preview Images

![Home Screen](screenshots/home.png)

![Resume Screen](screenshots/Resume.png)

![Working Screen](screenshots/Working.png)

Use the following Markdown syntax to display images from that folder:

```md
![Home Screen](screenshots/home.png)
![Resume Screen](screenshots/Resume.png)
![Working Screen](screenshots/Working.png)
```

## Features

- Personalized career and academic guidance
- Clean, responsive, and user-friendly interface
- Modular frontend architecture for scalable UI development
- Django backend for application logic and data handling
- Ready for future enhancements such as analytics, recommendations, and content expansion

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios

### Backend

- Django
- Django REST-style architecture
- Python

## Installation

### Prerequisites

- Node.js and npm
- Python 3.11 or compatible version
- Git

### Frontend Setup

```bash
git clone <your-repository-url>
cd career-clarity/career-clarity-main
npm install
npm run dev
```

### Backend Setup

```bash
cd career-clarity/career-clarity-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

## Usage

1. Start the backend server.
2. Start the frontend development server.
3. Open the app in your browser and explore the available career clarity features.

### Helpful Commands

```bash
# Frontend
npm run dev
npm run build
npm run preview

# Backend
python manage.py runserver
python manage.py migrate
```

## Folder Structure

```text
career-clarity/
├── components/        → contains UI images/screenshots
├── src/               → source code
├── public/            → static assets
├── career-clarity-backend/  → Django backend
└── career-clarity-main/      → React frontend
```

## Future Improvements

- Add more personalized recommendation logic
- Expand analytics and progress tracking features
- Improve accessibility across the interface
- Add richer screenshots and product walkthroughs
- Introduce automated testing for frontend and backend flows

## Team Contributions

This project was developed as a group effort. Key contributions are summarized below:

- Vivek Verma: Frontend development and UI/UX support
- Ashok Reddy: Frontend development ,deployment
- Harsha Srinivas: Documentation and project support
- Satish Sahu: Documentation and UI/UX support
- B. Navaneeth: Backend development and deployemnt

## Contributing

Contributions are welcome. If you would like to improve the project:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes with clear commits.
4. Open a pull request describing your updates.

Please keep contributions focused, well-documented, and consistent with the existing code style.

## License

This project is licensed under the [MIT License](LICENSE).

You are free to use, modify, and distribute this project in accordance with the terms of the license.

