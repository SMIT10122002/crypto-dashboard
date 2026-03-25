import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { setCurrency, setSearchTerm } from "../redux/cryptoSlice";

function Navbar({ theme, onThemeToggle }) {
  const dispatch = useDispatch();
  const { currency, searchTerm, watchlist } = useSelector((state) => state.crypto);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass-strong sticky top-3 z-30 px-4 py-4 sm:top-4 sm:px-6 sm:py-5"
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-accent">Pulse Ledger</p>
            <h1 className="mt-2 font-display text-xl gradient-text sm:text-3xl">
              Crypto command center
            </h1>
          </div>

          <nav className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
            {[
              { label: "Dashboard", to: "/" },
              { label: `Watchlist (${watchlist.length})`, to: "/watchlist" },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `${isActive ? "interactive-chip-active" : "interactive-chip"} justify-center text-center`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="input-shell flex w-full items-center gap-3 lg:min-w-[260px] lg:max-w-[340px]">
            <span className="text-base">⌕</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => dispatch(setSearchTerm(event.target.value))}
              placeholder="Search Bitcoin, Solana, XRP..."
              className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
            />
          </label>

          <div className="input-shell grid w-full grid-cols-2 gap-2 p-1 min-[420px]:w-auto min-[420px]:grid-cols-2">
            {["usd", "inr"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => dispatch(setCurrency(option))}
                className={`rounded-full px-4 py-2 text-center text-sm uppercase transition duration-300 ${
                  currency === option ? "interactive-chip-active" : "text-muted hover:text-ink"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onThemeToggle}
            className="interactive-chip w-full justify-center text-center text-ink min-[420px]:w-auto"
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;
