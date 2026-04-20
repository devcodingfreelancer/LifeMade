import { useState, useEffect } from "react";
import { ShoppingCart, User, Search, ChevronDown, Percent, Box, LogOut, BarChart3 } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

interface HeaderProps {
  onLoginClick?: () => void;
  onOrdersClick?: () => void;
  onMenuClick?: (menu: string) => void;
}

export default function EnhancedHeader({ onLoginClick, onOrdersClick, onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { cartCount } = useOrders();
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Medicine", dropdown: false },
    { name: "Lab Tests", dropdown: true },
    { name: "Healthcare", dropdown: true },
    { name: "Doctor Consult", dropdown: false },
    { name: "Health Insights", dropdown: true },
    { name: "Offers", dropdown: false },
    { name: "Contact Us", dropdown: false },
  ];

  return (
    <header className={`w-full sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/80 backdrop-blur-md shadow-lg" : "bg-white"
    }`}>
      {/* TOP NOTIFICATION BAR (Optional/Tractive) */}
      <div className="bg-green-600 text-white text-[10px] md:text-xs py-1.5 px-6 flex justify-center items-center gap-2 font-medium">
        <Percent size={12} />
        <span>Save up to 25% on your first medicine order. Use code: <span className="font-bold">FIRST25</span></span>
      </div>

      {/* MAIN HEADER */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between py-4 gap-8">
          
          {/* LOGO & LOCATION */}
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 cursor-pointer" onClick={() => onMenuClick?.('Home')}>
              Live<span className="text-emerald-600">Mad</span>
            </h1>
            
      
          </div>

          {/* SEARCH BAR (The Centerpiece) */}
          <div className="hidden md:flex flex-1 max-w-2xl relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-green-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search for products, brands, or categories..."
              className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none text-sm shadow-sm"
            />
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
                </button>                {user.role === 'admin' && (
                  <button
                    onClick={() => onMenuClick?.('Admin')}
                    className="flex items-center gap-2 border border-slate-200 bg-white text-slate-700 px-4 py-2.5 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
                  >
                    <BarChart3 size={18} />
                    <span className="text-sm font-semibold">Admin</span>
                  </button>
                )}                <button
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

            <div className="relative group cursor-pointer">
              <div className="p-2.5 bg-green-50 text-green-700 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-all">
                <ShoppingCart size={22} />
              </div>
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            </div>
          </div>
        </div>

        {/* NAVIGATION BAR */}
        <nav className="flex items-center justify-center gap-10 py-3 border-t border-slate-50">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="relative py-1 group cursor-pointer"
              onMouseEnter={() => setActiveDropdown(index)}
              onMouseLeave={() => setActiveDropdown(null)}
              onClick={() => onMenuClick?.(item.name)}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-slate-600 group-hover:text-green-600 transition-colors">
                  {item.name}
                </span>
                {item.dropdown && (
                  <ChevronDown size={14} className={`text-slate-400 group-hover:text-green-600 transition-transform duration-300 ${activeDropdown === index ? 'rotate-180' : ''}`} />
                )}
              </div>

              {/* ACTIVE INDICATOR */}
              <div className="absolute -bottom-px left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300 rounded-full" />

              {/* PREMIUM DROPDOWN */}
              {item.dropdown && activeDropdown === index && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-2xl p-2 w-56 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 hover:bg-green-50 rounded-xl transition-colors">
                    <p className="text-sm font-bold text-slate-800">Popular Categories</p>
                    <p className="text-xs text-slate-500">Explore trending services</p>
                  </div>
                  <div className="h-px bg-slate-50 my-1" />
                  {["Order via Prescription", "Refill Medicine", "Health Care Plus"].map((opt) => (
                    <div key={opt} className="p-3 hover:bg-slate-50 rounded-xl text-sm text-slate-600 hover:text-green-600 font-medium transition-colors">
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}