import { useMemo, useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { useFavorites } from '../context/FavoriteContext';
import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard';
import { Search, Filter } from 'lucide-react';

const MedicalProducts: React.FC = () => {
  const { products } = useProducts();
  const { addToCart } = useOrders();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.category_name)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category_name === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <section className="bg-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Medical Products</p>
            <h2 className="mt-3 text-4xl font-bold text-slate-900">Shop medical supplies for safe care</h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              Browse curated medical and healthcare essentials designed for wellness, pharmacy use, and everyday health support.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto] w-full md:w-auto">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search medical products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-full border border-slate-300 bg-white py-3 px-4 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
            <p className="text-lg font-semibold">No products found</p>
            <p className="mt-2">Try another category or search term to find the right medical item.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                isFavorite={isFavorite(product.id)}
                onToggleFavorite={() => toggleFavorite(product.id)}
              />
            ))}
          </div>
        )}

        <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-600">Favorites</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {favorites.length} product{favorites.length === 1 ? '' : 's'} saved to favorites
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              <Filter className="h-4 w-4" />
              Quick filter for health essentials
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MedicalProducts;
