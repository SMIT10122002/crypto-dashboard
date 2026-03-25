import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_COINGECKO_BASE_URL || "/api/coingecko";
const apiKey = import.meta.env.VITE_COINGECKO_DEMO_API_KEY?.trim();

const coinGeckoApi = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  headers: {
    accept: "application/json",
    ...(apiKey ? { "x-cg-demo-api-key": apiKey } : {}),
  },
});

export const getCoins = async (currency = "usd") => {
  const response = await coinGeckoApi.get("", {
    params: {
      endpoint: "coins/markets",
      vs_currency: currency,
      order: "market_cap_desc",
      per_page: 50,
      page: 1,
      sparkline: false,
      price_change_percentage: "24h",
    },
  });

  return response.data;
};

export const getCoinDetails = async (id) => {
  const response = await coinGeckoApi.get("", {
    params: {
      endpoint: `coins/${id}`,
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false,
    },
  });

  return response.data;
};

export const getCoinMarketChart = async (id, days = 7, currency = "usd") => {
  const response = await coinGeckoApi.get("", {
    params: {
      endpoint: `coins/${id}/market_chart`,
      vs_currency: currency,
      days,
      interval: days > 30 ? "daily" : undefined,
    },
  });

  return response.data;
};
