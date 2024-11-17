# Career Assistant AI

Career Assistant AI is an intelligent platform designed to help users create resumes, explore career opportunities, and manage job applications. Built using OpenAI's API for natural language understanding and Twilio for real-time communication, this application combines AI-driven insights with seamless user interactions.

---

## Tech Stack

### Backend

- **Node.js**: Handles backend logic and integrations.
- **OpenAI API**: Generates resumes and processes natural language.
- **Twilio**: Manages real-time calls and messages.

### Frontend

- **Next.js**: Framework for building the user interface.
- **React.js**: Provides UI interactivity through components.

### Deployment

- **Monorepo Structure**:
  - `career_assistant_ui`: UI project built with Next.js.
  - `career_assistant_be`: Backend project powered by Node.js.
- **Local Development**:
  - **ngrok**: Exposes the local server to the internet for Twilio webhooks and testing.

---

## Features [![Link](https://docs.google.com/document/d/1Z4fs2A63pehhTRC9giIPhy68bQzwSbkB/edit?usp=sharing&ouid=116269735427886173755&rtpof=true&sd=true))](Document)

1. **AI Resume Building**:

   - Generate professional resumes using OpenAI.
   - Supports multiple languages and custom fields.

2. **Real-Time Communication**:

   - Integrates Twilio for live interactions.
   - Activates job searches and sends email notifications.

3. **Search Jobs**:

   - Scrapes latest openings from Linkedin based on your profile
   - Provides data narrates lisitings and lets you visit listings

---

## Setup Instructions

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- ngrok (for local testing)
- MongoDB (for data storage)
- Twilio Account
- OpenAI API Key

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/career-assistant-ai.git
cd career-assistant-ai
```

### 2. Install Dependencies

```bash
# For backend
cd career_assistant_be
npm install

# For frontend
cd ../career_assistant_ui
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in both `career_assistant_be` and `career_assistant_ui` directories and add the necessary environment variables as specified in the `.env.example` files.

### 4. Start the Development Servers

```bash
# Start backend server
cd career_assistant_be
npm run dev

# Start frontend server
cd ../career_assistant_ui
npm run dev
```

### 5. Expose Local Server with ngrok

```bash
ngrok http 3000
```

Copy the forwarding URL provided by ngrok and update your Twilio webhook settings accordingly.

### 6. Access the Application

Open your browser and navigate to `http://localhost:3000` to access the application.
