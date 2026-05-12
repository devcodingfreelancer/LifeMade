import { ShoppingCart, ArrowRight, Package, Truck, Gift } from 'lucide-react';
import { useOrders } from '../context/OrderContext';

interface FloatingCartBarProps {
  onOpenCart: () => void;
}

const FREE_DELIVERY_THRESHOLD = 1500;

export default function FloatingCartBar({ onOpenCart }: FloatingCartBarProps) {
  const { cart, cartTotal, cartCount } = useOrders();

  if (cartCount === 0) return null;

  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - cartTotal);
  const isFreeDelivery = cartTotal >= FREE_DELIVERY_THRESHOLD;
  const progress = Math.min(100, (cartTotal / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <div
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 w-[95%] max-w-2xl
                 animate-[slideUp_0.3s_ease-out]"
      style={{ animation: 'slideUp 0.3s ease-out' }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to   { opacity: 1; transform: translate(-50%, 0);    }
        }
      `}</style>

      {/* Free Delivery Nudge Bar (Attached to top of floating bar) */}
      <div className={`mb-[-12px] pb-3 pt-2 px-6 rounded-t-3xl border-x border-t backdrop-blur-md shadow-lg transition-all duration-500
                       ${isFreeDelivery ? 'bg-emerald-600/90 border-emerald-400/30' : 'bg-amber-600/90 border-amber-400/30'}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isFreeDelivery ? (
              <>
                <Gift size={14} className="text-emerald-100" />
                <span className="text-[11px] font-bold text-white uppercase tracking-wider">Free delivery unlocked!</span>
              </>
            ) : (
              <>
                <Truck size={14} className="text-amber-100" />
                <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                  Add <span className="bg-white/20 px-1.5 py-0.5 rounded ml-0.5">₹{remaining.toFixed(0)}</span> for FREE delivery
                </span>
              </>
            )}
          </div>
          <div className="flex-1 max-w-[100px] h-1 bg-black/20 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${isFreeDelivery ? 'bg-emerald-300' : 'bg-amber-300'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between gap-4 rounded-2xl bg-slate-900 border border-white/10
                      px-5 py-4 shadow-2xl shadow-black/40 backdrop-blur-md">

        {/* Left: cart summary */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-900/40">
              <ShoppingCart size={20} />
            </div>
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center
                             rounded-full bg-orange-500 text-[10px] font-bold text-white border-2 border-slate-900">
              {cartCount}
            </span>
          </div>

          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">
              {cartCount} item{cartCount !== 1 ? 's' : ''}
            </p>
            <p className="text-lg font-extrabold text-white leading-tight">
              ₹{cartTotal.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Middle: item pills (hidden on very small screens) */}
        <div className="hidden md:flex flex-1 items-center gap-2 overflow-hidden px-2">
          {cart.slice(0, 2).map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/5
                         px-3 py-1.5 text-[10px] font-semibold text-slate-400 truncate max-w-[110px]"
            >
              <Package size={10} className="text-emerald-500/50 flex-shrink-0" />
              {item.name}
            </span>
          ))}
          {cart.length > 2 && (
            <span className="text-[10px] text-slate-500 font-bold px-1 uppercase tracking-tight">
              +{cart.length - 2} more
            </span>
          )}
        </div>

        {/* Right: CTA */}
        <button
          onClick={onOpenCart}
          className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl bg-emerald-500
                     hover:bg-emerald-400 active:scale-95 px-6 py-2.5 text-sm font-bold text-white
                     shadow-lg shadow-emerald-900/40 transition-all duration-200"
        >
          View Cart
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
