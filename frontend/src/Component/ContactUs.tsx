import React, { useState } from "react";
import {
  Mail, MapPin, Phone, Send, CheckCircle,
  Clock, Globe, MessageSquare,
} from "lucide-react";
import contactHero from "../assets/contact_hero.png";

export default function ContactUs() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", subject: "", message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════ */}
      <section className="relative ">
        <div className="relative  overflow-hidden shadow-2xl h-[400px] md:h-[500px]">
          {/* Background image */}
          <img
            src={contactHero}
            alt="Contact LeifMed"
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
          {/* Layered overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-800/50 to-slate-900/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent" />

          {/* Decorative blobs */}
          <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-pulse" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10" />

          {/* Hero text */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full mb-5">
              <MessageSquare size={12} /> Support & Partnerships
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 leading-tight">
              We're Here to <span className="text-emerald-400">Help</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl leading-relaxed">
              Reach out for product inquiries, bulk orders, B2B partnerships, or any support. Our team responds within 24 hours.
            </p>

            {/* Quick pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { icon: <Mail size={13} />, text: "support@leifmed.com" },
                { icon: <Phone size={13} />, text: "+1 (555) 123-4567" },
                { icon: <Clock size={13} />, text: "Mon–Fri, 9am–6pm EST" },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm px-4 py-2 rounded-full">
                  {p.icon} {p.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 2 — CONTACT FORM (centered)
      ════════════════════════════════════════════ */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Section label */}
          <div className="text-center mb-12">
            <span className="inline-block text-emerald-600 text-xs font-bold uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full mb-3">
              Send a Message
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">Tell Us How We Can Help</h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto">
              Fill in the form below and one of our team members will get back to you within one business day.
            </p>
          </div>

          {sent ? (
            /* Success card */
            <div className="bg-white rounded-3xl border border-emerald-100 shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={44} className="text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Message Received!</h3>
              <p className="text-slate-500 mb-2">Thank you, we'll get back to you within 24 hours.</p>
              <p className="text-slate-400 text-sm mb-8">Check your inbox for a confirmation email.</p>
              <button
                onClick={() => { setSent(false); setForm({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" }); }}
                className="bg-slate-800 text-white px-8 py-3 rounded-xl hover:bg-emerald-600 transition font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="First Name" type="text" value={form.firstName} onChange={v => setForm({ ...form, firstName: v })} placeholder="John" required />
                  <InputField label="Last Name" type="text" value={form.lastName} onChange={v => setForm({ ...form, lastName: v })} placeholder="Doe" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Email Address" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="john@company.com" required />
                  <InputField label="Phone (optional)" type="tel" value={form.phone} onChange={v => setForm({ ...form, phone: v })} placeholder="+1 555 000 0000" />
                </div>
                <InputField label="Subject" type="text" value={form.subject} onChange={v => setForm({ ...form, subject: v })} placeholder="Product inquiry, partnership, support…" required />
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us more about your needs…"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 bg-slate-800 text-white font-bold rounded-2xl px-6 py-4 hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-200 active:scale-[0.98] disabled:opacity-60 text-base"
                >
                  {loading
                    ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5" />
                    : <Send size={18} />}
                  {loading ? "Sending your message…" : "Send Message"}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 3 — CONTACT DETAILS (3-column cards)
      ════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-blue-600 text-xs font-bold uppercase tracking-widest bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-3">
              Contact Details
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">Other Ways to Reach Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <MapPin size={24} />,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                border: "border-emerald-100",
                title: "Our Office",
                lines: ["123 Health Avenue", "Medical District", "New York, NY 10001"],
              },
              {
                icon: <Phone size={24} />,
                color: "text-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-100",
                title: "Phone",
                lines: ["+1 (555) 123-4567", "+1 (555) 987-6543", "Mon–Fri, 9am–6pm EST"],
              },
              {
                icon: <Mail size={24} />,
                color: "text-purple-600",
                bg: "bg-purple-50",
                border: "border-purple-100",
                title: "Email",
                lines: ["support@leifmed.com", "sales@leifmed.com", "info@leifmed.com"],
              },
              {
                icon: <Globe size={24} />,
                color: "text-orange-600",
                bg: "bg-orange-50",
                border: "border-orange-100",
                title: "Business Hours",
                lines: ["Monday – Friday", "9:00 AM – 6:00 PM EST", "Emergency 24/7 support"],
              },
            ].map((card, i) => (
              <div key={i} className={`bg-white rounded-3xl p-7 border ${card.border} shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group`}>
                <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-3">{card.title}</h3>
                <div className="space-y-1">
                  {card.lines.map((line, j) => (
                    <p key={j} className="text-slate-500 text-sm">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 4 — MAP (full width, bottom)
      ════════════════════════════════════════════ */}
      <section>
        {/* Label above map */}
        <div className="bg-white py-10 px-4 md:px-8 text-center border-t border-slate-100">
          <span className="inline-block text-slate-600 text-xs font-bold uppercase tracking-widest bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-full mb-3">
            Find Us
          </span>
          <h2 className="text-2xl font-extrabold text-slate-800">Our Location</h2>
          <p className="text-slate-500 text-sm mt-1">123 Health Avenue, Medical District, New York, NY 10001</p>
        </div>

        {/* Full-width map */}
        <div className="w-full h-[420px] md:h-[500px]">
          <iframe
            title="LeifMed Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.617984752477!2d-73.9878453!3d40.748817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9aeb1c6b5%3A0x35b1cfbc89a6097f!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1600000000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

    </div>
  );
}

function InputField({
  label, type, value, onChange, placeholder, required,
}: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm"
      />
    </div>
  );
}
