import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, KeyRound } from "lucide-react";

interface ForgotPasswordProps {
  onClose?: () => void;
  onBackToLogin?: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onClose, onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    if (!email.includes("@")) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch(
        "https://lifemade.onrender.com/auth/password-reset/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || data.email?.[0] || "Failed to send reset email.");
      }

      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition text-lg leading-none"
          aria-label="Close"
        >
          ×
        </button>

        {status === "sent" ? (
          /* ── Success State ── */
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Email Sent!</h2>
            <p className="text-slate-500 text-sm mb-1">
              We've sent a password reset link to:
            </p>
            <p className="font-semibold text-slate-800 mb-6">{email}</p>
            <p className="text-slate-400 text-xs mb-8">
              Didn't receive it? Check your spam folder. The link expires in 15 minutes.
            </p>
            <button
              onClick={onBackToLogin}
              className="flex items-center gap-2 mx-auto bg-slate-800 text-white px-6 py-3 rounded-xl hover:bg-emerald-600 transition font-semibold"
            >
              <ArrowLeft size={16} /> Back to Login
            </button>
          </div>
        ) : (
          /* ── Form State ── */
          <>
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                <KeyRound size={28} className="text-slate-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center text-slate-800 mb-1">Forgot Password?</h1>
            <p className="text-center text-slate-500 text-sm mb-6">
              Enter your registered email address and we'll send you a link to reset your password.
            </p>

            {status === "error" && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={16} className="text-slate-400" />
                  </div>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={status === "loading"}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white font-semibold py-3 rounded-xl hover:bg-emerald-600 transition disabled:opacity-60"
              >
                {status === "loading" ? (
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 inline-block" />
                ) : (
                  <Mail size={17} />
                )}
                {status === "loading" ? "Sending…" : "Send Reset Link"}
              </button>
            </form>

            <button
              type="button"
              onClick={onBackToLogin}
              className="mt-5 w-full flex items-center justify-center gap-2 text-slate-500 text-sm hover:text-slate-700 transition"
            >
              <ArrowLeft size={14} /> Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
