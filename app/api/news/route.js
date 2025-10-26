import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const company = searchParams.get("company");
  const key = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  try {
    const res = await axios.get(
      `https://newsapi.org/v2/everything?q=${company}&apiKey=${key}&language=en&sortBy=publishedAt&pageSize=5`
    );
    return new Response(JSON.stringify(res.data.articles), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
