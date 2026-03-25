# Crypto Dashboard

A modern, fast, and interactive Cryptocurrency Dashboard built with React, Vite, Redux Toolkit, and Tailwind CSS. This application fetches real-time market data from the CoinGecko API to provide up-to-date cryptocurrency prices, rich historical charts, and personalized watchlist functionality.

## 🚀 Features

- **Live Market Data:** Real-time cryptocurrency prices, market capitalization, 24h percentage changes, and more using the CoinGecko API.
- **Interactive Charts:** Detailed and responsive historical market charts rendered seamlessly with Recharts for 7-day, 30-day, and customized ranges.
- **Personal Watchlist:** Star your favorite coins to save them to a personalized Watchlist. Your watchlist is preserved securely in your browser's local storage.
- **Search & Filtering:** Search for specific coins and toggle between base currencies (e.g., USD, etc.).
- **Smooth Animations:** Dynamic page transitions and UI micro-animations powered by Framer Motion.
- **Robust State Management:** Centralized caching and state handling implemented smoothly using Redux Toolkit.
- **Responsive Design:** Mobile-first, fully responsive UI built natively with Tailwind CSS to ensure a great experience across all device sizes.

## 🛠️ Tech Stack

- **Frontend Framework:** React 19 (Bootstrapped with Vite)
- **State Management:** Redux Toolkit (`react-redux`, `@reduxjs/toolkit`)
- **Styling:** Tailwind CSS 
- **Routing:** React Router DOM (v6)
- **Data Visualization:** Recharts
- **Animations:** Framer Motion
- **HTTP Client:** Axios

## 📂 Project Structure

```text
src/
├── components/   # Reusable UI components (Navbar, CoinCard, Chart, Loader)
├── pages/        # Application routes (Home, CoinDetails, Watchlist)
├── redux/        # Redux Toolkit store and slices (cryptoSlice.js)
├── services/     # API services and formatters (Axios instance, CoinGecko endpoints)
├── App.jsx       # Root App component and route definitions
├── main.jsx      # Entry point
└── index.css     # Global styles and Tailwind imports
```

## ⚙️ Setup & Installation

Follow these steps to get the project working locally:

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/your-username/crypto-dashboard.git
   cd crypto-dashboard
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```
   *(Note: This project uses `npm` as the package manager, supported by `package-lock.json`)*

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (you can duplicate `.env.example` if it exists) and add your CoinGecko configuration:
   ```env
   VITE_COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
   
   # Optional: Add your Demo API key for higher rate limits
   VITE_COINGECKO_DEMO_API_KEY=your_demo_key_here
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser to view the app!

## 📦 Build for Production

To create a production-ready optimized build:

```bash
npm run build
```
This will compile the application inside the `dist` folder. You can preview the production build using:
```bash
npm run preview
```

## ⚠️ Notes on CoinGecko API

This project utilizes the free-tier CoinGecko Demo API. If you encounter rate-limiting errors (`HTTP 429`), please wait a few moments and try refreshing the application. A `.env` file containing `VITE_COINGECKO_DEMO_API_KEY` can be used to substantially increase your allowed request rate.
