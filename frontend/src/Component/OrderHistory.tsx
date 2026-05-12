import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, Truck, CheckCircle2, Clock, Package, 
  RefreshCw, Search, Calendar, Filter, X 
} from 'lucide-react';
import { fadeUp, staggerContainer, staggerItem } from '../animations';

interface OrderHistoryProps {
  onBack: () => void;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  delivered:  { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  shipped:    { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
  processing: { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  pending:    { bg: 'bg-slate-50',   text: 'text-slate-600',   dot: 'bg-slate-400'   },
};

const OrderHistory: React.FC<OrderHistoryProps> = ({ onBack }) => {
  const { orderHistory, isLoadingOrders, loadOrderHistory } = useOrders();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Filter states (initialized from localStorage)
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem('order_search') || '');
  const [statusFilter, setStatusFilter] = useState(() => localStorage.getItem('order_status') || 'all');
  const [dateFilter, setDateFilter] = useState(() => localStorage.getItem('order_date') || ''); // YYYY-MM-DD
  const [showFilters, setShowFilters] = useState(false);

  // Persist filters to localStorage
  useEffect(() => {
    localStorage.setItem('order_search', searchTerm);
    localStorage.setItem('order_status', statusFilter);
    localStorage.setItem('order_date', dateFilter);
  }, [searchTerm, statusFilter, dateFilter]);

  /* Always re-fetch when this page mounts */
  useEffect(() => {
    loadOrderHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredOrders = useMemo(() => {
    return orderHistory.filter(order => {
      const matchesSearch = searchTerm === '' || 
        order.id.toString().includes(searchTerm) || 
        order.shipping_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      const matchesDate = dateFilter === '' || 
        new Date(order.created_at).toISOString().split('T')[0] === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orderHistory, searchTerm, statusFilter, dateFilter]);

  const status = (s: string) => statusConfig[s] ?? statusConfig.pending;

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible"
          className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
              {isAdmin ? 'All Orders' : 'My Orders'}
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
              {isAdmin ? 'All Customer Orders' : 'Your Order History'}
            </h1>
            {!isLoadingOrders && (
              <p className="mt-1 text-slate-500 text-sm">
                Showing {filteredOrders.length} of {orderHistory.length} orders
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 border border-emerald-100 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-xl hover:bg-emerald-600 hover:text-white transition text-sm font-bold shadow-sm"
            >
              <Search size={16} />
              Search Products
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition text-sm font-semibold ${showFilters ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'}`}
            >
              <Filter size={16} />
              Filters
            </button>
            <button
              onClick={() => loadOrderHistory()}
              disabled={isLoadingOrders}
              className="flex items-center gap-2 border border-slate-200 bg-white text-slate-600 px-4 py-2.5 rounded-xl hover:border-emerald-300 hover:text-emerald-600 transition text-sm font-semibold disabled:opacity-50"
            >
              <RefreshCw size={15} className={isLoadingOrders ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* ── Filter Controls ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Search Orders</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text"
                      placeholder="Order ID, product..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Status</label>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Order Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={clearFilters}
                    className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition flex items-center justify-center gap-2"
                  >
                    <X size={14} /> Clear
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Loading state ── */}
        {isLoadingOrders && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 rounded-full border-4 border-slate-100 border-t-emerald-500 animate-spin" />
            <p className="text-slate-500 font-medium">Loading your orders…</p>
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoadingOrders && filteredOrders.length === 0 && (
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible"
            className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-24 text-center"
          >
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <Package size={36} className="text-slate-300" />
            </div>
            <h2 className="text-xl font-bold text-slate-700">No orders found</h2>
            <p className="mt-2 text-slate-500 max-w-sm text-sm">
              {orderHistory.length === 0 
                ? "Start shopping and place your first order to build your order history."
                : "Try adjusting your filters to find what you're looking for."}
            </p>
            {orderHistory.length === 0 ? (
              <button
                onClick={onBack}
                className="mt-6 bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition font-semibold text-sm"
              >
                Browse Products
              </button>
            ) : (
              <button
                onClick={clearFilters}
                className="mt-6 bg-slate-800 text-white px-6 py-2.5 rounded-xl hover:bg-slate-900 transition font-semibold text-sm"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        )}

        {/* ── Orders list ── */}
        {!isLoadingOrders && filteredOrders.length > 0 && (
          <motion.div
            variants={staggerContainer} initial="hidden" animate="visible"
            className="space-y-6"
          >
            {filteredOrders.map((order) => {
              const cfg = status(order.status);
              const total = typeof order.total_amount === 'string'
                ? parseFloat(order.total_amount)
                : order.total_amount;

              return (
                <motion.div
                  key={order.id}
                  variants={staggerItem}
                  className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                >
                  {/* Order header bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Order</span>
                      <span className="font-bold text-slate-900 text-lg">#{order.id}</span>
                    </div>

                    {/* Status badge */}
                    <span className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>

                    <div className="text-right">
                      <p className="text-xs text-slate-400">Total</p>
                      <p className="text-lg font-extrabold text-slate-900">₹{total.toFixed(2)}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-400">Date</p>
                      <p className="text-sm font-semibold text-slate-700">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Delivery + Payment */}
                  <div className="grid gap-4 lg:grid-cols-2 px-6 py-5">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Shipping Address</p>
                      <p className="text-sm text-slate-700">{order.shipping_address}</p>
                      <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <Truck size={13} /> Delivery updates available
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Payment</p>
                      <p className="text-sm text-slate-700">Online Payment</p>
                      <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <Clock size={13} /> Processing time may vary
                      </p>
                    </div>
                  </div>

                  {/* Items table */}
                  <div className="mx-6 mb-6 rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-4 bg-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                      <span className="col-span-2">Product</span>
                      <span className="text-center">Qty</span>
                      <span className="text-right">Subtotal</span>
                    </div>
                    {order.items.map((item) => {
                      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                      return (
                        <div key={item.id} className="grid grid-cols-4 px-4 py-3 text-sm text-slate-700 border-t border-slate-100 hover:bg-slate-50 transition">
                          <span className="col-span-2 font-medium">{item.product.name}</span>
                          <span className="text-center text-slate-500">×{item.quantity}</span>
                          <span className="text-right font-semibold">₹{(price * item.quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                    {/* Total row */}
                    <div className="grid grid-cols-4 px-4 py-3 bg-emerald-50 text-sm border-t border-emerald-100">
                      <span className="col-span-2 font-bold text-slate-700">Order Total</span>
                      <span />
                      <span className="text-right font-extrabold text-emerald-700">₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Status steps */}
                  <div className="px-6 pb-6">
                    <div className="flex items-center gap-0">
                      {['pending', 'processing', 'shipped', 'delivered'].map((step, i, arr) => {
                        const stepCfg = statusConfig[step] ?? statusConfig.pending;
                        const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
                        const currentIdx = statusOrder.indexOf(order.status);
                        const isDone = i <= currentIdx;
                        return (
                          <React.Fragment key={step}>
                            <div className="flex flex-col items-center gap-1">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${isDone ? `${stepCfg.bg} ${stepCfg.text} border-current` : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                {isDone ? <CheckCircle2 size={14} /> : i + 1}
                              </div>
                              <span className={`text-[10px] font-semibold capitalize ${isDone ? stepCfg.text : 'text-slate-400'}`}>{step}</span>
                            </div>
                            {i < arr.length - 1 && (
                              <div className={`flex-1 h-0.5 mb-4 ${i < currentIdx ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                            )}
                          </React.Fragment>
                        );
                      })}
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
};

export default OrderHistory;
