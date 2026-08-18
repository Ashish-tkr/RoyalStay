# RoyalStay – Hotel Booking Platform

RoyalStay is a full-stack hotel booking platform built with **React.js, TypeScript, Node.js, Express.js, MongoDB, and Tailwind CSS**. The application provides hotel discovery, search and filtering, user authentication, and end-to-end booking workflows through a modular RESTful backend.

## 🚀 Features

* Dynamic hotel listings
* Hotel search and filtering
* User registration and authentication
* JWT-based authentication
* Hotel details and availability
* End-to-end booking workflow
* RESTful API architecture
* Modular MVC backend
* Responsive UI using Tailwind CSS
* MongoDB-based data management
* Structured frontend and backend separation

## 🛠️ Tech Stack

### Frontend

* React.js
* TypeScript
* Tailwind CSS
* HTML5
* CSS3

### Backend

* Node.js
* Express.js
* RESTful Services
* JWT Authentication
* MVC Architecture

### Database

* MongoDB

### Tools

* Git
* GitHub
* npm
* Postman

## 🏗️ Architecture

RoyalStay follows a modular full-stack architecture separating the frontend, backend, and database layers.

```text
                    ┌──────────────────────┐
                    │       React.js       │
                    │     TypeScript       │
                    │     Tailwind CSS     │
                    └──────────┬───────────┘
                               │
                         RESTful APIs
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Node.js +         │
                    │    Express.js        │
                    │                      │
                    │    MVC Architecture  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       MongoDB        │
                    │     Data Storage     │
                    └──────────────────────┘
```

## 🔐 Authentication

RoyalStay uses **JSON Web Tokens (JWT)** for authentication and authorization.

Authentication flow:

```text
User Registration / Login
          ↓
Credential Validation
          ↓
JWT Token Generated
          ↓
Token Sent to Client
          ↓
Protected API Request
          ↓
JWT Validation
          ↓
Authorized Resource Access
```

JWT-based authentication allows protected APIs to verify the identity of authenticated users.

## 🏨 Hotel Discovery

Users can browse available hotels and use search and filtering functionality to find suitable properties.

The hotel discovery workflow includes:

* Hotel listing
* Search functionality
* Filtering
* Hotel details
* Availability information
* Booking initiation

## 📅 Booking Workflow

The application supports an end-to-end booking workflow:

```text
Search Hotels
     ↓
Apply Filters
     ↓
Select Hotel
     ↓
View Hotel Details
     ↓
Select Booking Details
     ↓
Authenticate User
     ↓
Create Booking
     ↓
Booking Confirmation
```

## 🔌 RESTful API

The backend exposes RESTful services for communication between the React frontend and Express.js server.

The application contains **10+ RESTful APIs** covering operations such as:

* Authentication
* Hotel management
* Hotel search
* Hotel details
* Booking operations
* User-related operations

Example API structure:

```text
/api/auth
/api/hotels
/api/bookings
/api/users
```

> Update the endpoint names above if your actual implementation uses different routes.

## 📂 Project Structure

A typical RoyalStay structure is organized into separate frontend and backend modules:

```text
RoyalStay/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── ...
│   └── package.json
│
└── README.md
```

> The exact structure depends on the current repository implementation.

## ⚙️ Getting Started

### Prerequisites

Install the following before running the application:

* Node.js
* npm
* MongoDB or MongoDB Atlas
* Git

Check Node.js and npm:

```bash
node --version
npm --version
```

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

### 2. Install Frontend Dependencies

If the frontend is inside a `client` directory:

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

Open another terminal or return to the project root:

```bash
cd ../server
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the backend directory.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not commit your real `.env` file to GitHub.

### 5. Start the Backend

```bash
npm start
```

### 6. Start the Frontend

From the frontend directory:

```bash
npm start
```

The frontend will connect to the Express.js backend through the configured REST API.

## 🧪 Testing

The application can be tested using:

* Browser-based functional testing
* REST API testing with Postman
* Authentication and authorization testing
* Hotel search and filtering tests
* Booking workflow testing
* Frontend UI testing

## 🔒 Security

Security considerations implemented in the application include:

* JWT-based authentication
* Protected API routes
* Environment-based configuration for sensitive credentials
* Server-side request validation
* Separation of authentication and application logic

## 📈 Future Improvements

Potential improvements include:

* Online payment integration
* Hotel reviews and ratings
* Email booking confirmations
* Admin dashboard
* Advanced hotel availability management
* Booking cancellation and refund workflows
* Image upload and cloud storage
* Redis caching
* Docker-based deployment
* Automated CI/CD pipeline

## 👨‍💻 Author

**Ashish Kumar**

Computer Science Engineering Graduate | Full-Stack Developer

## 📄 License

This project is available under the MIT License.
