"use client";

export default function NumbersBlock() {
  const stats = [
    { value: "2025", label: "Year Founded" },
    { value: "08+", label: "Product Categories" },
    { value: "1.2k+", label: "Heritage Lovers" },
  ];

  return (
    <section className="bg-paper py-24 lg:py-32 border-t border-ink/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 md:grid-cols-3 text-center md:text-left">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-3 pt-6 md:pt-0 border-t border-ink/10 first:border-t-0 md:first:border-t-0 md:border-t-0">
              <p className="font-display text-7xl md:text-8xl font-bold tracking-tighter text-ink leading-none">
                {s.value}
              </p>
              <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-ink/50">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
