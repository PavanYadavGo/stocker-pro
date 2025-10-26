"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sparklines, SparklinesLine } from "react-sparklines"
import { Combobox } from "@headlessui/react"

interface Stock {
  symbol: string
  c: number
  d: number
  dp: number
  h: number
  l: number
  sparkline: number[]
}

interface NewsItem {
  headline: string
  source: string
  url: string
  image?: string
}


export default function Home() {
  const [query, setQuery] = useState("")
  const [stocks, setStocks] = useState<Stock[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const defaultStocks = ["NVDA","NFLX","ADBE","INTC","ORCL","PYPL"]

  // Show suggestions while typing
  useEffect(() => {
    if (!query) return setSuggestions([])
    const matches = defaultStocks.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    setSuggestions(matches)
  }, [query])

  // Load default stocks and news on page load
  useEffect(() => {
    const loadDefaultData = async () => {
      setLoading(true)
      try {
        const stockData = await Promise.all(
          defaultStocks.map(async (s) => {
            const res = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${s}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
            )
            const data = await res.json()
            const sparkline = Array.from({ length: 10 }, () => data.c + Math.random()*5)
            return { symbol: s, ...data, sparkline }
          })
        )
        setStocks(stockData)

        const newsRes = await fetch(
          `https://finnhub.io/api/v1/news?category=general&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
        )
        const newsData = await newsRes.json()
        setNews(newsData.slice(0,5))
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadDefaultData()
  }, [])

  const handleSearch = async (symbol?: string) => {
    const s = symbol || query
    if (!s) return
    setLoading(true)
    try {
      const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${s.toUpperCase()}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
      )
      const data = await res.json()
      const sparkline = Array.from({ length: 10 }, () => data.c + Math.random()*5)
      setStocks([{ symbol: s.toUpperCase(), ...data, sparkline }, ...stocks])
    } catch (error) {
      console.error(error)
      alert("Failed to fetch stock data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-600">Stocker Pro</h1>
        <div className="w-64">
          <Combobox
  value={query}
  onChange={(value: string | null) => {
    if (!value) return
    handleSearch(value) // async function called here
  }}
>
  <div className="relative">
    <Combobox.Input
      className="w-full border rounded px-3 py-2"
      placeholder="Search stock symbol..."
      onChange={(e) => setQuery(e.target.value)}
    />
    {suggestions.length > 0 && (
      <Combobox.Options className="absolute mt-1 w-full bg-white border rounded shadow z-50">
        {suggestions.map((s) => (
          <Combobox.Option
            key={s}
            value={s}
            className="cursor-pointer px-3 py-2 hover:bg-gray-100"
          >
            {s}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    )}
  </div>
</Combobox>

        </div>
      </nav>

      {/* Stocks Section */}
      <section className="px-8 py-10">
        <h2 className="text-xl font-semibold mb-6">Top Stocks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map((stock) => (
            <Card key={stock.symbol}>
              <CardHeader>
                <CardTitle>{stock.symbol}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">High: ₹{stock.h}</p>
                <p className="text-sm text-gray-500">Low: ₹{stock.l}</p>
                <p className="text-lg font-semibold mt-2">₹{stock.c}</p>
                <p className={`mt-1 ${stock.dp>0?"text-green-600":"text-red-600"}`}>
                  {stock.dp>0?"+":""}{stock.dp.toFixed(2)}%
                </p>
                <Sparklines data={stock.sparkline} className="mt-2 h-12">
                  <SparklinesLine color={stock.dp>0?"green":"red"} />
                </Sparklines>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* News Section */}
      <section className="px-8 py-10 bg-white">
  <h2 className="text-xl font-semibold mb-6">Latest Market News</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {news.map((item, i) => (
      <Card key={i}>
        {item.image && (
          <img
            src={item.image}
            alt={item.headline}
            className="w-full h-40 object-cover rounded-t"
          />
        )}
        <CardHeader>
          <CardTitle>{item.headline}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-2">Source: {item.source}</p>
          <a
            href={item.url}
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            Read more →
          </a>
        </CardContent>
      </Card>
    ))}
  </div>
</section>
    </main>
  )
}
