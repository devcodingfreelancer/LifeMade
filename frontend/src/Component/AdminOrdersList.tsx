import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';

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

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                        selectedOrder?.id === order.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">#{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.user_name || `User ${order.user}`}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                        ₹{typeof order.total_amount === 'string' ? parseFloat(order.total_amount).toFixed(2) : order.total_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details and Status Update */}
        {selectedOrder && (
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order #{selectedOrder.id} Details</h2>

            {/* Customer Info */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-semibold text-gray-900">{selectedOrder.user_name || `User ${selectedOrder.user}`}</p>
              <p className="text-sm text-gray-600 mt-2">Shipping Address</p>
              <p className="text-sm text-gray-900">{selectedOrder.shipping_address}</p>
            </div>

            {/* Total Amount */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{typeof selectedOrder.total_amount === 'string' ? parseFloat(selectedOrder.total_amount).toFixed(2) : selectedOrder.total_amount.toFixed(2)}
              </p>
            </div>

            {/* Status Update */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Current Status</p>
              <p className="font-semibold text-gray-900 mb-4">
                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
              </p>
              <label className="text-sm text-gray-600">Update Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg transition"
              >
                {updatingStatus ? 'Updating...' : 'Update Status'}
              </button>
            </div>

            {/* Order Items */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3">Items ({selectedOrder.items.length})</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900 text-sm">{item.product.name}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity} × ₹{
                      typeof item.price === 'string' ? parseFloat(item.price).toFixed(2) : item.price.toFixed(2)
                    }</p>
                    <p className="text-sm text-gray-900 font-semibold">
                      ₹{(
                        (typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersList;
