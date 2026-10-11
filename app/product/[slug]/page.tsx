"use client";
import { Footer, Header, useProducts } from "@/components/site";
import { bn, marketAverage, unit } from "@/lib/products";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth";
import { useEffect } from "react";
import toast from "react-hot-toast";
export default function Product() {
  const { slug } = useParams<{ slug: string }>(),
    { items, loading } = useProducts(),
    { user } = useAuth(),
    r = useRouter();
  useEffect(() => {
    if (!user) {
      toast.error("বিস্তারিত দেখতে আগে সাইন ইন করুন");
      r.replace("/signin?next=/product/" + slug);
    }
  }, [user, r, slug]);
  const p = items.find((x) => x.slug === slug);
  if (!user) return null;
  if (loading)
    return (
      <>
        <Header />
        <div className="container py-20">
          <div className="skeleton h-96 rounded-2xl" />
        </div>
      </>
    );
  if (!p)
    return (
      <>
        <Header />
        <main className="container py-24 text-center">
          <h1 className="text-3xl font-bold">পণ্যটি খুঁজে পাওয়া যায়নি</h1>
          <Link
            href="/"
            className="mt-5 inline-block rounded-lg bg-[#17643c] px-5 py-3 text-white"
          >
            হোম পেজে ফিরে যান
          </Link>
        </main>
      </>
    );
  const min = Math.min(...p.markets.map((x) => x.min)),
    max = Math.max(...p.markets.map((x) => x.max)),
    priceDifference = p.today - p.yesterday,
    priceDirection =
      priceDifference > 0 ? "বেড়েছে" : priceDifference < 0 ? "কমেছে" : "অপরিবর্তিত";
  return (
    <>
      <Header />
      <main className="container py-10">
        <section className="rounded-3xl bg-[#e8f5e9] p-6 md:p-9">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <span className="grid h-20 w-20 place-items-center rounded-3xl bg-white text-5xl">
                {p.image}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#257647]">
                  {p.categoryIcon} {p.categoryNameBn}
                </p>
                <h1 className="text-3xl font-bold">{p.nameBn}</h1>
                <p className="text-slate-600">
                  গতকালের তুলনায় আজ দাম {priceDirection} {bn(Math.abs(priceDifference))} টাকা
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`w-fit rounded-full bg-white px-4 py-2 font-bold ${p.change.dir === "up" ? "text-emerald-600" : p.change.dir === "down" ? "text-rose-500" : "text-slate-600"}`}
              >
                {p.change.dir === "up" ? "▲" : p.change.dir === "down" ? "▼" : "—"}{" "}
                আজকের দাম - {bn(p.today)} টাকা
              </span>
              <span className="w-fit rounded-full bg-white px-4 py-2 font-semibold text-slate-600">
                {unit(p.unit)}
              </span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <Stat label="সর্বনিম্ন দাম" value={min} />
            <Stat label="গড় দাম" value={p.today} />
            <Stat label="সর্বোচ্চ দাম" value={max} />
          </div>
        </section>
        <section className="mt-10">
          <h2 className="text-2xl font-bold">বাজারভিত্তিক আজকের দাম</h2>
          <p className="mb-5 text-slate-500">
            বিভিন্ন বাজারে পণ্যটির সর্বনিম্ন ও সর্বোচ্চ মূল্য
          </p>
          <div className="overflow-x-auto border border-slate-300 bg-white">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead className="bg-slate-50 text-sm text-slate-500">
                <tr>
                  <th className="border-b border-slate-300 p-4">বাজার</th>
                  <th className="border-b border-slate-300 p-4">বিভাগ</th>
                  <th className="border-b border-slate-300 p-4 text-right">সর্বনিম্ন</th>
                  <th className="border-b border-slate-300 p-4 text-right">সর্বাধিক</th>
                  <th className="border-b border-slate-300 p-4 text-right">গড়</th>
                </tr>
              </thead>
              <tbody>
                {p.markets.map((m, i) => (
                  <tr key={i}>
                    <td className="border-b border-black p-4 font-semibold text-black">{m.market}</td>
                    <td className="border-b border-l border-black p-4 text-black">{m.division}</td>
                    <td className="border-b border-l border-black p-4 text-right text-black">{bn(m.min)} টাকা</td>
                    <td className="border-b border-l border-black p-4 text-right text-black">{bn(m.max)} টাকা</td>
                    <td className="border-b border-l border-black p-4 text-right font-bold text-black">
                      {bn(marketAverage(m.min, m.max))} টাকা
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <b className="text-lg text-[#17643c]">{bn(value)} টাকা</b>
    </div>
  );
}
