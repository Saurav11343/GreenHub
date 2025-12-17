import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

function OrderFilter({ filters, onChange, onReset }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      {/* MOBILE FILTER BUTTON */}
      <div className="flex md:hidden justify-center">
        <button
          className="btn btn-outline btn-sm flex items-center gap-2"
          onClick={() => setOpen((prev) => !prev)}
        >
          <SlidersHorizontal size={16} />
          {open ? "Close Filters" : "Open Filters"}
        </button>
      </div>

      {/* FILTER PANEL */}
      <div
        className={`
           p-4 rounded
          flex flex-col md:flex-row gap-4 md:items-end
          ${open ? "block" : "hidden"} md:flex
        `}
      >
        {/* Status */}
        <div className="form-control w-full md:w-48">
          <label className="label">
            <span className="label-text">Status</span>
          </label>
          <select
            className="select select-bordered"
            value={filters.status}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="form-control w-full md:w-48">
          <label className="label">
            <span className="label-text">Date Range</span>
          </label>
          <select
            className="select select-bordered"
            value={filters.dateRange}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, dateRange: e.target.value }))
            }
          >
            <option value="">All</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="month">Last Month</option>
          </select>
        </div>

        {/* Reset */}
        <button
          className="btn btn-outline btn-sm md:self-end"
          onClick={() => {
            onReset();
            setOpen(false); // close on mobile after reset
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default OrderFilter;
