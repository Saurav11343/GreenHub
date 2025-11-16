import React from 'react'

function EmailField({
    label = "Email",
    register,
    registerName,
    placeholder="mail@example.com",
    error,
}) {
  return (
    <div className="mb-4 w-full">
      <label className="floating-label w-full">
        {/* Floating label */}
        <span>{label}</span>

        {/* Email input */}
        <input
          type="email"
          placeholder={placeholder}
          className="input input-md w-full"
          {...(register && register(registerName))}
        />
      </label>

      {/* Zod validation error */}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  )
}

export default EmailField