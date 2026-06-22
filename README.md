# 🍽️ DineFlow Frontend

A modern restaurant reservation and table management web application built with **React, TypeScript, Vite, Tailwind CSS, and JWT Authentication**.

The frontend provides customers with an easy way to reserve restaurant tables, browse menus, manage bookings, and access reservation details, while administrators can manage tables, menu items, users, and reservations through a dedicated dashboard.

---

# 📖 Overview

DineFlow Frontend allows users to:

* Register and Login
* Browse Restaurant Menus
* Create Table Reservations
* Select Function Types
* Manage Reservations
* View Reservation Details
* Generate QR Codes for Check-In
* Update User Profiles
* Access Role-Based Dashboards

Administrators can:

* Manage Users
* Manage Tables
* Manage Menu Items
* Monitor Reservations
* View Reservation Statistics

---

# ✨ Features

## 🔐 Authentication & Authorization

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Role-Based Access Control
* Persistent User Sessions

---

## 🍽️ Reservation Management

Users can:

* Create Reservations
* Select Event Types
* Choose Available Tables
* Select Food & Beverage Packages
* Add Special Requests
* View Reservation History
* View Reservation Details
* Cancel Reservations

---

## 📱 QR Code System

Users can:

* Generate Reservation QR Codes
* View Reservation QR Codes
* Use QR Codes for Restaurant Check-In

---

## 👤 User Profile Management

Users can:

* View Profile Information
* Update Personal Information
* Change Password

---

## 📊 Administrative Features

### Administrator

* Dashboard Overview
* User Management
* Table Management
* Menu Management
* Reservation Monitoring
* View Reservation Details
* Manage Restaurant Operations

---

# 🏗️ System Architecture

## High-Level Architecture

```text
┌─────────────────────────┐
│        Browser          │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ React + TypeScript App  │
│          Vite           │
└───────────┬─────────────┘
            │
       Axios Requests
            │
            ▼
┌─────────────────────────┐
│      Express API        │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│        MongoDB          │
└─────────────────────────┘
```

---

# 🔐 Authentication Flow

```text
User Login
     │
     ▼
Login Form
     │
     ▼
POST /auth/login
     │
     ▼
JWT Token Returned
     │
     ▼
Token Stored
     │
     ▼
Protected Routes Access
```

---

# 🍽️ Reservation Flow

```text
Create Reservation
       │
       ▼
Select Function Type
       │
       ▼
Choose Date & Time
       │
       ▼
Select Table
       │
       ▼
Choose Menu Items
       │
       ▼
Review Reservation
       │
       ▼
Submit Reservation
       │
       ▼
QR Code Generated
```

---

# 🛠️ Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router DOM
* Axios

## Authentication

* JWT Authentication
* Role-Based Authorization

## Development Tools

* ESLint
* TypeScript
* Git & GitHub
* VS Code

---

# 📂 Project Structure

```text
src/
│
├── components/
│   ├── MenuCard.tsx
│   ├── Navbar.tsx
│   └── ReservationCard.tsx
│
├── context/
│   └── AuthContext.tsx
│
├── hooks/
│   └── useAuth.ts
│
├── pages/
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── UserDashboard.tsx
│   ├── CreateReservation.tsx
│   ├── MyReservations.tsx
│   ├── ReservationDetail.tsx
│   ├── UserProfile.tsx
│   ├── ViewMenu.tsx
│   └── AdminDashboard.tsx
│
├── routes/
│   ├── AdminRoute.tsx
│   └── ProtectedRoute.tsx
│
├── services/
│   ├── authService.ts
│   └── tableService.ts
│
├── App.tsx
├── main.tsx
├── App.css
└── index.css
```

---

# 📡 Frontend Routes

| Route                | Description         |
| -------------------- | ------------------- |
| /                    | Landing Page        |
| /login               | User Login          |
| /register            | User Registration   |
| /user                | User Dashboard      |
| /reservations/create | Create Reservation  |
| /reservations/my     | My Reservations     |
| /reservations/:id    | Reservation Details |
| /menu                | View Menu           |
| /profile             | User Profile        |
| /admin               | Admin Dashboard     |

---

# ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:

```env
VITE_API_URL=https://your-backend-url.com/api
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/peha2004/dineflow_frontend.git
```

```bash
cd dineflow_frontend
```

---

## Install Dependencies

```bash
npm install
```

---

## Start Development Server

```bash
npm run dev
```

Application runs on:

```text
http://localhost:5173
```

---

## Build for Production

```bash
npm run build
```

---

## Preview Production Build

```bash
npm run preview
```

---

# 🔒 Security Features

* JWT Authentication
* Protected Routes
* Role-Based Authorization
* Secure API Communication
* Token-Based Session Management

---

# 📈 Future Improvements

* Online Payments
* Email Notifications
* SMS Reservation Alerts
* Table Availability Calendar
* Restaurant Analytics Dashboard
* Customer Reviews & Ratings
* Multi-Branch Restaurant Support

---

# 🚀 Deployment

Frontend can be deployed using:

* Vercel
* Netlify
* GitHub Pages

Backend can be deployed using:

* Render
* Railway
* Vercel

---

# 👨‍💻 Developer

**Ranuthi Pehansa**

Full-Stack Developer

Built using:

* React
* TypeScript
* Vite
* Tailwind CSS
* Node.js
* Express.js
* MongoDB

---

# 📄 License

This project was developed for educational and learning purposes.

---

# ⭐ Support

If you found this project useful:

* Star the repository ⭐
* Fork the repository 🍴
* Share feedback and suggestions 💡

