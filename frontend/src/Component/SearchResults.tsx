import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search, ShoppingCart, Heart, Package,
  SlidersHorizontal, X, ArrowLeft, TrendingUp,
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useOrders } from "../context/OrderContext";
import { useFavorites } from "../context/FavoriteContext";
import type { CartItem } from "../context/OrderContext";
import { staggerContainer, staggerItem, fadeUp } from "../animations";

interface SearchResultsProps {
  initialQuery: string;
  onBack?: () => void;
}

export default function SearchResults({ initialQuery, onBack }: SearchResultsProps) {
  const { products } = useProducts();
  const { addToCart } = useOrders();
  const { favorites, toggleFavorite } = useFavorites();

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"relevance" | "price_asc" | "price_desc" | "name">("relevance");

  /* Update query if prop changes */
  useEffect(() => { setQuery(initialQuery); }, [initialQuery]);

  /* Category list from products */
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category_name || "Other")))];

  /* Filter + sort */
  const trimmed = query.trim().toLowerCase();
  const filtered = products.filter((p) => {
    const matchesQuery =
      !trimmed ||
      p.name.toLowerCase().includes(trimmed) ||
      p.description?.toLowerCase().includes(trimmed) ||
      p.category_name?.toLowerCase().includes(trimmed);
    const matchesCategory = selectedCategory === "All" || p.category_name === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    // relevance: name match first
    const aName = a.name.toLowerCase().includes(trimmed) ? 0 : 1;
    const bName = b.name.toLowerCase().includes(trimmed) ? 0 : 1;
    return aName - bName;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ── Top bar ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium mb-2 transition"
            >
              <ArrowLeft size={15} /> Back
            </button>
            <h1 className="text-2xl font-extrabold text-slate-800">
              {trimmed
                ? <>Results for <span className="text-emerald-600">"{query}"</span></>
                : "All Products"}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {sorted.length} product{sorted.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </motion.div>

        {/* ── Search input (inline refinement) ── */}
        <div className="relative mb-6 max-w-lg">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Refine your search…"
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* ── Category chips ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-2 mb-8"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              variants={staggerItem}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                  : "bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-600"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* ── Results grid ── */}
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <TrendingUp size={40} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">No results found</h2>
            <p className="text-slate-400 max-w-sm mb-6">
              We couldn't find any products matching <strong>"{query}"</strong>. Try a different keyword or clear the filters.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setQuery(""); setSelectedCategory("All"); }}
                className="flex items-center gap-2 border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl hover:bg-slate-50 transition text-sm font-semibold"
              >
                <X size={14} /> Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {sorted.map((product) => {
              const isFav = favorites.includes(product.id.toString());
              const item: CartItem = { id: product.id.toString(), name: product.name, price: product.price, quantity: 1 };
              return (
                <motion.div
                  key={product.id}
                  variants={staggerItem}
                  whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}
                  className="group bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={product.image || "https://images.unsplash.com/photo-1580281657521-782f1f8d4d91?auto=format&fit=crop&w=800&q=80"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Favourite */}
                    <button
                      onClick={() => toggleFavorite(product.id.toString())}
                      className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition ${
                        isFav ? "bg-red-500 text-white" : "bg-white/90 text-slate-400 hover:text-red-500"
                      }`}
                    >
                      <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                    </button>

                    {/* Category */}
                    {product.category_name && (
                      <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        {product.category_name}
                      </span>
                    )}

                    {/* Highlight query match */}
                    {trimmed && product.name.toLowerCase().includes(trimmed) && (
                      <span className="absolute bottom-3 left-3 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ✓ Name match
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 mb-1 truncate">{product.name}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">{product.description}</p>

                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs text-slate-400">Price</p>
                        <p className="text-xl font-extrabold text-slate-900">₹{product.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        className="flex items-center gap-1.5 bg-slate-800 text-white text-sm px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition active:scale-95 font-semibold"
                      >
                        <ShoppingCart size={15} /> Add
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <Package size={12} className="text-slate-400" />
                      <span className="text-xs text-slate-400">Stock: {product.stock}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
