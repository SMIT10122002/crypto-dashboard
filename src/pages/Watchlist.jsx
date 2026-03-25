import { motion } from "framer-motion";
import { useDeferredValue, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CoinCard from "../components/CoinCard";
import Loader from "../components/Loader";
import { fetchCoins, toggleWatchlist } from "../redux/cryptoSlice";

function Watchlist() {
  const dispatch = useDispatch();
  const { coins, coinsError, coinsStatus, currency, searchTerm, watchlist } = useSelector(
    (state) => state.crypto,
  );
  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    dispatch(fetchCoins(currency));
  }, [currency, dispatch]);

  const favoriteCoins = coins.filter((coin) => watchlist.includes(coin.id));
  const visibleWatchlist = favoriteCoins.filter((coin) => {
    const query = deferredSearchTerm.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query);
  });

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <section className="glass-strong p-5 sm:p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">Watchlist</p>
        <h2 className="mt-4 font-display text-3xl text-ink sm:text-5xl">Your conviction board</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
          Save high-priority coins, revisit them fast, and keep the same search and currency
          context as the main dashboard.
        </p>
      </section>

      {coinsStatus === "loading" && coins.length === 0 ? <Loader /> : null}

      {coinsStatus === "failed" ? (
        <div className="status-error rounded-3xl px-5 py-4 text-sm">
          {coinsError}
        </div>
      ) : null}

      {watchlist.length === 0 ? (
        <div className="glass-panel px-5 py-10 text-center sm:px-6 sm:py-12">
          <p className="text-2xl font-semibold text-ink">No saved coins yet.</p>
          <p className="mt-3 text-muted">Open the dashboard and use the Save action on any coin card.</p>
          <Link
            to="/"
            className="interactive-chip mt-6 inline-flex w-full justify-center text-ink sm:w-auto"
          >
            Browse market movers
          </Link>
        </div>
      ) : null}

      {watchlist.length > 0 && visibleWatchlist.length === 0 ? (
        <div className="surface-soft rounded-[28px] border px-6 py-12 text-center text-muted">
          No saved coins match your current search.
        </div>
      ) : null}

      {visibleWatchlist.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleWatchlist.map((coin) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              currency={currency}
              isFavorite
              onToggleWatchlist={(coinId) => dispatch(toggleWatchlist(coinId))}
            />
          ))}
        </section>
      ) : null}
    </motion.div>
  );
}

export default Watchlist;
