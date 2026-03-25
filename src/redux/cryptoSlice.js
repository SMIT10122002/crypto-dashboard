import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCoinDetails, getCoinMarketChart, getCoins } from "../services/api";

const WATCHLIST_KEY = "crypto-dashboard-watchlist";

const loadWatchlist = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(WATCHLIST_KEY);
    return storedValue ? JSON.parse(storedValue) : [];
  } catch {
    return [];
  }
};

const persistWatchlist = (watchlist) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
};

const coerceErrorMessage = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    if (typeof value.message === "string") {
      return value.message;
    }

    if (typeof value.error === "string") {
      return value.error;
    }
  }

  return fallback;
};

const buildErrorMessage = (error, fallback) => {
  const status = error.response?.status;

  if (status === 401 || status === 403) {
    return "CoinGecko rejected the request. Add VITE_COINGECKO_DEMO_API_KEY to your .env file and restart the dev server.";
  }

  if (status === 429) {
    return "CoinGecko rate limit reached. Wait a moment and refresh the dashboard.";
  }

  if (error.code === "ERR_NETWORK") {
    return "Browser request blocked. Use the built-in Vite proxy in development or configure VITE_COINGECKO_BASE_URL for deployment.";
  }

  return (
    coerceErrorMessage(error.response?.data, null) ||
    coerceErrorMessage(error.response?.data?.error, null) ||
    error.message ||
    fallback
  );
};

export const fetchCoins = createAsyncThunk("crypto/fetchCoins", async (currency, thunkApi) => {
  try {
    return await getCoins(currency);
  } catch (error) {
    return thunkApi.rejectWithValue(buildErrorMessage(error, "Unable to fetch market data."));
  }
});

export const fetchCoinDetails = createAsyncThunk("crypto/fetchCoinDetails", async (id, thunkApi) => {
  try {
    return await getCoinDetails(id);
  } catch (error) {
    return thunkApi.rejectWithValue(buildErrorMessage(error, "Unable to fetch coin details."));
  }
});

export const fetchCoinHistory = createAsyncThunk(
  "crypto/fetchCoinHistory",
  async ({ id, days, currency }, thunkApi) => {
    try {
      return await getCoinMarketChart(id, days, currency);
    } catch (error) {
      return thunkApi.rejectWithValue(buildErrorMessage(error, "Unable to fetch chart data."));
    }
  },
);

const cryptoSlice = createSlice({
  name: "crypto",
  initialState: {
    coins: [],
    coinsStatus: "idle",
    coinsError: null,
    selectedCoin: null,
    selectedCoinStatus: "idle",
    selectedCoinError: null,
    coinHistory: [],
    historyStatus: "idle",
    historyError: null,
    searchTerm: "",
    currency: "usd",
    activeRange: 7,
    watchlist: loadWatchlist(),
  },
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setCurrency(state, action) {
      state.currency = action.payload;
    },
    setActiveRange(state, action) {
      state.activeRange = action.payload;
    },
    toggleWatchlist(state, action) {
      const coinId = action.payload;

      if (state.watchlist.includes(coinId)) {
        state.watchlist = state.watchlist.filter((id) => id !== coinId);
      } else {
        state.watchlist.push(coinId);
      }

      persistWatchlist(state.watchlist);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.coinsStatus = "loading";
        state.coinsError = null;
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.coinsStatus = "succeeded";
        state.coins = action.payload;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.coinsStatus = "failed";
        state.coinsError = action.payload;
      })
      .addCase(fetchCoinDetails.pending, (state) => {
        state.selectedCoinStatus = "loading";
        state.selectedCoinError = null;
      })
      .addCase(fetchCoinDetails.fulfilled, (state, action) => {
        state.selectedCoinStatus = "succeeded";
        state.selectedCoin = action.payload;
      })
      .addCase(fetchCoinDetails.rejected, (state, action) => {
        state.selectedCoinStatus = "failed";
        state.selectedCoinError = action.payload;
      })
      .addCase(fetchCoinHistory.pending, (state) => {
        state.historyStatus = "loading";
        state.historyError = null;
      })
      .addCase(fetchCoinHistory.fulfilled, (state, action) => {
        state.historyStatus = "succeeded";
        state.coinHistory = action.payload.prices ?? [];
      })
      .addCase(fetchCoinHistory.rejected, (state, action) => {
        state.historyStatus = "failed";
        state.historyError = action.payload;
      });
  },
});

export const { setActiveRange, setCurrency, setSearchTerm, toggleWatchlist } =
  cryptoSlice.actions;

export default cryptoSlice.reducer;
