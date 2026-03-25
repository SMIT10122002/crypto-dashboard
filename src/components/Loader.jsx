const gridCards = Array.from({ length: 8 }, (_, index) => index);

function Loader({ variant = "grid" }) {
  if (variant === "detail") {
    return (
      <div className="space-y-6">
        <div className="glass-panel shimmer h-60" />
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="glass-panel shimmer h-[420px]" />
          <div className="space-y-6">
            <div className="glass-panel shimmer h-32" />
            <div className="glass-panel shimmer h-32" />
            <div className="glass-panel shimmer h-40" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {gridCards.map((card) => (
        <div key={card} className="glass-panel shimmer h-52" />
      ))}
    </div>
  );
}

export default Loader;
