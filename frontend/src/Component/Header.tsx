import { useState, useEffect } from "react";
import {
  ShoppingCart,
  User,
  Search,
  Box,
  LogOut,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import logo from "../assets/LeifMed Logo_Landscape.png";

interface HeaderProps {
  onLoginClick?: () => void;
  onOrdersClick?: () => void;
  onMenuClick?: (menu: string) => void;
  onCartClick?: () => void;
}

export default function EnhancedHeader({
  onLoginClick,
  onOrdersClick,
  onMenuClick,
  onCartClick,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const { cartCount } = useOrders();
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Medicine" },
    { name: "Contact Us" },
  ];

  return (
    <header
      className={`w-[90%] mx-auto mt-4 sticky top-2 z-50 transition-all duration-500 ease-in-out rounded-3xl overflow-hidden border border-white/20
      ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-xl"
          : "bg-white backdrop-blur-md shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* TOP SECTION */}
        <div className="flex items-center justify-between py-4 gap-8">
          
          {/* LOGO */}
          <img src={logo} alt="logo" className="h-12 w-auto" />

          {/* SEARCH BAR */}
          <div className="hidden max-w-2xl mx-auto md:flex flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search
                size={18}
                className="text-slate-400 group-focus-within:text-green-500 transition-colors"
              />
            </div>
            <input
              type="text"
              placeholder="Search for products, brands, or categories..."
              className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none text-sm shadow-sm"
            />
          </div>
        </div>

        {/* NAVBAR */}
        <nav className="flex items-center justify-between gap-10 py-3 border-t border-slate-100">
          
          {/* MENU */}
          <div className="flex items-center gap-6">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="relative py-1 group cursor-pointer"
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
                onClick={() => onMenuClick?.(item.name)}
              >
                <span className="text-sm font-semibold text-slate-600 group-hover:text-green-600 transition-colors">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-5">
            {user ? (
              <>
                <button
                  onClick={onOrdersClick}
                  className="flex items-center gap-2 border border-slate-200 bg-white text-slate-700 px-4 py-2.5 rounded-xl hover:border-green-300 hover:text-green-600 transition-all shadow-sm"
                >
                  <Box size={18} />
                  <span className="text-sm font-semibold">My Orders</span>
                </button>

                {user.role === "admin" && (
                  <button
                    onClick={() => onMenuClick?.("Admin")}
                    className="flex items-center gap-2 border border-slate-200 bg-white text-slate-700 px-4 py-2.5 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
                  >
                    <BarChart3 size={18} />
                    <span className="text-sm font-semibold">Admin</span>
                  </button>
                )}

                <button
                  onClick={logout}
                  className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl hover:bg-green-600 transition-all shadow-md hover:shadow-green-200 active:scale-95"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-semibold">Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl hover:bg-green-600 transition-all shadow-md hover:shadow-green-200 active:scale-95"
              >
                <User size={18} />
                <span className="text-sm font-semibold">Login</span>
              </button>
            )}

            {/* CART */}
            <button
              onClick={onCartClick}
              className="relative group cursor-pointer focus:outline-none"
              aria-label={`Open cart, ${cartCount} items`}
            >
              <div className="p-2.5 bg-green-50 text-green-700 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-all">
                <ShoppingCart size={22} />
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}