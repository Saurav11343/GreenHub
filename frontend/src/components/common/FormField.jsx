import React from "react";
import { Search } from "lucide-react";

function FormField({
  label,
  type = "text",
  as = "input", // "input" | "textarea" | "search"
  register,
  registerName,
  placeholder = "",
  error,
  rows = 4,
  icon,
  ...props
}) {
  const FieldTag = as === "textarea" ? "textarea" : "input";
  const isSearch = as === "search";

  return (
    <div className="form-control w-full mb-3">
      {/* Label */}
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}

      {/* SEARCH FIELD */}
      {isSearch && (
        <label className="input bg-base-100 flex items-center gap-2">
          {icon && <Search className="h-5 w-5 opacity-50" />}
          <input
            type="search"
            placeholder={placeholder}
            className="grow bg-transparent outline-none"
            {...register(registerName)}
            {...props}
          />
        </label>
      )}

      {/* NORMAL INPUT / TEXTAREA */}
      {!isSearch && (
        <FieldTag
          type={as === "textarea" ? undefined : type}
          rows={as === "textarea" ? rows : undefined}
          placeholder={placeholder}
          {...register(registerName)}
          {...props}
          className={`${
            as === "textarea"
              ? "textarea textarea-bordered"
              : "input input-bordered"
          } w-full ${error ? "input-error textarea-error" : ""}`}
        />
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

export default FormField;
