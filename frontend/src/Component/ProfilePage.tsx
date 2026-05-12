import React, { useState } from "react";
import {
  User, Mail, ShieldCheck, Package, Heart, Lock,
  ChevronRight, Edit3, LogOut, CheckCircle, AlertCircle,
  KeyRound, Save, X, Camera,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoriteContext";
import { useOrders } from "../context/OrderContext";

interface ProfilePageProps {
  onWishlistClick?: () => void;
  onOrdersClick?: () => void;
}

type Tab = "profile" | "security";

export default function ProfilePage({ onWishlistClick, onOrdersClick }: ProfilePageProps) {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { orderHistory } = useOrders();

  const [activeTab, setActiveTab] = useState<Tab>("profile");

  /* ── Edit Profile state ── */
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
  });
  const [editStatus, setEditStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setEditStatus("loading");
    setTimeout(() => {
      setEditStatus("success");
      setTimeout(() => {
        setIsEditing(false);
        setEditStatus("idle");
      }, 1200);
    }, 1000);
  };

  /* ── Change Password state ── */
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwStatus, setPwStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [pwMsg, setPwMsg] = useState("");

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) {
      setPwStatus("error");
      setPwMsg("New passwords do not match.");
      return;
    }
    if (pwForm.newPw.length < 6) {
      setPwStatus("error");
      setPwMsg("Password must be at least 6 characters.");
      return;
    }
    setPwStatus("loading");
    setTimeout(() => {
      setPwStatus("success");
      setPwMsg("Password changed successfully!");
      setPwForm({ current: "", newPw: "", confirm: "" });
    }, 1200);
  };

  /* ── Forgot Password state ── */
  const [fpStatus, setFpStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [fpMsg, setFpMsg] = useState("");

  const handleForgotPassword = async () => {
    if (!user?.email) return;
    setFpStatus("loading");
    setFpMsg("");
    try {
      const response = await fetch("https://lifemade.onrender.com/api/auth/password-reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to send reset email.");
      }
      setFpStatus("sent");
      setFpMsg(`Reset link sent to ${user.email}`);
    } catch (err) {
      setFpStatus("error");
      setFpMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "??";

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "My Profile", icon: <User size={15} /> },
    { key: "security", label: "Security", icon: <Lock size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 md:px-8">

        {/* ══ PROFILE HERO BANNER ══ */}
        <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-3xl p-8 mb-8 shadow-xl overflow-hidden">
          {/* decorative blobs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {initials}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition">
                <Camera size={14} />
              </button>
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold text-white">{user?.email ?? "User"}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-1.5">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${user?.role === "admin" ? "bg-blue-500/20 text-blue-300 border-blue-400/30" : "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"}`}>
                  {user?.role === "admin" ? "Administrator" : "Customer"}
                </span>
                <span className="text-slate-400 text-xs">UID: {user?.id}</span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl hover:bg-red-500/20 hover:border-red-400/40 transition text-sm"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        {/* ══ STATS ROW ══ */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: <Package size={20} className="text-emerald-500" />, label: "Total Orders", value: orderHistory?.length ?? 0, onClick: onOrdersClick, bg: "bg-emerald-50" },
            { icon: <Heart size={20} className="text-red-400" fill="currentColor" />, label: "Wishlist Items", value: favorites.length, onClick: onWishlistClick, bg: "bg-red-50" },
            { icon: <ShieldCheck size={20} className="text-blue-500" />, label: "Account Status", value: "Active", onClick: undefined, bg: "bg-blue-50" },
          ].map((s, i) => (
            <button
              key={i}
              onClick={s.onClick}
              disabled={!s.onClick}
              className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-left transition group ${s.onClick ? "hover:border-emerald-300 hover:shadow-md cursor-pointer" : "cursor-default"}`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 ${s.bg} rounded-xl`}>{s.icon}</div>
                {s.onClick && <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500 transition" />}
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-3">{s.value}</p>
              <p className="text-slate-500 text-sm">{s.label}</p>
            </button>
          ))}
        </div>

        {/* ══ TABS ══ */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl mb-6 w-fit">
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setIsEditing(false); }}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === key ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* ══ TAB: PROFILE ══ */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Account Details</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition"
                >
                  <Edit3 size={14} /> Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition"
                >
                  <X size={14} /> Cancel
                </button>
              )}
            </div>

            <div className="p-8">
              {/* View mode */}
              {!isEditing && (
                <div className="space-y-4">
                  <FieldRow icon={<Mail size={16} />} label="Email Address" value={user?.email ?? "—"} />
                  <FieldRow icon={<User size={16} />} label="User ID" value={`#${user?.id ?? "—"}`} />
                  <FieldRow icon={<ShieldCheck size={16} />} label="Role" value={user?.role === "admin" ? "Administrator" : "Customer"} />
                  <FieldRow icon={<CheckCircle size={16} />} label="Account Status" value="Active & Verified" highlight />
                </div>
              )}

              {/* Edit mode */}
              {isEditing && (
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  {/* Email (read-only) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Email (cannot be changed)</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm">
                      <Mail size={15} /> {user?.email}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                        placeholder="John"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                        placeholder="Doe"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="+1 555 000 0000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={editForm.company}
                      onChange={e => setEditForm({ ...editForm, company: e.target.value })}
                      placeholder="Your Company Name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm"
                    />
                  </div>

                  {editStatus === "success" && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">
                      <CheckCircle size={15} /> Profile saved successfully!
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={editStatus === "loading"}
                    className="flex items-center gap-2 bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-600 transition disabled:opacity-60"
                  >
                    {editStatus === "loading"
                      ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                      : <Save size={16} />}
                    {editStatus === "loading" ? "Saving…" : "Save Changes"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ══ TAB: SECURITY ══ */}
        {activeTab === "security" && (
          <div className="space-y-6">
            {/* Change Password */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Change Password</h2>
                <p className="text-slate-500 text-sm mt-0.5">Choose a strong password to keep your account secure.</p>
              </div>
              <div className="p-8">
                {pwStatus === "success" && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-5 text-sm">
                    <CheckCircle size={16} /> {pwMsg}
                  </div>
                )}
                {pwStatus === "error" && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm">
                    <AlertCircle size={16} /> {pwMsg}
                  </div>
                )}
                <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
                  <PwField id="current-pw" label="Current Password" value={pwForm.current} onChange={v => setPwForm({ ...pwForm, current: v })} />
                  <PwField id="new-pw" label="New Password" value={pwForm.newPw} onChange={v => setPwForm({ ...pwForm, newPw: v })} />
                  <PwField id="confirm-pw" label="Confirm New Password" value={pwForm.confirm} onChange={v => setPwForm({ ...pwForm, confirm: v })} />
                  <button
                    type="submit"
                    disabled={pwStatus === "loading"}
                    className="flex items-center gap-2 bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-600 transition disabled:opacity-60"
                  >
                    {pwStatus === "loading" ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" /> : <Lock size={16} />}
                    {pwStatus === "loading" ? "Saving…" : "Update Password"}
                  </button>
                </form>
              </div>
            </div>

            {/* Forgot Password via Email */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Forgot Your Password?</h2>
                <p className="text-slate-500 text-sm mt-0.5">We'll send a reset link to your registered email address.</p>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-5 max-w-md">
                  <div className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Sending to</p>
                    <p className="font-semibold text-slate-800 text-sm">{user?.email}</p>
                  </div>
                </div>

                {fpStatus === "sent" && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-4 text-sm max-w-md">
                    <CheckCircle size={16} /> {fpMsg}
                  </div>
                )}
                {fpStatus === "error" && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm max-w-md">
                    <AlertCircle size={16} /> {fpMsg}
                  </div>
                )}

                <button
                  onClick={handleForgotPassword}
                  disabled={fpStatus === "loading" || fpStatus === "sent"}
                  className="flex items-center gap-2 border border-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-800 hover:text-white hover:border-slate-800 transition disabled:opacity-50"
                >
                  {fpStatus === "loading"
                    ? <span className="animate-spin border-2 border-current border-t-transparent rounded-full w-4 h-4" />
                    : <KeyRound size={16} />}
                  {fpStatus === "sent" ? "Email Sent!" : fpStatus === "loading" ? "Sending…" : "Send Reset Link"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldRow({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
      <div className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
        <p className={`font-semibold mt-0.5 ${highlight ? "text-emerald-600" : "text-slate-800"}`}>{value}</p>
      </div>
    </div>
  );
}

function PwField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          required
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm"
          placeholder="••••••••"
        />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium">
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
