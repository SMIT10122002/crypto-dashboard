import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Chart from "../components/Chart";
import Loader from "../components/Loader";
import {
  fetchCoinDetails,
  fetchCoinHistory,
  setActiveRange,
  toggleWatchlist,
} from "../redux/cryptoSlice";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
  formatPercent,
  stripHtml,
} from "../services/formatters";

const ranges = [
  { label: "7D", value: 7 },
  { label: "30D", value: 30 },
  { label: "1Y", value: 365 },
];

function CoinDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    activeRange,
    coinHistory,
    currency,
    historyError,
    historyStatus,
    selectedCoin,
    selectedCoinError,
    selectedCoinStatus,
    watchlist,
  } = useSelector((state) => state.crypto);

  useEffect(() => {
    dispatch(fetchCoinDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchCoinHistory({ id, days: activeRange, currency }));
  }, [activeRange, currency, dispatch, id]);

  const currentCoin = selectedCoin?.id === id ? selectedCoin : null;
  const description = stripHtml(currentCoin?.description?.en ?? "").slice(0, 420);
  const isFavorite = watchlist.includes(id);

  if (selectedCoinStatus === "loading" && !currentCoin) {
    return <Loader variant="detail" />;
  }

  if (selectedCoinStatus === "failed") {
    return (
      <div className="glass-panel status-error px-6 py-10 text-center">
        <p className="text-lg font-semibold">Unable to load coin details.</p>
        <p className="mt-2 text-sm opacity-80">{selectedCoinError}</p>
      </div>
    );
  }

  if (!currentCoin) {
    return null;
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <section className="glass-strong accent-ring overflow-hidden p-5 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <Link to="/" className="text-sm text-muted transition hover:text-ink">
              ← Back to dashboard
            </Link>

            <div className="mt-5 flex items-center gap-4">
              <div className="surface-soft flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl border sm:h-16 sm:w-16">
                <img
                  src={currentCoin.image?.large ?? currentCoin.image?.small}
                  alt={currentCoin.name}
                  className="h-10 w-10 sm:h-12 sm:w-12"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs uppercase tracking-[0.38em] text-accent">
                  {currentCoin.symbol?.toUpperCase()}
                </p>
                <h2 className="mt-2 break-words font-display text-3xl text-ink sm:text-5xl">
                  {currentCoin.name}
                </h2>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="interactive-chip">
                Rank #{currentCoin.market_cap_rank}
              </div>
              <div className="interactive-chip">
                {currentCoin.hashing_algorithm ?? "Smart-contract ecosystem"}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 xl:items-end">
            <div className="w-full xl:text-right">
              <p className="text-sm text-muted">Current price</p>
              <p className="mt-2 break-words font-display text-3xl text-ink sm:text-4xl">
                {formatCurrency(currentCoin.market_data?.current_price?.[currency], currency)}
              </p>
              <p
                className={`mt-2 text-lg font-semibold ${
                  (currentCoin.market_data?.price_change_percentage_24h ?? 0) >= 0
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                {formatPercent(currentCoin.market_data?.price_change_percentage_24h)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => dispatch(toggleWatchlist(id))}
              className={`interactive-chip w-full justify-center px-5 py-3 text-center text-sm sm:w-auto ${isFavorite ? "favorite-chip" : "text-ink"}`}
            >
              {isFavorite ? "Remove from watchlist" : "Add to watchlist"}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
            {ranges.map((range) => (
              <button
                key={range.value}
                type="button"
                onClick={() => dispatch(setActiveRange(range.value))}
                className={`${activeRange === range.value ? "interactive-chip-active" : "interactive-chip"} justify-center text-center`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {historyStatus === "loading" && coinHistory.length === 0 ? (
            <div className="glass-panel shimmer h-[360px]" />
          ) : null}

          {historyStatus === "failed" ? (
            <div className="status-error rounded-3xl px-5 py-4 text-sm">
              {historyError}
            </div>
          ) : null}

          {coinHistory.length > 0 ? (
            <Chart prices={coinHistory} currency={currency} range={activeRange} />
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="glass-panel grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted">Market cap</p>
              <p className="mt-3 break-words text-xl font-semibold text-ink sm:text-2xl">
                {formatCompactCurrency(currentCoin.market_data?.market_cap?.[currency], currency)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted">24h volume</p>
              <p className="mt-3 break-words text-xl font-semibold text-ink sm:text-2xl">
                {formatCompactCurrency(
                  currentCoin.market_data?.total_volume?.[currency],
                  currency,
                )}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted">
                Circulating supply
              </p>
              <p className="mt-3 break-words text-xl font-semibold text-ink sm:text-2xl">
                {formatCompactNumber(currentCoin.market_data?.circulating_supply)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted">ATH</p>
              <p className="mt-3 break-words text-xl font-semibold text-ink sm:text-2xl">
                {formatCurrency(currentCoin.market_data?.ath?.[currency], currency)}
              </p>
            </div>
          </div>

          <div className="glass-panel p-4 sm:p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">About</p>
            <h3 className="mt-3 font-display text-2xl text-ink">Project brief</h3>
            <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
              {description || "CoinGecko did not return a description for this asset."}
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default CoinDetails;
