import { useMemo, useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { useFavorites } from '../context/FavoriteContext';
import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard';
import {
  Search, SlidersHorizontal, LayoutGrid, List,
  ChevronDown, X, Tag, TrendingUp, Star, Package
} from 'lucide-react';

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'stock-desc';

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: 'Default',       value: 'default'     },
  { label: 'Price: Low → High', value: 'price-asc'  },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Name A → Z',   value: 'name-asc'    },
  { label: 'Most In Stock', value: 'stock-desc'  },
];

const MedicalProducts: React.FC = () => {
  const { products } = useProducts();
  const { addToCart } = useOrders();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const [searchTerm,       setSearchTerm]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortKey,          setSortKey]          = useState<SortKey>('default');
  const [maxPrice,         setMaxPrice]         = useState<number>(100000);
  const [gridView,         setGridView]         = useState<'grid' | 'list'>('grid');
  const [showSort,         setShowSort]         = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category_name))).filter(Boolean),
    [products]
  );

  const globalMax = useMemo(
    () => Math.ceil(Math.max(...products.map((p) => p.price), 0) / 100) * 100 || 100000,
    [products]
  );

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = !selectedCategory || p.category_name === selectedCategory;
      const matchPrice = p.price <= maxPrice;
      return matchSearch && matchCat && matchPrice;
    });

    switch (sortKey) {
      case 'price-asc':   list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price-desc':  list = [...list].sort((a, b) => b.price - a.price); break;
      case 'name-asc':    list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'stock-desc':  list = [...list].sort((a, b) => b.stock - a.stock); break;
      default: break;
    }
    return list;
  }, [products, searchTerm, selectedCategory, sortKey, maxPrice]);

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortKey)?.label ?? 'Sort';

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── PAGE BANNER ── */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 pt-12 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-400 mb-3">
            Medical Supplies
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Shop Healthcare Products
          </h1>
          <p className="mt-4 max-w-xl text-slate-300 text-base">
            Curated medical and wellness essentials — trusted quality, delivered fast across India.
          </p>

          {/* Stats bar */}
          <div className="mt-8 flex flex-wrap gap-4">
            {[
              { icon: Package,   label: `${products.length} Products`      },
              { icon: Tag,       label: `${categories.length} Categories`  },
              { icon: Star,      label: `${favorites.length} Favourites`   },
              { icon: TrendingUp,label: 'Free Delivery on all orders'      },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <Icon size={15} className="text-emerald-400" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STICKY FILTER BAR ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">

          {/* Search */}
          <label className="relative flex-1 min-w-[180px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search products…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
            />
          </label>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSort((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 transition whitespace-nowrap"
            >
              <SlidersHorizontal size={15} />
              {activeSortLabel}
              <ChevronDown size={14} className={`transition-transform ${showSort ? 'rotate-180' : ''}`} />
            </button>
            {showSort && (
              <div className="absolute left-0 top-full mt-1 z-50 w-52 rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortKey(opt.value); setShowSort(false); }}
                    className={`w-full px-4 py-2.5 text-left text-sm font-medium transition ${
                      sortKey === opt.value
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid / List toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setGridView('grid')}
              className={`p-2.5 transition ${gridView === 'grid' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setGridView('list')}
              className={`p-2.5 transition ${gridView === 'list' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>

          {/* Result count */}
          <span className="ml-auto text-xs font-semibold text-slate-500 whitespace-nowrap">
            {filtered.length} of {products.length} products
          </span>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">

        {/* ── SIDEBAR FILTERS ── */}
        <aside className="hidden lg:flex flex-col gap-6 w-56 flex-shrink-0">

          {/* Category filter */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Category</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left rounded-xl px-3 py-2 text-sm font-medium transition ${
                  !selectedCategory ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left rounded-xl px-3 py-2 text-sm font-medium transition flex items-center justify-between ${
                    selectedCategory === cat ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat}</span>
                  <span className="text-xs bg-slate-100 rounded-full px-2 py-0.5 ml-1 flex-shrink-0">
                    {products.filter((p) => p.category_name === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Max Price</h3>
            <input
              type="range"
              min={0}
              max={globalMax}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">₹0</span>
              <span className="text-sm font-bold text-emerald-700">≤ ₹{maxPrice.toLocaleString()}</span>
            </div>
            {maxPrice < globalMax && (
              <button
                onClick={() => setMaxPrice(globalMax)}
                className="mt-3 w-full text-xs font-semibold text-slate-500 hover:text-red-500 transition flex items-center justify-center gap-1"
              >
                <X size={11} /> Clear price filter
              </button>
            )}
          </div>

          {/* Favourites chip */}
          {favorites.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
              <Star size={20} className="mx-auto text-amber-500 mb-1" />
              <p className="text-sm font-semibold text-amber-800">{favorites.length} Saved</p>
              <p className="text-xs text-amber-600 mt-0.5">Your favourites</p>
            </div>
          )}
        </aside>

        {/* ── PRODUCT GRID / LIST ── */}
        <div className="flex-1 min-w-0">

          {/* Active category chips (mobile friendly) */}
          {(selectedCategory || searchTerm) && (
            <div className="flex flex-wrap gap-2 mb-5">
              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1 text-sm font-semibold text-emerald-800">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('')} className="hover:text-red-600 transition">
                    <X size={13} />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-red-600 transition">
                    <X size={13} />
                  </button>
                </span>
              )}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
              <Package size={48} className="text-slate-300 mb-4" />
              <p className="text-lg font-semibold text-slate-700">No products found</p>
              <p className="mt-2 text-sm text-slate-500 max-w-xs">
                Try adjusting your search term, category, or price range.
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory(''); setMaxPrice(globalMax); }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
              >
                Clear all filters
              </button>
            </div>
          ) : gridView === 'grid' ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => addToCart({ id: product.id.toString(), quantity: 1, name: product.name, price: product.price })}
                  isFavorite={isFavorite(product.id.toString())}
                  onToggleFavorite={() => toggleFavorite(product.id.toString())}
                />
              ))}
            </div>
          ) : (
            /* List view */
            <div className="space-y-3">
              {filtered.map((product) => (
                <div key={product.id} className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1580281657521-782f1f8d4d91?auto=format&fit=crop&w=400&q=80'}
                    alt={product.name}
                    className="h-20 w-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 mb-1">
                      {product.category_name}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 truncate">{product.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">{product.description}</p>
                    <p className="text-xs text-slate-400 mt-1">Stock: {product.stock}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <p className="text-xl font-bold text-slate-900">₹{product.price.toFixed(2)}</p>
                    <button
                      onClick={() => addToCart({ id: product.id.toString(), quantity: 1, name: product.name, price: product.price })}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition active:scale-95"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalProducts;
