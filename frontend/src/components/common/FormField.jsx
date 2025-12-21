import React from "react";
import { Search } from "lucide-react";

function FormField({
  label,
  type = "text",
  as = "input", // can be 'input', 'textarea', 'select', or 'search'
  register,
  registerName,
  registerOptions = {}, 
  placeholder = "",
  error,
  rows = 4,
  icon,
  children, 
  ...props 
}) {
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
            {...(register ? register(registerName, registerOptions) : {})}
            {...props}
          />
        </label>
      )}

      {/* SELECT */}
      {as === "select" && !isSearch && (
        <select
          {...(register ? register(registerName, registerOptions) : {})}
          {...props}
          className={`select select-bordered w-full ${
            error ? "select-error" : ""
          }`}
          defaultValue={props.defaultValue ?? ""}
        >
          {children}
        </select>
      )}

      {/* TEXTAREA */}
      {as === "textarea" && !isSearch && (
        <textarea
          {...(register ? register(registerName, registerOptions) : {})}
          {...props}
          rows={rows}
          placeholder={placeholder}
          readOnly={props.readOnly}
          className={`textarea textarea-bordered w-full ${
            error ? "textarea-error" : ""
          } ${
            props.readOnly ? "bg-base-100 cursor-not-allowed opacity-90" : ""
          }`}
        >
          {children}
        </textarea>
      )}

      {/* NORMAL INPUT */}
      {as !== "textarea" && as !== "select" && !isSearch && (
        <input
          {...(register ? register(registerName, registerOptions) : {})}
          {...props}
          type={type}
          placeholder={placeholder}
          readOnly={props.readOnly}
          className={`input input-bordered w-full ${
            error ? "input-error" : ""
          } ${
            props.readOnly ? "bg-base-100 cursor-not-allowed opacity-90" : ""
          }`}
        />
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

export default FormField;
