export default function TickTag() {
  const year = new Date().getFullYear();
  return (
    <span className="font-mono text-[11px] uppercase tracking-widest">
      {year} / G-10 Markaz / PK
    </span>
  );
}
