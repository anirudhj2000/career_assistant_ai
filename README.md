# Career Assistant AI

Career Assistant AI is an intelligent platform designed to assist users in creating resumes, exploring career opportunities, and managing job applications. Built using OpenAI's Realtime API for natural language understanding and Twilio for real-time communication, this application combines AI-driven insights with seamless user interactions.

---

## **Tech Stack**

### **Backend**
- **Node.js**: Backend logic and integrations.
- **OpenAI Realtime API**: For generating resumes and natural language processing.
- **Twilio**: For real-time call and message handling.

### **Frontend**
- **Next.js**: Framework for building the user interface.
- **React.js**: Used in components for UI interactivity.

### **Deployment**
- **Monorepo Structure**:
  - `career_assistant_ui`: The UI project built with Next.js.
  - `career_assistant_be`: The backend project powered by Node.js.
- **Local Development**:
  - **ngrok**: Used to expose the local server to the internet for Twilio webhooks and testing.

---

## **Features**

1. **AI Resume Building**:
   - Generate professional resumes using OpenAI.
   - Support for multiple languages and custom fields.

2. **Real-Time Communication**:
   - Twilio integration for live interactions.
   - Job search activation and email notifications.

3. **Monorepo Architecture**:
   - Simplifies project management and code sharing across frontend and backend.

4. **Local Development with ngrok**:
   - Easily test Twilio webhooks locally.

---

## **Setup Instructions**

### **Prerequisites**
- Node.js (v16 or later)
- npm or yarn
- ngrok (for local testing)
- MongoDB (for data storage)
- Twilio Account
- OpenAI API Key

---

### **1. Clone the Repository**
```bash
git clone https://github.com/your-repo/career-assistant-ai.git
cd career-assistant-ai
