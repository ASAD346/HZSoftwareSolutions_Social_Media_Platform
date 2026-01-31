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

*   **Backend**: Node.js, Express.js
*   **Database**: MySQL
*   **Frontend**: HTML5, CSS3, Vanilla JavaScript
*   **Styling**: Custom CSS with Glassmorphism
*   **File Uploads**: Multer

## Prerequisites

*   Node.js (v14 or higher)
*   MySQL Server

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

3.  **Database Setup**
    *   Create a MySQL database (e.g., `social_media_db`).
    *   Run the schema script located in `database/schema.sql` to create the tables.

4.  **Environment Variables**
    *   Create a `.env` file in the root directory.
    *   Add your database credentials:
        ```env
        DB_HOST=localhost
        DB_USER=your_user
        DB_PASSWORD=your_password
        DB_NAME=social_media_db
        PORT=3000
        ```

5.  **Run the Server**
    ```bash
    npm start
    ```
    Or for development with auto-reload:
    ```bash
    npm run dev
    ```

6.  **Access the App**
    *   Open your browser and go to `http://localhost:3000`.

## License

MIT
