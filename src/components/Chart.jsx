import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { currencySymbols, formatCurrency } from "../services/formatters";

const formatXAxisLabel = (timestamp, range) => {
  const options =
    range <= 7
      ? { month: "short", day: "numeric" }
      : { month: "short", year: "2-digit" };

  return new Date(timestamp).toLocaleDateString("en-US", options);
};

function Chart({ prices, currency, range }) {
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false,
  );

  useEffect(() => {
    const handleResize = () => setIsCompact(window.innerWidth < 640);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chartData = prices.map(([timestamp, price]) => ({
    timestamp,
    label: formatXAxisLabel(timestamp, range),
    price,
  }));

  return (
    <div className="glass-strong accent-ring flex h-[280px] min-w-0 flex-col p-3 min-[420px]:h-[300px] sm:h-[360px] sm:p-6">
      <div className="mb-3 flex shrink-0 flex-col gap-3 min-[420px]:mb-4 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted">Price action</p>
          <h3 className="mt-2 font-display text-xl text-ink sm:text-2xl">Trend signal</h3>
        </div>
        <div className="interactive-chip w-fit px-3 py-1 text-[11px] sm:text-xs">
          Live market pulse
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: isCompact ? 4 : 10, left: 0, bottom: 0 }}
          >
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.65} />
              <stop offset="95%" stopColor="var(--accent-2)" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey="timestamp"
            axisLine={false}
            tickLine={false}
            minTickGap={isCompact ? 14 : 28}
            tick={{ fill: "var(--muted)", fontSize: isCompact ? 10 : 12 }}
            tickFormatter={(value) => formatXAxisLabel(value, range)}
          />
          <YAxis
            hide={isCompact}
            axisLine={false}
            tickLine={false}
            width={76}
            tick={{ fill: "var(--muted)", fontSize: 12 }}
            tickFormatter={(value) =>
              `${currencySymbols[currency] ?? "$"}${new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 2,
              }).format(value)}`
            }
          />
          <Tooltip
            contentStyle={{
              background: "rgba(8,18,32,0.92)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              color: "#eef9ff",
              maxWidth: isCompact ? "200px" : "240px",
            }}
            formatter={(value) => [formatCurrency(value, currency), "Price"]}
            labelFormatter={(value) =>
              new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            }
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="var(--accent)"
            strokeWidth={3}
            fill="url(#chartGradient)"
            fillOpacity={1}
          />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Chart;
