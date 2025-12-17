import React from "react";
import { useNavigate } from "react-router";

function DashboardStatCard({
  title,
  value,
  desc,
  to,
  color = "primary", // primary | success | warning | error | info
}) {
  const navigate = useNavigate();

  return (
    <div
      className={`
        stats shadow bg-base-100 cursor-pointer
        hover:shadow-lg transition-all
      `}
      onClick={() => to && navigate(to)}
    >
      <div className="stat">
        <div className="stat-title">{title}</div>

        <div className={`stat-value text-${color}`}>{value}</div>

        {desc && <div className="stat-desc">{desc}</div>}
      </div>
    </div>
  );
}

export default DashboardStatCard;
