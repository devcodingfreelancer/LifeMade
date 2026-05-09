import { useMemo, useState } from 'react';
import {
  ShoppingBag, ShieldCheck, HeartPulse, Package,
  ArrowRight, Truck, Star, Zap, Search, ChevronRight
} from 'lucide-react';
import HeroSection from './HeroHm';
import ProductCard from '../ProductCard';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { useFavorites } from '../../context/FavoriteContext';

interface HomeMainProps {
  onShopNow?: () => void;
  onOpenCart?: () => void;
}

const categoryData = [
  { label: 'Medical Supplies', description: 'Trusted equipment for home healthcare', color: 'bg-sky-100 text-sky-700',    icon: ShoppingBag  },
  { label: 'Wellness',         description: 'Daily supplements and support products', color: 'bg-pink-100 text-pink-700',  icon: HeartPulse   },
  { label: 'First Aid',        description: 'Emergency kits and care essentials',    color: 'bg-amber-100 text-amber-700', icon: Package      },
  { label: 'Safety',           description: 'Masks, sanitizers & protective gear',   color: 'bg-emerald-100 text-emerald-700', icon: ShieldCheck },
];

const trustFeatures = [
  { icon: Truck,     title: 'Free Delivery',  sub: 'On all orders across India'  },
  { icon: ShieldCheck, title: '100% Authentic', sub: 'Verified medical products'  },
  { icon: Zap,       title: 'Express 24hr',   sub: 'Same-day delivery available' },
  { icon: Star,      title: '4.9★ Rated',     sub: 'Trusted by 2.5L+ customers'  },
];

export default function HomeMain({ onShopNow, onOpenCart }: HomeMainProps) {
  const { products } = useProducts();
  const { addToCart } = useOrders();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [showAll, setShowAll] = useState(false);

  // All unique categories from products
  const productCategories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category_name).filter(Boolean)))],
    [products]
  );

  // Filter + slice
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        !activeCategory || activeCategory === 'All' || p.category_name === activeCategory;
      return matchSearch && matchCat;
    });
  }, [products, search, activeCategory]);

  const displayed = showAll ? filtered : filtered.slice(0, 8);

  return (
    <main className="bg-slate-50 text-slate-900">

      {/* ── HERO ── */}
      <HeroSection onShopNow={onShopNow} />

      {/* ── TRUST BAR ── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {trustFeatures.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{title}</p>
                  <p className="text-xs text-slate-500 leading-tight">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES STRIP ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Explore</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">Top Categories</h2>
          </div>
          <button
            onClick={onShopNow}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            View all <ArrowRight size={15} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryData.map(({ label, description, color, icon: Icon }) => (
            <button
              key={label}
              onClick={() => { setActiveCategory(label); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="group text-left overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200"
            >
              <div className={`${color} inline-flex h-13 w-13 items-center justify-center rounded-2xl p-3 shadow-sm`}>
                <Icon size={24} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{label}</h3>
              <p className="mt-1.5 text-sm text-slate-500 leading-snug">{description}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 group-hover:gap-3 transition-all">
                Explore <ChevronRight size={15} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── ALL PRODUCTS SECTION ── */}
      <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-24">

        {/* Section header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Our Inventory</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">All Medical Products</h2>
            <p className="mt-1 text-slate-500 text-sm">{filtered.length} products available</p>
          </div>

          {/* Search */}
          <label className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search medicines, brands…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition shadow-sm"
            />
          </label>
        </div>

        {/* Category pill filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {productCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === 'All' ? '' : cat)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                (cat === 'All' && !activeCategory) || activeCategory === cat
                  ? 'border-emerald-500 bg-emerald-600 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <Package size={48} className="text-slate-300 mb-4" />
            <p className="text-lg font-semibold text-slate-700">No products found</p>
            <p className="mt-1 text-sm text-slate-500">Try a different search or category.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory(''); }}
              className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayed.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() =>
                    addToCart({ id: product.id.toString(), quantity: 1, name: product.name, price: product.price })
                  }
                  isFavorite={isFavorite(product.id.toString())}
                  onToggleFavorite={() => toggleFavorite(product.id.toString())}
                />
              ))}
            </div>

            {/* Show more / less */}
            {filtered.length > 8 && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setShowAll((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 hover:shadow-md"
                >
                  {showAll ? 'Show Less' : `View All ${filtered.length} Products`}
                  <ArrowRight size={16} className={showAll ? 'rotate-90' : ''} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-white py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Simple Steps</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">How it works</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: '01', title: 'Browse & Search', desc: 'Find medicines and healthcare products from thousands of verified SKUs.' },
              { step: '02', title: 'Add to Cart',     desc: 'Select quantities, review your order and apply any applicable offers.' },
              { step: '03', title: 'Fast Delivery',   desc: 'Confirm your address and receive your order within 24–48 hours.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative rounded-3xl border border-slate-200 bg-slate-50 p-7">
                <span className="text-5xl font-extrabold text-emerald-100 select-none">{step}</span>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={onShopNow}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition hover:-translate-y-0.5 active:scale-95"
            >
              <ShoppingBag size={18} />
              Start Shopping Now
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}
