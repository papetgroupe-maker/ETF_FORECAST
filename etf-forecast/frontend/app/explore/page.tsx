"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ETFS, ASSET_CLASSES, REGIONS, SECTORS } from "@/lib/etfs";

export default function Explore() {
  const [q, setQ] = useState("");
  const [asset, setAsset] = useState<string>("All");
  const [region, setRegion] = useState<string>("All");
  const [sector, setSector] = useState<string>("All");

  const filtered = useMemo(() => {
    return ETFS.filter(e => {
      const hitQ = q.trim().length===0 || e.ticker.toLowerCase().includes(q.toLowerCase()) || e.name.toLowerCase().includes(q.toLowerCase());
      const hitA = asset==="All" || e.assetClass===asset;
      const hitR = region==="All" || e.region===region;
      const hitS = sector==="All" || (e.sector===sector);
      return hitQ && hitA && hitR && hitS;
    });
  }, [q, asset, region, sector]);

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">Explorer les ETF</h1>

      <div className="card p-4 grid md:grid-cols-4 gap-3">
        <input
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          className="w-full border rounded-xl p-3 md:col-span-2"
          placeholder="Rechercher un ticker ou un nom (ex: SPY, Nasdaq)..."
        />
        <select className="border rounded-xl p-3" value={asset} onChange={e=>setAsset(e.target.value)}>
          <option value="All">Classe d'actifs (toutes)</option>
          {ASSET_CLASSES.map(a=> <option key={a} value={a}>{a}</option>)}
        </select>
        <select className="border rounded-xl p-3" value={region} onChange={e=>setRegion(e.target.value)}>
          <option value="All">Région (toutes)</option>
          {REGIONS.map(r=> <option key={r} value={r}>{r}</option>)}
        </select>
        <select className="border rounded-xl p-3 md:col-span-2" value={sector} onChange={e=>setSector(e.target.value)}>
          <option value="All">Secteur (tous)</option>
          {SECTORS.map(s=> <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="text-sm text-gray-600 md:col-span-2 flex items-center">Résultats : {filtered.length}</div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map(e => (
          <Link href={`/etf/${e.ticker}`} key={e.ticker} className="card p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{e.ticker}</div>
              <span className="badge border-gray-300">{e.assetClass}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">{e.name}</div>
            <div className="text-xs text-gray-500 mt-1">{e.region}{e.sector ? ` • ${e.sector}` : ""}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
