export async function getStockQuote(symbol: string) {
  const res = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
  );
  return res.json();
}

export async function getStockNews() {
  const res = await fetch(
    `https://finnhub.io/api/v1/news?category=general&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
  );
  return res.json();
}
