export default function ServiceCard({ icon, title, items }) {
  return (
    <article className="card service">
      <div className="service__icon" aria-hidden>{icon}</div>
      <h3 className="service__title">{title}</h3>
      <ul className="service__list">
        {items.map((it) => <li key={it}>{it}</li>)}
      </ul>
    </article>
  );
}