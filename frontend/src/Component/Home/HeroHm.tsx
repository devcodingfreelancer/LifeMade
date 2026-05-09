import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Shield, Truck, HeartPulse, Star } from 'lucide-react';

interface HeroSectionProps {
  onShopNow?: () => void;
}

const stats = [
  { value: '2.5L+',  label: 'Products Available' },
  { value: '500+',   label: 'Trusted Brands'      },
  { value: '24hr',   label: 'Express Delivery'    },
  { value: '4.9★',   label: 'Customer Rating'     },
];

const pills = [
  { icon: Shield,    text: 'Verified Medicines'  },
  { icon: Truck,     text: 'Free Delivery'        },
  { icon: HeartPulse,text: 'Health Experts'       },
  { icon: Star,      text: 'Best Prices'          },
];

export default function HeroSection({ onShopNow }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 min-h-[92vh] flex items-center">

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/5 blur-2xl" />
      </div>

      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="grid gap-12 lg:grid-cols-2 items-center">

          {/* ── LEFT CONTENT ── */}
          <div className="space-y-8">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
                <HeartPulse size={14} />
                India's Trusted Medical Marketplace
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight">
                Your Health,{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                Shop from 2.5 lakh+ verified medical products — medicines, wellness essentials, and healthcare equipment — delivered to your door.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              <button
                onClick={onShopNow}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400
                           px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-emerald-500/25
                           transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                <ShoppingBag size={20} />
                Shop Now
              </button>
              <button
                onClick={onShopNow}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5
                           px-7 py-3.5 text-base font-bold text-white backdrop-blur-sm
                           hover:bg-white/10 transition-all duration-200 hover:-translate-y-0.5"
              >
                Browse Products
                <ArrowRight size={18} />
              </button>
            </motion.div>

            {/* Pills row */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-2"
            >
              {pills.map(({ icon: Icon, text }) => (
                <span key={text} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
                  <Icon size={12} className="text-emerald-400" />
                  {text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT CARD CLUSTER ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Main card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">

                {/* Hero feature card */}
                <div className="col-span-2 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-200">Featured</p>
                  <h2 className="mt-3 text-2xl font-bold">Medical Supplies</h2>
                  <p className="mt-2 text-sm text-emerald-100/80">Hospital-grade products for home & clinic use</p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-200">
                    Shop Now <ArrowRight size={14} />
                  </div>
                </div>

                {/* Mini cards */}
                {[
                  { label: 'Wellness', value: '500+ SKUs', color: 'bg-blue-900/60' },
                  { label: 'First Aid', value: 'Ready stock', color: 'bg-slate-800/80' },
                ].map(({ label, value, color }) => (
                  <div key={label} className={`rounded-2xl ${color} border border-white/10 p-5 text-white`}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
                    <p className="mt-3 text-lg font-bold">{value}</p>
                    <div className="mt-2 h-1.5 w-12 rounded-full bg-emerald-500/60" />
                  </div>
                ))}
              </div>
            </div>

            {/* Floating trust badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              className="absolute -bottom-5 -left-6 flex items-center gap-3 rounded-2xl border border-white/10
                         bg-slate-900/90 backdrop-blur-md px-4 py-3 shadow-xl"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Shield size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">100% Authentic</p>
                <p className="text-[11px] text-slate-400">All products verified</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── STATS BAR ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {stats.map(({ value, label }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-4 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{value}</p>
              <p className="mt-1 text-xs font-medium text-slate-400">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}