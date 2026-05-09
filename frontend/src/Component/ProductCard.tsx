import { Heart, HeartOff, ShoppingCart, Plus, Minus } from 'lucide-react';
import type { CartItem } from '../context/OrderContext';
import type { Product } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (item: CartItem) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isFavorite, onToggleFavorite }) => {
  const { cart, updateQuantity } = useOrders();
  const cartItem = cart.find((item) => item.id === product.id.toString());
  const qty = cartItem?.quantity ?? 0;

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative overflow-hidden bg-slate-100">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1580281657521-782f1f8d4d91?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <button
          onClick={onToggleFavorite}
          className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-sm transition hover:bg-white"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? <Heart size={20} /> : <HeartOff size={20} />}
        </button>

        {qty > 0 && (
          <span className="absolute left-4 top-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow">
            {qty} in cart
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {product.category_name || 'Category'}
          </span>
          <span className="text-sm font-semibold text-slate-600">Stock: {product.stock}</span>
        </div>

        <h3 className="mt-4 text-xl font-semibold text-slate-900">{product.name}</h3>
        <p className="mt-3 text-sm text-slate-500 line-clamp-3">{product.description}</p>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Price</p>
            <p className="text-2xl font-bold text-slate-900">₹{product.price.toFixed(2)}</p>
          </div>

          {qty === 0 ? (
            <button
              onClick={() => onAddToCart({ id: product.id.toString(), name: product.name, price: product.price, quantity: 1 })}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-95"
            >
              <ShoppingCart size={18} /> Add
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(product.id.toString(), -1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-red-50 hover:border-red-300 hover:text-red-600 active:scale-95"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="min-w-[2rem] text-center text-lg font-bold text-slate-900">{qty}</span>
              <button
                onClick={() => updateQuantity(product.id.toString(), 1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-600 hover:text-white hover:border-emerald-600 active:scale-95"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
