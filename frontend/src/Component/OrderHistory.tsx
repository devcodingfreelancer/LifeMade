import React from 'react';
import { useOrders } from '../context/OrderContext';
import { ArrowRight, Truck, CheckCircle2, Clock } from 'lucide-react';

interface OrderHistoryProps {
  onBack: () => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ onBack }) => {
  const { orderHistory } = useOrders();

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">My Orders</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900">Your order history</h1>
          </div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            Back to shop
            <ArrowRight size={16} />
          </button>
        </div>

        {orderHistory.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            <p className="text-lg font-semibold">No orders yet.</p>
            <p className="mt-2">Start shopping and place your first order to build your order history.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orderHistory.map((order) => (
              <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Order ID</p>
                    <p className="text-lg font-semibold text-slate-900">#{order.id}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-sm text-slate-500">Status</p>
                      <p className={`mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                        order.status === 'processing' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-gray-50 text-gray-700'
                      }`}>
                        <CheckCircle2 size={16} /> {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Order date</p>
                      <p className="mt-1 text-sm text-slate-900">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Total</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">₹{order.total_amount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Delivery</p>
                    <p className="mt-2 text-sm text-slate-700">{order.shipping_address}</p>
                    <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Truck size={16} /> Delivery updates available
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Payment</p>
                    <p className="mt-2 text-sm text-slate-700">Online Payment</p>
                    <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Clock size={16} /> Processing time may vary
                    </p>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                  <div className="grid gap-3 border-b border-slate-200 bg-slate-100 px-6 py-4 text-sm uppercase tracking-[0.21em] text-slate-500 sm:grid-cols-4">
                    <span>Product</span>
                    <span>Qty</span>
                    <span>Price</span>
                    <span className="text-right">Subtotal</span>
                  </div>
                  {order.items.map((item) => (
                    <div key={item.id} className="grid gap-3 px-6 py-4 text-sm text-slate-700 sm:grid-cols-4">
                      <span>{item.product.name}</span>
                      <span>{item.quantity}</span>
                      <span>₹{item.price.toFixed(2)}</span>
                      <span className="text-right">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
