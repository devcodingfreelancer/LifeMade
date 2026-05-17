import { Heart, ShoppingCart, Trash2, Package } from "lucide-react";
import { useFavorites } from "../context/FavoriteContext";
import { useProducts } from "../context/ProductContext";
import { useOrders } from "../context/OrderContext";

interface WishlistProps {
  onGoShopping?: () => void;
}

export default function Wishlist({ onGoShopping }: WishlistProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const { products } = useProducts();
  const { addToCart } = useOrders();

  const favoriteProducts = products.filter((p) =>
    favorites.includes(p.id.toString())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-red-50 text-red-500 rounded-xl">
            <Heart size={22} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">My Wishlist</h1>
        </div>
        <p className="text-slate-500 ml-12">
          {favoriteProducts.length > 0
            ? `${favoriteProducts.length} saved item${favoriteProducts.length > 1 ? "s" : ""}`
            : "No saved items yet"}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <Heart size={48} className="text-red-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Your wishlist is empty</h2>
            <p className="text-slate-500 mb-8 max-w-sm">
              Browse our products and tap the heart icon to save your favourites here.
            </p>
            <button
              onClick={onGoShopping}
              className="flex items-center gap-2 bg-slate-800 text-white px-7 py-3 rounded-xl hover:bg-emerald-600 transition-all shadow-md"
            >
              <Package size={18} /> Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={
                      product.image ||
                      "https://images.unsplash.com/photo-1580281657521-782f1f8d4d91?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Remove from wishlist */}
                  <button
                    onClick={() => toggleFavorite(product.id.toString())}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-red-500 shadow-sm hover:bg-red-50 transition"
                    aria-label="Remove from wishlist"
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>

                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                    {product.category_name || "Medicine"}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 text-base mb-1 truncate">{product.name}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4">{product.description}</p>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl font-bold text-slate-900">₹{product.price.toFixed(2)}</span>
                    <div className="flex items-center gap-2">
                      {/* <button
                        onClick={() => toggleFavorite(product.id.toString())}
                        className="p-2 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition"
                        aria-label="Remove"
                      >
                        <Trash2 size={15} />
                      </button> */}
                      <button
                        onClick={() =>
                          addToCart({
                            id: product.id.toString(),
                            name: product.name,
                            price: product.price,
                            quantity: 1,
                          })
                        }
                        className="flex items-center gap-1.5 bg-slate-800 text-white text-sm px-4 py-2 rounded-xl hover:bg-emerald-600 transition"
                      >
                        <ShoppingCart size={15} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
