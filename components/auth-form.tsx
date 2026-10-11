"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";
export function AuthForm({ signup = false }: { signup?: boolean }) {
  const r = useRouter(),
    [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget),
      email = String(f.get("email")),
      password = String(f.get("password")),
      name = String(f.get("name") || "");
    if (password.length < 8)
      return toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    setBusy(true);
    const result = signup
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password });
    setBusy(false);
    if (result.error)
      return toast.error(result.error.message || "অনুরোধটি সম্পন্ন হয়নি");
    toast.success(
      signup ? "অ্যাকাউন্ট তৈরি হয়েছে" : "সফলভাবে সাইন ইন করা হয়েছে",
    );
    r.push(signup ? "/signin" : "/");
    r.refresh();
  };
  const continueWithGoogle = async () => {
    setBusy(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      if (!result.error) return;
      setBusy(false);
      toast.error(result.error.message || "Google সাইন ইন করা যায়নি");
    } catch {
      setBusy(false);
      toast.error("Google সাইন ইন করা যায়নি");
    }
  };
  return (
    <main className="grid min-h-screen place-items-center bg-[#e8f5e9] p-4">
      <section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl shadow-emerald-950/10">
        <Link href="/" className="text-lg font-bold text-[#17643c]">
          🛒 বাজার দর
        </Link>
        <h1 className="mt-6 text-3xl font-bold">
          {signup ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "আবার স্বাগতম!"}
        </h1>
        <p className="mb-6 text-slate-500">
          {signup
            ? "সঠিক বাজারদর পেতে আজই যুক্ত হোন।"
            : "আপনার অ্যাকাউন্টে সাইন ইন করুন।"}
        </p>
        <form onSubmit={submit} className="space-y-4">
          {signup && <Field label="নাম" name="name" placeholder="আপনার নাম" />}
          <Field
            label="ইমেইল"
            name="email"
            type="email"
            placeholder="name@email.com"
          />
          <Field
            label="পাসওয়ার্ড"
            name="password"
            type="password"
            placeholder="কমপক্ষে ৮ অক্ষর"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#17643c] py-3 font-bold text-white disabled:opacity-60"
          >
            {busy
              ? "অপেক্ষা করুন…"
              : signup
                ? "রেজিস্টার করুন"
                : "সাইন ইন করুন"}
          </button>
        </form>
        <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          <span>অথবা</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={continueWithGoogle}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-bold text-slate-700 disabled:opacity-60"
        >
          <GoogleIcon /> Google দিয়ে চালিয়ে যান
        </button>
        <p className="mt-6 text-center text-sm text-slate-600">
          {signup ? "ইতোমধ্যে অ্যাকাউন্ট আছে?" : "অ্যাকাউন্ট নেই?"}{" "}
          <Link
            className="font-bold text-[#17643c]"
            href={signup ? "/signin" : "/signup"}
          >
            {signup ? "সাইন ইন করুন" : "রেজিস্টার করুন"}
          </Link>
        </p>
      </section>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.72-.06-1.42-.18-2.09H12v3.96h5.23a4.47 4.47 0 0 1-1.94 2.93v2.45h3.14c1.84-1.7 2.92-4.2 2.92-7.25Z"
      />
      <path
        fill="#34A853"
        d="M12 21.67c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0 0 12 21.67Z"
      />
      <path
        fill="#FBBC05"
        d="M6.53 13.76a5.86 5.86 0 0 1 0-3.52V7.71H3.28a9.75 9.75 0 0 0 0 8.58l3.25-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.21c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.84 3.28 14.63 2.33 12 2.33a9.74 9.74 0 0 0-8.72 5.38l3.25 2.53c.77-2.31 2.93-4.03 5.47-4.03Z"
      />
    </svg>
  );
}

function Field({
  label,
  ...props
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        required
        {...props}
        className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#17643c]"
      />
    </label>
  );
}
