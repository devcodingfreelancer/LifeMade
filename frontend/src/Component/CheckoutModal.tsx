import { useState, useEffect } from 'react';
import {
  X, ShoppingBag, MapPin, CreditCard, CheckCircle2,
  Loader2, ChevronRight, Tag, Truck, Shield
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'summary' | 'address' | 'placing' | 'success';

const FREE_DELIVERY_THRESHOLD = 1500;

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, cartTotal, placeOrder, clearCart } = useOrders();
  const isFreeDelivery = cartTotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryCharge = isFreeDelivery ? 0 : 49;
  const orderTotal = cartTotal + deliveryCharge;
  const [step, setStep] = useState<Step>('summary');
  const [address, setAddress] = useState({
    line1: '', city: '', state: '', pincode: '', phone: '',
  });
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) { setStep('summary'); setError(''); }
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const fullAddress = `${address.line1}, ${address.city}, ${address.state} - ${address.pincode}. Ph: ${address.phone}`;

  const handlePlaceOrder = async () => {
    if (!address.line1 || !address.city || !address.state || !address.pincode || !address.phone) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/^\d{6}$/.test(address.pincode)) { setError('Enter a valid 6-digit pincode.'); return; }
    if (!/^\d{10}$/.test(address.phone)) { setError('Enter a valid 10-digit phone number.'); return; }

    setError('');
    setStep('placing');
    try {
      await placeOrder(fullAddress);
      setOrderId(Math.floor(Math.random() * 90000) + 10000);
      setStep('success');
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
      setStep('address');
    }
  };

  const handleDone = () => {
    clearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
        onClick={step !== 'placing' ? onClose : undefined}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

          {/* ── STEP: Summary ── */}
          {step === 'summary' && (
            <>
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
                    <p className="text-xs text-slate-500">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 transition">
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                    </div>
                    <p className="text-sm font-bold text-emerald-700 flex-shrink-0">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}

                {/* Perks */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {[
                    { icon: Truck, text: 'Free Delivery' },
                    { icon: Shield, text: 'Secure Payment' },
                    { icon: Tag, text: 'Best Prices' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex flex-col items-center gap-1.5 rounded-2xl bg-emerald-50 py-3 text-emerald-700">
                      <Icon size={16} />
                      <span className="text-[11px] font-semibold text-center">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 px-6 py-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 px-4 py-3 space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span><span className="font-semibold text-slate-900">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span className="flex items-center gap-1.5"><Truck size={13}/> Delivery</span>
                    {isFreeDelivery
                      ? <span className="font-bold text-emerald-600 flex items-center gap-1"><span className="line-through text-slate-400 text-xs font-normal">₹49</span> FREE 🎉</span>
                      : <span className="font-semibold text-slate-700">₹{deliveryCharge}</span>}
                  </div>
                  {!isFreeDelivery && (
                    <p className="text-[11px] text-amber-600 font-medium">Add ₹{(FREE_DELIVERY_THRESHOLD - cartTotal).toFixed(0)} more for FREE delivery</p>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-xl font-bold text-slate-900">₹{orderTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setStep('address')}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition active:scale-[0.98]"
                >
                  Continue to Delivery <ChevronRight size={18} />
                </button>
              </div>
            </>
          )}

          {/* ── STEP: Address ── */}
          {step === 'address' && (
            <>
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Delivery Address</h2>
                    <p className="text-xs text-slate-500">Where should we deliver?</p>
                  </div>
                </div>
                <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 transition">
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
                {/* Progress bar */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1.5 flex-1 rounded-full bg-emerald-200">
                    <div className="h-full w-full rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-600">Step 2 of 2</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Street Address *</label>
                    <input
                      type="text"
                      placeholder="House no., Street, Area"
                      value={address.line1}
                      onChange={e => setAddress(p => ({ ...p, line1: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">City *</label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai"
                        value={address.city}
                        onChange={e => setAddress(p => ({ ...p, city: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">State *</label>
                      <input
                        type="text"
                        placeholder="e.g. Maharashtra"
                        value={address.state}
                        onChange={e => setAddress(p => ({ ...p, state: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pincode *</label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="6-digit pincode"
                        value={address.pincode}
                        onChange={e => setAddress(p => ({ ...p, pincode: e.target.value.replace(/\D/g, '') }))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone *</label>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="10-digit mobile"
                        value={address.phone}
                        onChange={e => setAddress(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {error}
                    </div>
                  )}
                </div>

                {/* Order Total Reminder */}
                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-emerald-700">
                      <CreditCard size={16} />
                      <span className="font-semibold">Order Total</span>
                    </div>
                    <span className="text-lg font-bold text-emerald-800">₹{orderTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-emerald-600">Delivery</span>
                    {isFreeDelivery
                      ? <span className="text-xs font-bold text-emerald-600">FREE 🎉</span>
                      : <span className="text-xs text-slate-600">₹{deliveryCharge}</span>}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 px-6 py-5 flex gap-3">
                <button
                  onClick={() => setStep('summary')}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-[2] inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition active:scale-[0.98]"
                >
                  <ShoppingBag size={18} /> Place Order
                </button>
              </div>
            </>
          )}

          {/* ── STEP: Placing ── */}
          {step === 'placing' && (
            <div className="flex flex-col items-center justify-center gap-6 px-8 py-20 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <Loader2 size={36} className="text-emerald-600 animate-spin" />
                <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-ping opacity-40" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Placing your order…</h3>
                <p className="mt-2 text-sm text-slate-500">Please wait, we're processing your request.</p>
              </div>
            </div>
          )}

          {/* ── STEP: Success ── */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center gap-6 px-8 py-16 text-center">
              {/* Animated checkmark */}
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 size={48} className="text-emerald-600" />
                <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Order Placed! 🎉</h3>
                {orderId && (
                  <p className="text-sm font-semibold text-slate-500">
                    Order ID: <span className="text-emerald-600 font-bold">#{orderId}</span>
                  </p>
                )}
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  Thank you! Your order has been confirmed and will be delivered soon.
                </p>
              </div>

              <div className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-5 py-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Deliver to</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[60%]">{address.line1}, {address.city}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Amount paid</span>
                  <span className="font-bold text-emerald-700">₹{orderTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Delivery charge</span>
                  {isFreeDelivery
                    ? <span className="font-bold text-emerald-600">FREE 🎉</span>
                    : <span className="font-semibold text-slate-700">₹{deliveryCharge}</span>}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Estimated delivery</span>
                  <span className="font-semibold text-slate-700">3–5 business days</span>
                </div>
              </div>

              <div className="flex w-full gap-3">
                <button
                  onClick={handleDone}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition active:scale-[0.98]"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
