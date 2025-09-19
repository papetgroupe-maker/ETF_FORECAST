"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiBase } from "@/lib/api";
import axios from "axios";

export default function Explore() {
  const [tickers, setTickers] = useState<string[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    axios.get(`${apiBase()}/api/v1/etf/trending`)
      .then(res => setTickers(res.data.tickers || []))
      .catch(() => setTickers(["SPY","QQQ","EEM","IEMB"]));
  }, []);

  const filtered = tickers.filter(t => t.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">Explorer les ETF</h1>
      <input
        value={q}
        onChange={(e)=>setQ(e.target.value)}
        className="w-full border rounded-xl p-3"
        placeholder="Rechercher un ticker (ex: SPY, QQQ)"
      />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map(t => (
          <Link href={`/etf/${t}`} key={t} className="card p-5 hover:shadow-lg transition">
            <div className="font-semibold">{t}</div>
            <div className="text-sm text-gray-600">Voir les prévisions</div>
          </Link>
        ))}
      </div>
    </div>
  );
}