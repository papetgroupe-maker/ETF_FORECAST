export type ETF = {
  ticker: string;
  name: string;
  assetClass: "Equity" | "Bond" | "Commodity" | "Real Estate" | "Multi-Asset";
  region: "US" | "Global" | "Developed ex-US" | "Emerging";
  sector?: string;
};

export const ETFS: ETF[] = [
  // Broad US
  { ticker: "SPY", name: "SPDR S&P 500", assetClass: "Equity", region: "US" },
  { ticker: "IVV", name: "iShares Core S&P 500", assetClass: "Equity", region: "US" },
  { ticker: "VOO", name: "Vanguard S&P 500", assetClass: "Equity", region: "US" },
  { ticker: "VTI", name: "Vanguard Total Stock Market", assetClass: "Equity", region: "US" },
  { ticker: "SCHB", name: "Schwab U.S. Broad Market", assetClass: "Equity", region: "US" },
  { ticker: "DIA", name: "SPDR Dow Jones Industrial Average", assetClass: "Equity", region: "US" },
  { ticker: "IWM", name: "iShares Russell 2000", assetClass: "Equity", region: "US" },
  { ticker: "VTWO", name: "Vanguard Russell 2000", assetClass: "Equity", region: "US" },

  // Style / Dividend
  { ticker: "VUG", name: "Vanguard Growth", assetClass: "Equity", region: "US" },
  { ticker: "VTV", name: "Vanguard Value", assetClass: "Equity", region: "US" },
  { ticker: "SCHD", name: "Schwab U.S. Dividend Equity", assetClass: "Equity", region: "US" },
  { ticker: "VYM", name: "Vanguard High Dividend Yield", assetClass: "Equity", region: "US" },
  { ticker: "SPYD", name: "SPDR Portfolio S&P 500 High Dividend", assetClass: "Equity", region: "US" },

  // Tech / Semi
  { ticker: "QQQ", name: "Invesco QQQ (Nasdaq-100)", assetClass: "Equity", region: "US", sector: "Technology" },
  { ticker: "XLK", name: "Technology Select Sector SPDR", assetClass: "Equity", region: "US", sector: "Technology" },
  { ticker: "SMH", name: "VanEck Semiconductor", assetClass: "Equity", region: "US", sector: "Technology" },
  { ticker: "SOXX", name: "iShares Semiconductor", assetClass: "Equity", region: "US", sector: "Technology" },
  { ticker: "SOXL", name: "Direxion Daily Semiconductors 3x", assetClass: "Equity", region: "US", sector: "Technology" },

  // Sector SPDRs
  { ticker: "XLF", name: "Financials Select Sector", assetClass: "Equity", region: "US", sector: "Financials" },
  { ticker: "XLY", name: "Consumer Discretionary Select Sector", assetClass: "Equity", region: "US", sector: "Consumer Discretionary" },
  { ticker: "XLP", name: "Consumer Staples Select Sector", assetClass: "Equity", region: "US", sector: "Consumer Staples" },
  { ticker: "XLE", name: "Energy Select Sector", assetClass: "Equity", region: "US", sector: "Energy" },
  { ticker: "XLV", name: "Health Care Select Sector", assetClass: "Equity", region: "US", sector: "Health Care" },
  { ticker: "XLI", name: "Industrials Select Sector", assetClass: "Equity", region: "US", sector: "Industrials" },
  { ticker: "XLU", name: "Utilities Select Sector", assetClass: "Equity", region: "US", sector: "Utilities" },
  { ticker: "XLB", name: "Materials Select Sector", assetClass: "Equity", region: "US", sector: "Materials" },
  { ticker: "XLRE", name: "Real Estate Select Sector", assetClass: "Equity", region: "US", sector: "Real Estate" },
  { ticker: "XLC", name: "Communication Services Select Sector", assetClass: "Equity", region: "US", sector: "Communication" },

  // International
  { ticker: "VT",  name: "Vanguard Total World Stock", assetClass: "Equity", region: "Global" },
  { ticker: "EFA", name: "iShares MSCI EAFE", assetClass: "Equity", region: "Developed ex-US" },
  { ticker: "VEA", name: "Vanguard FTSE Developed Markets", assetClass: "Equity", region: "Developed ex-US" },
  { ticker: "EEM", name: "iShares MSCI Emerging Markets", assetClass: "Equity", region: "Emerging" },
  { ticker: "VWO", name: "Vanguard FTSE Emerging Markets", assetClass: "Equity", region: "Emerging" },

  // Bonds (US)
  { ticker: "TLT", name: "iShares 20+ Year Treasury Bond", assetClass: "Bond", region: "US" },
  { ticker: "IEF", name: "iShares 7-10 Year Treasury Bond", assetClass: "Bond", region: "US" },
  { ticker: "SHY", name: "iShares 1-3 Year Treasury Bond", assetClass: "Bond", region: "US" },
  { ticker: "LQD", name: "iShares iBoxx Investment Grade", assetClass: "Bond", region: "US" },
  { ticker: "HYG", name: "iShares iBoxx High Yield", assetClass: "Bond", region: "US" },
  { ticker: "BND", name: "Vanguard Total Bond Market", assetClass: "Bond", region: "US" },
  { ticker: "AGG", name: "iShares Core U.S. Aggregate Bond", assetClass: "Bond", region: "US" },

  // Commodities
  { ticker: "GLD", name: "SPDR Gold Trust", assetClass: "Commodity", region: "Global" },
  { ticker: "IAU", name: "iShares Gold Trust", assetClass: "Commodity", region: "Global" },
  { ticker: "SLV", name: "iShares Silver Trust", assetClass: "Commodity", region: "Global" },
  { ticker: "GDX", name: "VanEck Gold Miners", assetClass: "Equity", region: "Global", sector: "Materials" },
  { ticker: "USO", name: "United States Oil Fund", assetClass: "Commodity", region: "Global" },
  { ticker: "UNG", name: "United States Natural Gas Fund", assetClass: "Commodity", region: "Global" },

  // Real Estate
  { ticker: "VNQ", name: "Vanguard Real Estate", assetClass: "Real Estate", region: "US" },
  { ticker: "IYR", name: "iShares U.S. Real Estate", assetClass: "Real Estate", region: "US" },

  // Thematics / Divers
  { ticker: "ARKK", name: "ARK Innovation", assetClass: "Equity", region: "US", sector: "Thematic" },
  { ticker: "IBB", name: "iShares Nasdaq Biotechnology", assetClass: "Equity", region: "US", sector: "Health Care" },
  { ticker: "XBI", name: "SPDR S&P Biotech", assetClass: "Equity", region: "US", sector: "Health Care" },
  { ticker: "MJ",  name: "ETFMG Alternative Harvest", assetClass: "Equity", region: "US", sector: "Thematic" },
  { ticker: "CORN", name: "Teucrium Corn", assetClass: "Commodity", region: "Global" },
];

export const ASSET_CLASSES = ["Equity","Bond","Commodity","Real Estate","Multi-Asset"] as const;
export const REGIONS = ["US","Global","Developed ex-US","Emerging"] as const;
export const SECTORS = Array.from(new Set(ETFS.map(e=>e.sector).filter(Boolean))) as string[];
