import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  user: number;
  total_amount: number | string;
  status: string;
  shipping_address: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  user_name?: string;
}

const AdminOrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = ['pending', 'shipped', 'delivered', 'cancelled'];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://lifemade.onrender.com/api/admin/orders/', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    setUpdatingStatus(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://lifemade.onrender.com/api/admin/orders/${selectedOrder.id}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(o => o.id === selectedOrder.id ? updatedOrder : o));
        setSelectedOrder(updatedOrder);
        setNewStatus('');
        alert('Order status updated successfully!');
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('Error updating order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchTerm) ||
    order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.shipping_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Orders Management</h1>
        <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search by Order ID, Customer Name, or Address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border-b border-gray-200 last:border-b-0">
                {/* Summary Row - Clickable */}
                <div
                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className="min-w-fit">
                      <p className="text-sm text-gray-600">Order</p>
                      <p className="font-bold text-gray-900 text-lg">#{order.id}</p>
                    </div>
                    <div className="min-w-fit">
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="min-w-fit">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-bold text-gray-900">
                        ₹{typeof order.total_amount === 'string' ? parseFloat(order.total_amount).toFixed(2) : order.total_amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="min-w-fit">
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {selectedOrder?.id === order.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedOrder?.id === order.id && (
                  <div className="px-6 py-6 bg-gray-50 border-t border-gray-200 space-y-6">
                    {/* Customer Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 font-semibold mb-2">Customer</p>
                        <p className="font-semibold text-gray-900">{selectedOrder.user_name || `User ${selectedOrder.user}`}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold mb-2">Shipping Address</p>
                        <p className="text-sm text-gray-700">{selectedOrder.shipping_address}</p>
                      </div>
                    </div>

                    {/* Status Update Section */}
                    <div className="border-t border-gray-200 pt-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-600 font-semibold mb-2">Current Status</p>
                          <p className="font-semibold text-gray-900">
                            {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 font-semibold mb-2 block">Update Status</label>
                          <div className="flex gap-2">
                            <select
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            >
                              <option value="">-- Select New Status --</option>
                              {statusOptions.map(status => (
                                <option key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={handleStatusUpdate}
                              disabled={!newStatus || updatingStatus}
                              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg transition whitespace-nowrap"
                            >
                              {updatingStatus ? 'Updating...' : 'Update'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-gray-200 pt-6">
                      <p className="text-sm font-semibold text-gray-600 mb-4">Order Items ({selectedOrder.items.length})</p>
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {selectedOrder.items.map(item => (
                          <div key={item.id} className="p-4 bg-white rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{item.product.name}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Quantity: {item.quantity} × ₹{
                                    typeof item.price === 'string' ? parseFloat(item.price).toFixed(2) : item.price.toFixed(2)
                                  }
                                </p>
                              </div>
                              <div className="text-right whitespace-nowrap">
                                <p className="text-sm text-gray-600">Subtotal</p>
                                <p className="font-bold text-gray-900">
                                  ₹{(
                                    (typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity
                                  ).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Total */}
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex justify-between items-center bg-green-50 rounded-lg p-4 border border-green-200">
                        <p className="font-semibold text-gray-900">Order Total</p>
                        <p className="text-2xl font-bold text-green-700">
                          ₹{typeof selectedOrder.total_amount === 'string' ? parseFloat(selectedOrder.total_amount).toFixed(2) : selectedOrder.total_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersList;
