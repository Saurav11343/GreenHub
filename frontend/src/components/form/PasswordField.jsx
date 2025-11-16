import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function PasswordField({
  label = "Password",
  register,
  registerName,
  placeholder = "Enter your password",
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4 w-full">
      <div className="relative">
        {/* Floating Label Container */}
        <label className="floating-label w-full">
          <span>{label}</span>

          {/* Password Input */}
          <input
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            className="input input-md w-full pr-12"
            {...register(registerName)}
          />
        </label>

        {/* Toggle Eye Icon */}
        <button
          type="button"
          className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-500"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

export default PasswordField;
