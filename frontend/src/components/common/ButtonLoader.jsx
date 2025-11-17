import React from "react";

import Spinner from "../loader/Spinner";
function ButtonLoader({
  children,
  loading = false,
  color = "btn-neutral",
  size = "w-full",
  type = "submit",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={`btn ${color} ${size} ${className}`}
      {...props}
    >
      {loading ? (
        <span>
          <Spinner />
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default ButtonLoader;
