# Takeoff Backend API

This repository contains the backend API for the Takeoff application, built with Express.js and Prisma (PostgreSQL).

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/OpenSourceNest/takeoff-backend.git
    cd takeoff-backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure environment variables:
    Create a `.env` file in the root directory and add your database URL:
    ```
    DATABASE_URL="postgres://user:password@host:5432/dbname"
    PORT=3000
    
    # Email Configuration (Nodemailer)
    SMTP_HOST="smtp.example.com"
    SMTP_PORT=587
    SMTP_USER="your_user"
    SMTP_PASS="your_password"
    ```

4.  Synchronize the database schema:
    ```bash
    npx prisma db push
    ```

5.  Generate the Prisma Client:
    ```bash
    npx prisma generate
    ```

### Running the Server

-   **Development Mode:**
    ```bash
    npm run dev
    ```
    Runs the server using `nodemon` and `tsx` on port 3000 (or `PORT` defined in `.env`).

-   **Production Build:**
    ```bash
    npm install && npm run build
    npm start
    ```

## API Endpoints

### Base URL

All event API endpoints are prefixed with `/api/events`.

### 1. Root Check
-   **Method:** `GET`
-   **URL:** `/`
-   **Description:** Returns the count of total registrations. Useful for verifying database connection.
-   **Response:**
    ```json
    "There are 5 registrations in the database."
    ```

### 2. Create Registration
-   **Method:** `POST`
-   **URL:** `/api/events/register`
-   **Description:** Creates a new event registration.
-   **Body:**
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "isCommunityMember": true,
      "role": "DEVELOPER",
      "roleOther": "string (optional)",
      "location": "New York",
      "locationOther": "string (optional)",
      "openSourceKnowledge": "5" 
    }
    ```
    *Note: `openSourceKnowledge` can be a string or number (1-10).*

-   **Success Response (201):**
    ```json
    {
      "success": true,
      "data": {
        "id": "cm1...",
        "firstName": "John",
        ...
        "createdAt": "2024-..."
      }
    }
    ```

### 3. Get All Registrations
-   **Method:** `GET`
-   **URL:** `/api/events/registrations`
-   **Description:** Retrieves a list of all registrations, ordered by newest first.
-   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": [
        { "id": "...", ... },
        { "id": "...", ... }
      ]
    }
    ```

### 4. Update Registration
-   **Method:** `PUT`
-   **URL:** `/api/events/registrations/:id`
-   **Description:** Updates an existing registration.
-   **Params:** `id` (String) - The ID of the registration to update.
-   **Body:** (Partial object of create body)
    ```json
    {
      "firstName": "Jane",
      "openSourceKnowledge": 8
    }
    ```
-   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": { ...updatedObject }
    }
    ```

### 5. Delete Registration
-   **Method:** `DELETE`
-   **URL:** `/api/events/registrations/:id`
-   **Description:** Deletes a registration by ID.
-   **Success Response (200):**
    ```json
    {
      "success": true,
      "message": "Registration deleted successfully"
    }
    ```

## Email Notifications

The system is configured to send automatic welcome emails upon successful registration.

-   **Trigger:** Successful `POST /api/events/register` request.
-   **Service:** Nodemailer (SMTP).
-   **Configuration:** Requires valid SMTP credentials in `.env`.
-   **Behavior:** Fire-and-forget (non-blocking). Errors are logged but do not fail the API request.

## Deployment (Render)

The project is configured for deployment on platforms like Render.

-   **Build Command:** `npm install && npm run build`
-   **Start Command:** `npm start`