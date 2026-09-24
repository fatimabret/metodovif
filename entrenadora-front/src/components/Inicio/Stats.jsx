
export default function Stats({ exp, alumnas, disciplinas }) {
  return (
    <div className="stats-container">
      
      <div className="stat-card">
        <span className="stat-number">{exp}</span>
        <span className="stat-label">años de exp.</span>
      </div>

      <div className="stat-card">
        <span className="stat-number">{alumnas}</span>
        <span className="stat-label">alumnas</span>
      </div>

      <div className="stat-card">
        <span className="stat-number">{disciplinas}</span>
        <span className="stat-label">disciplinas</span>
      </div>

    </div>
  );
}