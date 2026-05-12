import { X, ShoppingCart, Minus, Plus, Trash2, Package, ArrowRight, Truck, Gift } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useEffect, useRef } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const FREE_DELIVERY_THRESHOLD = 1500;

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useOrders();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - cartTotal);
  const progress = Math.min(100, (cartTotal / FREE_DELIVERY_THRESHOLD) * 100);
  const isFreeDelivery = cartTotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryCharge = isFreeDelivery ? 0 : 49;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-label="Shopping Cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
              <p className="text-xs text-slate-500">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
              >
                <Trash2 size={14} /> Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Free Delivery Progress Bar (only when cart has items) ── */}
        {cart.length > 0 && (
          <div className={`px-5 py-3 border-b ${isFreeDelivery ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Truck size={14} className={isFreeDelivery ? 'text-emerald-600' : 'text-amber-600'} />
                {isFreeDelivery ? (
                  <span className="text-xs font-bold text-emerald-700">
                    🎉 You've unlocked <span className="underline">Free Delivery!</span>
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-amber-700">
                    Add <span className="font-bold text-amber-900">₹{remaining.toFixed(0)}</span> more for FREE delivery
                  </span>
                )}
              </div>
              {isFreeDelivery ? (
                <Gift size={16} className="text-emerald-600" />
              ) : (
                <span className="text-[10px] font-bold text-amber-600">₹{cartTotal.toFixed(0)} / ₹{FREE_DELIVERY_THRESHOLD}</span>
              )}
            </div>
            {/* Progress track */}
            <div className="h-2 w-full rounded-full bg-white/70 overflow-hidden border border-white shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isFreeDelivery ? 'bg-emerald-500' : 'bg-amber-400'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100">
                <Package size={36} className="text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-700">Your cart is empty</p>
                <p className="mt-1 text-sm text-slate-500">Browse products and add items to get started.</p>
              </div>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Continue Shopping <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-emerald-100 hover:bg-emerald-50/30"
              >
                {/* Product Icon */}
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm">
                  <ShoppingCart size={22} className="text-emerald-600" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">₹{item.price.toFixed(2)} each</p>
                  <p className="mt-1 text-sm font-bold text-emerald-700">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Qty controls */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 transition hover:text-red-500"
                    aria-label="Remove item"
                  >
                    <X size={14} />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-red-300 hover:text-red-600 active:scale-95"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="min-w-[1.5rem] text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-600 hover:text-white hover:border-emerald-600 active:scale-95"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-slate-100 px-6 py-5 space-y-4">
            {/* Summary */}
            <div className="rounded-2xl bg-slate-50 px-4 py-3 space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-semibold text-slate-900">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Truck size={13} /> Delivery
                </span>
                {isFreeDelivery ? (
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <span className="line-through text-slate-400 font-normal text-xs">₹49</span> FREE
                  </span>
                ) : (
                  <span className="font-semibold text-slate-700">₹{deliveryCharge}</span>
                )}
              </div>
              {!isFreeDelivery && (
                <div className="text-[11px] text-amber-600 font-medium">
                  💡 Add ₹{remaining.toFixed(0)} more to get FREE delivery!
                </div>
              )}
              <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-xl font-bold text-slate-900">₹{(cartTotal + deliveryCharge).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            <button
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
