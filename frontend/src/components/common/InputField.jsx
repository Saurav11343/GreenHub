import React from "react";

function InputField({
  label,
  type = "text",
  register,
  registerName,
  placeholder = "",
  error,
  ...props
}) {
  return (
    <div className="form-control w-full mb-3">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>

      <input
        type={type}
        placeholder={placeholder}
        {...register(registerName)}
        {...props}
        className={`input input-bordered w-full 
          ${error ? "input-error" : ""}`}
      />

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
}

export default InputField;
