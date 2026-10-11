"use client";
import Image from "next/image";
import { Header, Footer, useProducts, Cards } from "@/components/site";
export default function Home() {
  const { items, loading } = useProducts();
  const ups = items
      .filter((p) => p.change.dir === "up")
      .sort((a, b) => b.change.pct - a.change.pct)
      .slice(0, 6),
    downs = items
      .filter((p) => p.change.dir === "down")
      .sort((a, b) => a.change.pct - b.change.pct)
      .slice(0, 6);
  return (
    <>
      <Header />
      <main>
        <section className="overflow-hidden bg-[#e8f5e9]">
          <div className="container grid min-h-[390px] items-center gap-8 py-12 md:grid-cols-2">
            <div>
              <p className="mb-3 font-bold text-[#287c4d]">
                প্রতিদিনের বাজারদর, এক জায়গায়
              </p>
              <h1 className="max-w-xl text-4xl font-bold leading-tight text-[#153f29] sm:text-5xl">
                বাজারের{" "}
                <span className="text-[#25834d]">সঠিক দাম</span> জানুন সহজেই
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
                বিভিন্ন বাজারের পণ্যমূল্য দেখে তুলনা করুন দাম এবং বেছে নিন আপনার সেরা কেনাকাটার সিদ্ধান্ত।
              </p>
              <a
                href="#সব-পণ্য"
                className="mt-7 inline-block rounded-xl bg-[#17643c] px-6 py-3 font-bold text-white shadow-lg shadow-emerald-900/15"
              >
                আজকের বাজারদর দেখুন →
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-4 rounded-[2rem] bg-[#bde2c8]" />
              <Image
                src="/bazar-hero.png"
                alt="বাজারের পণ্য"
                width={315}
                height={263}
                priority
                className="relative mx-auto h-auto w-full max-w-md"
              />
            </div>
          </div>
        </section>
        <section className="container py-14">
          <Title title="আজ দাম বেড়েছে ▲" sub="যেসব পণ্যের দাম আজ বেড়েছে" />
          <Cards items={ups} loading={loading} />
        </section>
        <section className="container py-4">
          <Title title="আজ দাম কমেছে ▼" sub="যেসব পণ্যের দাম আজ কমেছে" />
          <Cards items={downs} loading={loading} />
        </section>
        <section id="সব-পণ্য" className="container scroll-mt-5 py-14">
          <Title title="সব পণ্য" sub="প্রতিদিনের হালনাগাদ বাজার মূল্য" />
          <Cards items={items} loading={loading} />
        </section>
      </main>
      <Footer />
    </>
  );
}
function Title({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-[#183c2a]">{title}</h2>
      <p className="text-slate-500">{sub}</p>
    </div>
  );
}
