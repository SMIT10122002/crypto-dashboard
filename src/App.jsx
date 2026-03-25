import { AnimatePresence, motion } from "framer-motion";
import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";

const Home = lazy(() => import("./pages/Home"));
const CoinDetails = lazy(() => import("./pages/CoinDetails"));
const Watchlist = lazy(() => import("./pages/Watchlist"));

const THEME_KEY = "crypto-dashboard-theme";

function App() {
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    return savedTheme ?? "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <div className="relative min-h-screen overflow-hidden px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-[-6rem] mx-auto hidden h-56 w-56 rounded-full bg-cyan-400/12 blur-2xl floating-orb lg:block" />
      <div className="pointer-events-none absolute bottom-0 right-0 hidden h-64 w-64 rounded-full bg-orange-400/8 blur-2xl floating-orb lg:block" />

      <div className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-7xl flex-col gap-5 sm:min-h-[calc(100vh-2rem)] sm:gap-6">
        <Navbar
          theme={theme}
          onThemeToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
        />

        <main className="flex-1">
          <Suspense fallback={<Loader />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Routes location={location}>
                  <Route path="/" element={<Home />} />
                  <Route path="/coin/:id" element={<CoinDetails />} />
                  <Route path="/watchlist" element={<Watchlist />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>

        <footer className="px-2 pb-3 text-center text-xs leading-6 text-muted sm:pb-4 sm:text-sm">
          Market data powered by CoinGecko. Built with React, Tailwind, Redux Toolkit, and
          Recharts.
        </footer>
      </div>
    </div>
  );
}

export default App;
