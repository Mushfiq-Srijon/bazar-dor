export default function Loading() {
  return (
    <main className="container min-h-screen py-12">
      <div className="skeleton h-20 rounded-2xl" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="skeleton h-56 rounded-2xl" />
        ))}
      </div>
    </main>
  );
}
