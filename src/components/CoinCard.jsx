import { Link } from "react-router-dom";
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
} from "../services/formatters";

function CoinCard({ coin, currency, isFavorite, onToggleWatchlist }) {
  const isPositive = (coin.price_change_percentage_24h ?? 0) >= 0;

  return (
    <div className="card-shell min-w-0 max-w-full">
      <Link
        to={`/coin/${coin.id}`}
        className="glass-panel block h-full w-full min-w-0 max-w-full overflow-hidden p-3 min-[420px]:p-4 sm:p-5"
      >
        <div className="mb-4 flex min-w-0 flex-col gap-3 min-[420px]:mb-5 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="surface-soft relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border min-[420px]:h-14 min-[420px]:w-14">
              <img src={coin.image} alt={coin.name} className="h-8 w-8 object-contain min-[420px]:h-10 min-[420px]:w-10" />
              <span className="surface-soft absolute -right-1 -top-1 rounded-full border px-1.5 py-0.5 text-[9px] text-muted min-[420px]:px-2 min-[420px]:text-[10px]">
                #{coin.market_cap_rank}
              </span>
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-semibold text-ink min-[420px]:text-base sm:text-lg">
                {coin.name}
              </h3>
              <p className="truncate text-[11px] uppercase tracking-[0.18em] text-muted min-[420px]:tracking-[0.24em]">
                {coin.symbol}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              onToggleWatchlist(coin.id);
            }}
            className={`interactive-chip w-full justify-center self-start px-3 py-1.5 text-center text-xs min-[420px]:w-auto min-[420px]:text-sm ${isFavorite ? "favorite-chip" : ""}`}
          >
            {isFavorite ? "Saved" : "Save"}
          </button>
        </div>

        <div className="mb-4 min-w-0 min-[420px]:mb-5">
          <p className="text-sm text-muted">Current price</p>
          <p className="mt-2 max-w-full overflow-hidden break-all font-sans text-[clamp(1.45rem,7vw,2.1rem)] font-semibold leading-tight text-ink min-[420px]:break-words sm:font-display sm:text-3xl">
            {formatCurrency(coin.current_price, currency)}
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-2.5 min-[520px]:grid-cols-2 sm:gap-3">
          <div className="panel-inset min-w-0">
            <p className="text-xs uppercase tracking-[0.25em] text-muted">24h move</p>
            <p className={`mt-2 max-w-full overflow-hidden break-all text-base font-semibold min-[420px]:break-words min-[420px]:text-lg ${isPositive ? "text-success" : "text-danger"}`}>
              {formatPercent(coin.price_change_percentage_24h)}
            </p>
          </div>

          <div className="panel-inset min-w-0">
            <p className="text-xs uppercase tracking-[0.25em] text-muted">Volume</p>
            <p className="mt-2 max-w-full overflow-hidden break-all text-base font-semibold text-ink min-[420px]:break-words min-[420px]:text-lg">
              {formatCompactCurrency(coin.total_volume, currency)}
            </p>
          </div>
        </div>

        <div className="panel-inset mt-3 min-w-0 min-[420px]:mt-4">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">Market cap</p>
          <p className="mt-2 max-w-full overflow-hidden break-all text-base font-semibold text-ink min-[420px]:break-words min-[420px]:text-lg">
            {formatCompactCurrency(coin.market_cap, currency)}
          </p>
        </div>
      </Link>
    </div>
  );
}

export default CoinCard;
