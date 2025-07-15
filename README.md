# NexusFlow: Event and Resource Management

NexusFlow is a modern, full-stack web application designed to streamline event and resource management. It provides a seamless interface for users to view upcoming events, check resource availability, and request access to resources. A dedicated admin panel allows for easy management of events, resources, and user requests, all powered by a real-time database and an intelligent AI assistant.

## Features

- **User Authentication**: Secure sign-up and login functionality for users and administrators.
- **Event Management**: An interactive calendar displays all upcoming events. Admins can add or delete events through a dedicated panel.
- **Resource Management**: Users can view a list of available resources. Admins can add new resources and toggle their availability on the fly.
- **Resource Request System**: Users can request access to available resources. These requests appear in the admin panel for approval or denial.
- **Authenticated Admin Panel**: A secure admin page, accessible only to authorized users (`admin@example.com`), for managing all application data.
- **AI-Powered Chatbot**: A helpful AI assistant, built with Genkit, that can answer user questions about events and resource status based on real-time data.
- **Responsive UI**: A modern and clean user interface built with ShadCN UI and Tailwind CSS, ensuring a great experience on any device.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication & Database**: [Firebase](https://firebase.google.com/) (Auth and Firestore)
- **AI/Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A [Firebase](https://firebase.google.com/) project

### Setup and Configuration

1.  **Install Dependencies**:
    Open your terminal and run the following command to install the necessary packages:
    ```bash
    npm install
    ```

2.  **Firebase Configuration**:
    You need to connect the application to your Firebase project.

    - In the root of the project, create a new file named `.env`.
    - Go to your Firebase project settings and find your web app's configuration object.
    - Copy your Firebase credentials into the `.env` file like this:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

3.  **Firestore Security Rules**:
    For the application to read from and write to Firestore, you need to set up the correct security rules.

    - Go to your **Firebase Console**, select your project, and navigate to **Firestore Database > Rules**.
    - Replace the default rules with the following to allow access for authenticated users (this is suitable for development):

    ```
    rules_version = '2';

    service cloud.firestore {
      match /databases/{database}/documents {
        // Allow read/write access for any signed-in user.
        // For production, you should implement more granular rules.
        match /{document=**} {
          allow read, write: if request.auth != null;
        }
      }
    }
    ```
    - Click **Publish** to save the rules.

### Running the Application

Once the setup is complete, you can start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

### Admin Access

- To access the admin panel, sign up or log in with the email: `admin@example.com`.
- Any password will work for this account as long as the email matches.
- Navigate to the `/admin` page using the "Admin" button in the header.
