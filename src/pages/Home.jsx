import { useDeferredValue, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CoinCard from "../components/CoinCard";
import Loader from "../components/Loader";
import { fetchCoins, toggleWatchlist } from "../redux/cryptoSlice";
import { formatCompactCurrency, formatPercent } from "../services/formatters";

function Home() {
  const dispatch = useDispatch();
  const { coins, coinsError, coinsStatus, currency, searchTerm, watchlist } = useSelector(
    (state) => state.crypto,
  );
  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    dispatch(fetchCoins(currency));
  }, [currency, dispatch]);

  const visibleCoins = coins.filter((coin) => {
    const query = deferredSearchTerm.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query);
  });

  const totalMarketCap = coins.reduce((sum, coin) => sum + (coin.market_cap ?? 0), 0);
  const totalVolume = coins.reduce((sum, coin) => sum + (coin.total_volume ?? 0), 0);
  const topPerformer = [...coins].sort(
    (left, right) =>
      (right.price_change_percentage_24h ?? -Infinity) -
      (left.price_change_percentage_24h ?? -Infinity),
  )[0];
  const averageMove =
    coins.length > 0
      ? coins.reduce((sum, coin) => sum + (coin.price_change_percentage_24h ?? 0), 0) /
        coins.length
      : 0;

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-strong accent-ring overflow-hidden p-5 sm:p-8">
          <p className="text-xs uppercase tracking-[0.45em] text-accent">Phase 1 to Phase 4 ready</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
            Trade the market with a cleaner signal layer.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-lg">
            Track the top 50 coins, inspect price momentum, save a watchlist, switch between USD
            and INR, and jump into deeper coin analysis without leaving the dashboard.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="interactive-chip-active text-center">
              Live CoinGecko feed
            </div>
            <div className="interactive-chip text-center">
              Responsive glass UI
            </div>
            <div className="interactive-chip text-center">
              Details charts + watchlist
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-panel p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Top 50 market cap</p>
            <p className="mt-3 font-display text-3xl text-ink">
              {formatCompactCurrency(totalMarketCap, currency)}
            </p>
            <p className="mt-2 text-sm text-muted">
              Aggregate market cap across the visible leaderboard.
            </p>
          </div>

          <div className="glass-panel p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">24h volume</p>
            <p className="mt-3 font-display text-3xl text-ink">
              {formatCompactCurrency(totalVolume, currency)}
            </p>
            <p className="mt-2 text-sm text-muted">
              Capital rotation across the current top market movers.
            </p>
          </div>

          <div className="glass-panel p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Average 24h move</p>
            <p className={`mt-3 font-display text-3xl ${averageMove >= 0 ? "text-success" : "text-danger"}`}>
              {formatPercent(averageMove)}
            </p>
            <p className="mt-2 text-sm text-muted">Quick read on market breadth for the full basket.</p>
          </div>

          <div className="glass-panel p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Top gainer</p>
            <p className="mt-3 font-display text-3xl text-ink">
              {topPerformer?.symbol?.toUpperCase() ?? "--"}
            </p>
            <p className="mt-2 text-sm text-muted">
              {topPerformer
                ? `${topPerformer.name} at ${formatPercent(
                    topPerformer.price_change_percentage_24h,
                  )}`
                : "Waiting for market data."}
            </p>
          </div>
        </div>
      </section>

      <section className="glass-strong min-w-0 overflow-hidden p-2.5 min-[420px]:p-4 sm:p-6">
        <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.35em] text-muted">Leaderboard</p>
            <h3 className="mt-2 font-display text-2xl text-ink sm:text-3xl">Market movers</h3>
          </div>

          <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3 lg:w-auto">
            <div className="panel-inset min-w-0 px-3 py-2 text-center">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted">Visible</p>
              <p className="mt-1 text-sm font-semibold text-ink">{visibleCoins.length} coins</p>
            </div>
            <div className="panel-inset min-w-0 px-3 py-2 text-center">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted">Saved</p>
              <p className="mt-1 text-sm font-semibold text-ink">{watchlist.length} coins</p>
            </div>
            <div className="panel-inset min-w-0 px-3 py-2 text-center">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted">Currency</p>
              <p className="mt-1 text-sm font-semibold text-ink">{currency.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {coinsStatus === "loading" && coins.length === 0 ? <Loader /> : null}

        {coinsStatus === "failed" ? (
          <div className="status-error rounded-3xl px-5 py-4 text-sm">
            {coinsError}
          </div>
        ) : null}

        {coinsStatus !== "loading" && coinsStatus !== "failed" && visibleCoins.length === 0 ? (
          <div className="surface-soft rounded-3xl border px-5 py-10 text-center text-muted">
            No coins match your current search.
          </div>
        ) : null}

        {visibleCoins.length > 0 ? (
          <div className="grid min-w-0 grid-cols-1 gap-3 min-[420px]:gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleCoins.map((coin) => (
              <CoinCard
                key={coin.id}
                coin={coin}
                currency={currency}
                isFavorite={watchlist.includes(coin.id)}
                onToggleWatchlist={(coinId) => dispatch(toggleWatchlist(coinId))}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default Home;
