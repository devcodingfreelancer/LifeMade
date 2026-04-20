import { ShoppingBag, ShieldCheck, HeartPulse, Gift, ArrowRight, Package, ShoppingCart } from 'lucide-react';
import MedicalProducts from '../MedicalProducts';
import HeroSection from './HeroHm';
import Footer from '../Footer';

const categoryData = [
  { label: 'Medical Supplies', description: 'Trusted equipment for home healthcare', color: 'bg-sky-100', icon: ShoppingBag },
  { label: 'Wellness', description: 'Daily supplements and support products', color: 'bg-pink-100', icon: HeartPulse },
  { label: 'First Aid', description: 'Emergency kits and care essentials', color: 'bg-amber-100', icon: Package },
  { label: 'Safety', description: 'Masks, sanitizers, and protective gear', color: 'bg-emerald-100', icon: ShieldCheck },
];

const featureData = [
  { title: 'Fast Delivery', value: 'Across India', description: 'Super quick delivery to your doorstep.', color: 'bg-emerald-600', icon: ShoppingCart },
  { title: 'Daily Deals', value: 'Up to 70% off', description: 'Handpicked offers on top products every day.', color: 'bg-slate-800', icon: Gift },
  { title: 'Easy Returns', value: '7-day policy', description: 'Simple returns and refunds, no stress.', color: 'bg-blue-600', icon: ShieldCheck },
];

const HomeMain = () => {
  return (
    <main className="bg-slate-50 text-slate-900">
      <HeroSection/>
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
                LiveMad retailer • Shop faster with top brands
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
                  LiveMad brings the best retail experience to your home.
                </h1>
                <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
                  Discover a curated marketplace for electronics, fashion, home essentials, and wellness products. Shop confidently with fast delivery, great prices, and reliable customer support.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 sm:max-w-lg">
                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700">
                  Start Shopping
                  <ArrowRight size={18} />
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-500 hover:text-emerald-700">
                  Explore Categories
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {featureData.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${feature.color} text-white`}>
                        <Icon size={20} />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-900">{feature.title}</p>
                      <p className="text-3xl font-bold text-slate-900 mt-2">{feature.value}</p>
                      <p className="mt-2 text-sm text-slate-500">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_45%)]" />
              <div className="relative rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-emerald-600 to-sky-500 p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] font-semibold text-emerald-100">Featured</p>
                        <h2 className="mt-4 text-3xl font-bold">LiveMad Picks</h2>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-3">
                        <ShoppingBag size={28} className="text-white" />
                      </div>
                    </div>
                    <p className="mt-5 text-sm text-emerald-100/90">Handpicked products for fast-moving retail shopping.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-sm">
                      <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Top seller</p>
                      <p className="mt-4 text-lg font-semibold">Smart home speaker</p>
                      <p className="mt-3 text-sm text-slate-400">Connect, play, and control every room with ease.</p>
                    </div>
                    <div className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-sm">
                      <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Trending</p>
                      <p className="mt-4 text-lg font-semibold">Everyday fashion styles</p>
                      <p className="mt-3 text-sm text-slate-400">Fresh new looks for him and her, delivered today.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MedicalProducts />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Shop by category</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Explore top retail categories</h2>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700">
            View all categories
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categoryData.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.label} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className={`${category.color} inline-flex h-14 w-14 items-center justify-center rounded-3xl text-slate-900 shadow-sm`}>
                  <Icon size={24} />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900">{category.label}</h3>
                <p className="mt-2 text-sm text-slate-500">{category.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                  Explore
                  <ArrowRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Why LiveMad</p>
              <h2 className="text-4xl font-bold text-slate-900">The retail store built for everyday convenience</h2>
              <p className="max-w-xl text-base text-slate-600">
                LiveMad helps customers shop easily across product categories, discover the best deals, and get fast delivery through a seamless online retail experience.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-3xl font-bold text-slate-900">1</p>
                  <p className="mt-3 font-semibold text-slate-900">Browse products</p>
                  <p className="mt-2 text-sm text-slate-500">Search and compare thousands of items in one place.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-3xl font-bold text-slate-900">2</p>
                  <p className="mt-3 font-semibold text-slate-900">Choose your favorites</p>
                  <p className="mt-2 text-sm text-slate-500">Pick the best deals for your home, fashion, and wellness needs.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-3xl font-bold text-slate-900">3</p>
                  <p className="mt-3 font-semibold text-slate-900">Fast delivery</p>
                  <p className="mt-2 text-sm text-slate-500">Get your purchase delivered quickly with smooth tracking.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-emerald-50 p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">Fresh deals, daily inspiration</h3>
              <p className="mt-4 text-slate-700">LiveMad highlights products you love, from seasonal essentials to trending arrivals.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {['Smartphones', 'Home décor', 'Fashion wear', 'Beauty picks'].map((item) => (
                  <div key={item} className="rounded-3xl bg-white p-5 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.18em] text-emerald-600">{item}</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">Top picks</p>
                    <div className="mt-4 h-24 rounded-3xl bg-emerald-600/10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default HomeMain;
