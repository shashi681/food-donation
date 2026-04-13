# 🍎 Sustain - Food Donation System

A professional, high-end food donation management platform that connects Restaurants (Donors) with NGOs (Receivers). 

Built with **Node.js, Express, MongoDB**, and a **Premium Glassmorphism Frontend**.

## 🚀 Deployment Instructions (Render.com)

To get this project live on the web:

1.  **Sign Up**: Create a free account at [Render.com](https://render.com) and link your GitHub.
2.  **New Web Service**: Click **New +** -> **Web Service**.
3.  **Select Repository**: Select `food-donation` from your GitHub list.
4.  **Configure Settings**:
    - **Runtime**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
5.  **Environment Variables**: Go to the **Environment** tab and add these:
    - `MONGO_URI`: (Your MongoDB connection string from Atlas)
    - `JWT_SECRET`: (Any long random string of your choice)
    - `NODE_ENV`: `production`
6.  **Deploy**: Click **Create Web Service**.

## 🛠️ Local Setup

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Create a `.env` file based on `.env.example`.
4.  Run in development: `npm run dev`
5.  Visit `http://localhost:5000`

## ✨ Features
- **Modern UI**: Dark-mode Glassmorphism with Phosphor Icons.
- **Role-Based Access**: Specialized dashboards for Restaurants and NGOs.
- **Real-time Status**: Track donations from "Pending" to "Collected".
- **Responsive Design**: Works on Desktop and Tablets.

## 📄 License
MIT
