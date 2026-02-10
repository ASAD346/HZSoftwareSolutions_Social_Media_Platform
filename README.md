# SocialSphere - Mini Social Media Platform

A modern, responsive social media application built with **Node.js**, **Express**, **MySQL**, and **Vanilla JavaScript**. Features a premium glassmorphism design.

## Features

*   **User Authentication**: Sign up and login with secure password hashing (bcrypt).
*   **User Profiles**: Customizable profiles with bios and profile pictures.
*   **Feed**: Real-time feed of posts from all users (or followed users).
*   **Posts**: Create posts with text and image uploads.
*   **Interactions**: Like posts and comment on them.
*   **Follow System**: Follow other users to see their stats.
*   **Responsive Design**: Fully responsive UI with specific mobile optimizations and a glassmorphism aesthetic.

## Tech Stack

*   **Backend**: Node.js, Express.js (Lambda compatible)
*   **Database**: PostgreSQL (Supabase)
*   **Frontend**: HTML5, CSS3, Vanilla JavaScript
*   **Styling**: Custom CSS with Glassmorphism
*   **Hosting**: Netlify (Frontend + Serverless Functions)

## Prerequisites

*   Node.js (v18 or higher recommended)
*   Supabase Account
*   Netlify Account

## Setup Instructions

1.  **Clone the repository**
    ```bash
    git clone <repository_url>
    cd <repository_folder>
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Supabase Setup**
    *   Create a new project on [Supabase.io](https://supabase.io).
    *   Go to the SQL Editor in Supabase dashboard.
    *   Copy content from `database/schema_postgres.sql` and run it to create tables.
    *   Get your connection string from Project Settings -> Database -> Connection String -> URI.

4.  **Environment Variables**
    *   Create a `.env` file in the root directory.
    *   Add your database connection string:
        ```env
        DATABASE_URL="postgres://[user]:[password]@[host]:5432/[db_name]"
        PORT=3000
        ```

5.  **Run Locally**
    ```bash
    npm start
    ```
    Or for development with auto-reload:
    ```bash
    npm run dev
    ```

6.  **Deploy to Netlify**
    *   Login to Netlify and create a new site from Git.
    *   Link to this repository.
    *   **Build settings**:
        *   Build command: (leave empty)
        *   Publish directory: `public`
    *   **Environment Variables** (in Netlify Site Settings):
        *   Key: `DATABASE_URL`
        *   Value: Your Supabase Connection String
    *   Deploy! The backend will automatically be deployed as Netlify Functions.
    ```bash
    npm run dev
    ```

6.  **Access the App**
    *   Open your browser and go to `http://localhost:3000`.

## License

MIT
