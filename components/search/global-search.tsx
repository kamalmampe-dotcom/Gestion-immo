"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";

interface SearchResult {
  type: "property" | "tenant" | "contract" | "payment";
  title: string;
  subtitle: string;
  href: string;
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const mockResults: SearchResult[] = [
    { type: "property", title: "Appartement 3BR", subtitle: "Douala", href: "/dashboard/properties" },
    { type: "property", title: "Villa - Yaoundé", subtitle: "Yaoundé", href: "/dashboard/properties" },
    { type: "tenant", title: "Jean Kamdem", subtitle: "Locataire", href: "/dashboard/tenants" },
    { type: "tenant", title: "Marie Nkomo", subtitle: "Locataire", href: "/dashboard/tenants" },
    { type: "contract", title: "Contrat Jean Kamdem", subtitle: "Contrat actif", href: "/dashboard/contracts" },
    { type: "payment", title: "Paiement Juin 2024", subtitle: "Payé", href: "/dashboard/payments" },
  ];

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length > 0) {
      const filtered = mockResults.filter(
        (result) =>
          result.title.toLowerCase().includes(value.toLowerCase()) ||
          result.subtitle.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
        <input
          type="text"
          placeholder="Chercher une propriété, locataire..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="max-h-80 overflow-y-auto">
            {results.map((result, i) => (
              <Link
                key={i}
                href={result.href}
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="text-2xl">
                  {result.type === "property"
                    ? "🏠"
                    : result.type === "tenant"
                    ? "👤"
                    : result.type === "contract"
                    ? "📄"
                    : "💰"}
                </div>
                <div>
                  <p className="font-medium text-primary text-sm">{result.title}</p>
                  <p className="text-xs text-muted">{result.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-sm text-muted">
          Aucun résultat trouvé
        </div>
      )}
    </div>
  );
}
