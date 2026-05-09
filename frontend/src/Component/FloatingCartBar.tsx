import { ShoppingCart, ArrowRight, Package } from 'lucide-react';
import { useOrders } from '../context/OrderContext';

interface FloatingCartBarProps {
  onOpenCart: () => void;
}

export default function FloatingCartBar({ onOpenCart }: FloatingCartBarProps) {
  const { cart, cartTotal, cartCount } = useOrders();

  if (cartCount === 0) return null;

  return (
    <div
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 w-[90%] max-w-2xl
                 animate-[slideUp_0.3s_ease-out]"
      style={{ animation: 'slideUp 0.3s ease-out' }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to   { opacity: 1; transform: translate(-50%, 0);    }
        }
      `}</style>

      <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-900 border border-white/10
                      px-5 py-4 shadow-2xl shadow-black/30 backdrop-blur-sm">

        {/* Left: cart summary */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <ShoppingCart size={20} />
            </div>
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center
                             rounded-full bg-orange-500 text-[10px] font-bold text-white border-2 border-slate-900">
              {cartCount}
            </span>
          </div>

          <div>
            <p className="text-xs text-slate-400 font-medium">
              {cartCount} item{cartCount !== 1 ? 's' : ''} in cart
            </p>
            <p className="text-lg font-bold text-white leading-tight">
              ₹{cartTotal.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Middle: item pills (up to 3) */}
        <div className="hidden sm:flex flex-1 items-center gap-2 overflow-hidden">
          {cart.slice(0, 3).map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10
                         px-3 py-1 text-xs font-medium text-slate-300 truncate max-w-[130px]"
            >
              <Package size={11} className="text-emerald-400 flex-shrink-0" />
              {item.name}
            </span>
          ))}
          {cart.length > 3 && (
            <span className="text-xs text-slate-400 font-medium">
              +{cart.length - 3} more
            </span>
          )}
        </div>

        {/* Right: CTA */}
        <button
          onClick={onOpenCart}
          className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl bg-emerald-500
                     hover:bg-emerald-400 active:scale-95 px-5 py-2.5 text-sm font-bold text-white
                     shadow-lg shadow-emerald-900/40 transition-all duration-200"
        >
          View Cart
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
