import React from "react";

function TextField({
  label,
  type = "text",
  placeholder = "",
  register,
  registerName,
  error,
}) {
  return (
    <div className="mb-4 w-full">
      <label className="floating-label w-full">
        <span>{label}</span>
        <input
          type={type}
          placeholder={placeholder}
          className="input input-md w-full"
          {...(register && register(registerName))}
        />
      </label>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

export default TextField;
