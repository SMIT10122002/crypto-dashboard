const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

const normalizeEndpoint = (value = "") =>
  decodeURIComponent(value).replace(/^\/+/, "");

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const endpoint = normalizeEndpoint(request.query.endpoint);

  if (!endpoint) {
    return response.status(400).json({ error: "Missing endpoint query parameter" });
  }

  const upstreamUrl = new URL(`${COINGECKO_BASE_URL}/${endpoint}`);

  for (const [key, value] of Object.entries(request.query)) {
    if (key === "endpoint") {
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((entry) => upstreamUrl.searchParams.append(key, entry));
    } else if (value !== undefined) {
      upstreamUrl.searchParams.set(key, value);
    }
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: {
        accept: "application/json",
        ...(process.env.COINGECKO_DEMO_API_KEY
          ? { "x-cg-demo-api-key": process.env.COINGECKO_DEMO_API_KEY }
          : {}),
      },
    });

    const responseText = await upstreamResponse.text();
    const contentType = upstreamResponse.headers.get("content-type");

    response.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

    if (contentType) {
      response.setHeader("Content-Type", contentType);
    }

    return response.status(upstreamResponse.status).send(responseText);
  } catch (error) {
    return response.status(502).json({
      error: "Unable to reach CoinGecko",
      details: error.message,
    });
  }
}
