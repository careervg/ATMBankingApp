const cards = ["star", "pulse", "maestro", "mastercard", "plus", "visa"];

export function CardNetworkStrip({ activeType }) {
  return (
    <div className="card-strip" aria-label="Accepted card networks">
      {cards.map((card, index) => (
        <span
          className={`card-logo card-logo-${index} ${activeType === card ? "active" : ""}`}
          key={card}
        >
          {card}
        </span>
      ))}
    </div>
  );
}
