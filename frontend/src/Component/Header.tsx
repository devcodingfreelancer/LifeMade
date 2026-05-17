import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingCart, User, Search, Box, LogOut, BarChart3,
  Heart, UserCircle2, X, Package, TrendingUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useFavorites } from "../context/FavoriteContext";
import { useProducts } from "../context/ProductContext";
import logo from "../assets/LeifMed Logo_Landscape.png";

interface HeaderProps {
  onLoginClick?: () => void;
  onOrdersClick?: () => void;
  onMenuClick?: (menu: string) => void;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  onProfileClick?: () => void;
  onSearchView?: (query: string) => void;
}

export default function EnhancedHeader({
  onLoginClick, onOrdersClick, onMenuClick,
  onCartClick, onWishlistClick, onProfileClick, onSearchView,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const { cartCount, addToCart } = useOrders();
  const { favorites } = useFavorites();
  const { products } = useProducts();

  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  /* ── Scroll listener ── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Filtered results ── */
  const trimmed = query.trim().toLowerCase();
  const results = trimmed.length >= 1
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.description?.toLowerCase().includes(trimmed) ||
          p.category_name?.toLowerCase().includes(trimmed)
      ).slice(0, 6)
    : [];

  const menuItems = [{ name: "Medicine" }, { name: "Contact Us" }];

  /* ── Search bar with live dropdown ── */
  const renderSearch = (className: string) => (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Input */}
      <div className="relative group w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={16} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search products, brands, categories…"
          className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-9 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none text-sm shadow-sm"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setShowDropdown(false); }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && query.length >= 1 && (
          <motion.div
            key="search-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100] overflow-hidden"
          >
          {results.length > 0 ? (
            <>
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => { onSearchView?.(query); setShowDropdown(false); }}
                  className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1"
                >
                  View all results →
                </button>
              </div>

              <ul>
                {results.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition group"
                    onClick={() => {
                      onMenuClick?.("Medicine");
                      setShowDropdown(false);
                      setQuery("");
                    }}
                  >
                    {/* Product thumbnail */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Package size={20} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate group-hover:text-emerald-600 transition">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {product.category_name && (
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            {product.category_name}
                          </span>
                        )}
                        <span className="text-xs text-slate-400">Stock: {product.stock}</span>
                      </div>
                    </div>

                    {/* Price + Add to cart */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-sm font-bold text-slate-800">₹{product.price.toFixed(2)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({ id: product.id.toString(), name: product.name, price: product.price, quantity: 1 });
                        }}
                        className="text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2 py-0.5 rounded-lg transition flex items-center gap-1"
                      >
                        <ShoppingCart size={10} /> Add
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="py-8 flex flex-col items-center text-center px-4">
              <TrendingUp size={32} className="text-slate-200 mb-2" />
              <p className="text-slate-500 font-medium text-sm">No products found for "{query}"</p>
              <p className="text-slate-400 text-xs mt-1">Try a different keyword or browse all medicines</p>
              <button
                onClick={() => { onSearchView?.(query); setShowDropdown(false); }}
                className="mt-3 text-xs text-emerald-600 font-semibold hover:underline"
              >
                Search all products →
              </button>
            </div>
          )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  /* ── Nav menu ── */
  const renderMenu = () => (
    <div className="flex items-center gap-6">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="relative py-1 group cursor-pointer"
          onClick={() => onMenuClick?.(item.name)}
        >
          <span className="text-sm font-semibold text-slate-600 group-hover:text-green-600 transition-colors">
            {item.name}
          </span>
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
        </div>
      ))}
    </div>
  );

  /* ── Action buttons ── */
  const renderActions = (compact: boolean) => (
    <div className="flex items-center gap-2 md:gap-3">
      {user ? (
        <>
          {/* Wishlist */}
          <button
            onClick={onWishlistClick}
            className="relative group cursor-pointer focus:outline-none"
            aria-label={`Wishlist, ${favorites.length} items`}
          >
            <div className={`bg-red-50 text-red-500 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all ${compact ? "p-2" : "p-2.5"}`}>
              <Heart size={compact ? 18 : 20} />
            </div>
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                {favorites.length}
              </span>
            )}
          </button>

          {user.role !== "admin" && (
            <button
              onClick={onOrdersClick}
              className={`flex items-center gap-2 border border-slate-200 bg-white text-slate-700 rounded-xl hover:border-green-300 hover:text-green-600 transition-all shadow-sm ${compact ? "px-3 py-2" : "px-4 py-2.5"}`}
            >
              <Box size={18} />
              <span className="text-sm font-semibold hidden sm:block">My Orders</span>
            </button>
          )}

          {user.role === "admin" && (
            <button
              onClick={() => onMenuClick?.("Admin")}
              className={`flex items-center gap-2 border border-slate-200 bg-white text-slate-700 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm ${compact ? "px-3 py-2" : "px-4 py-2.5"}`}
            >
              <BarChart3 size={18} />
              <span className="text-sm font-semibold hidden sm:block">Admin</span>
            </button>
          )}

          {/* Profile */}
          <button
            onClick={onProfileClick}
            className={`flex items-center gap-2 border border-slate-200 bg-white text-slate-700 rounded-xl hover:border-emerald-300 hover:text-emerald-600 transition-all shadow-sm ${compact ? "p-2" : "p-2.5"}`}
            aria-label="My Profile"
          >
            <UserCircle2 size={20} />
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className={`flex items-center gap-2 bg-slate-800 text-white rounded-xl hover:bg-green-600 transition-all shadow-md active:scale-95 ${compact ? "px-3 py-2" : "px-5 py-2.5"}`}
          >
            <LogOut size={18} />
            <span className="text-sm font-semibold hidden sm:block">Logout</span>
          </button>
        </>
      ) : (
        <button
          onClick={onLoginClick}
          className={`flex items-center gap-2 bg-slate-800 text-white rounded-xl hover:bg-green-600 transition-all shadow-md active:scale-95 ${compact ? "px-3 py-2" : "px-5 py-2.5"}`}
        >
          <User size={18} />
          <span className="text-sm font-semibold hidden sm:block">Login</span>
        </button>
      )}

      {/* Cart */}
      <button
        onClick={onCartClick}
        className="relative group cursor-pointer focus:outline-none"
        aria-label={`Open cart, ${cartCount} items`}
      >
        <div className={`bg-green-50 text-green-700 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-all ${compact ? "p-2" : "p-2.5"}`}>
          <ShoppingCart size={compact ? 20 : 22} />
        </div>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );

  return (
    <header
      className={`w-[95%] mx-auto fixed inset-x-0 z-50 transition-all duration-500 ease-in-out rounded-3xl overflow-visible border border-white/20
      ${isScrolled
        ? "top-2 bg-white/95 backdrop-blur-md shadow-xl py-2"
        : "top-4 bg-white backdrop-blur-md shadow-md py-3"
      }`}
    >
      <div className="w-[95%] mx-auto px-4 md:px-0 transition-all duration-500">
        <div className="flex items-center justify-between gap-4 py-1">
          {/* Logo */}
          <img
            src={logo}
            alt="logo"
            className={`w-auto cursor-pointer transition-all duration-300 ${isScrolled ? "h-8" : "h-10"}`}
            onClick={() => { onMenuClick?.("Home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          />

          {/* Nav menu */}
          <div className="hidden lg:block">
            {renderMenu()}
          </div>

          {/* Search */}
          {renderSearch("hidden md:flex flex-1 max-w-md mx-auto")}

          {/* Actions */}
          {renderActions(isScrolled)}
        </div>
      </div>
    </header>
  );
}