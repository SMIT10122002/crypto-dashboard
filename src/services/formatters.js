export const currencySymbols = {
  usd: "$",
  inr: "₹",
};

export const formatCurrency = (value, currency = "usd") => {
  if (value === null || value === undefined) {
    return "--";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
};

export const formatCompactCurrency = (value, currency = "usd") => {
  if (value === null || value === undefined) {
    return "--";
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatCompactNumber = (value) => {
  if (value === null || value === undefined) {
    return "--";
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercent = (value) => {
  if (value === null || value === undefined) {
    return "--";
  }

  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
    signDisplay: "always",
  }).format(value / 100);
};

export const stripHtml = (value = "") =>
  value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
