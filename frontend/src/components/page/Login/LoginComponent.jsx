import React from "react";
import ButtonLoader from "../../common/ButtonLoader.jsx";
import InputField from "../../common/InputField.jsx";
import { useAuthStore } from "../../../store/useAuthStore.js";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidationSchema } from "../../../../../shared/validations/user.validation.js";
import FormField from "../../common/FormField.jsx";
import toast from "react-hot-toast";

function LoginComponent() {
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginValidationSchema),
    mode: "onChange",
  });
  const onSubmit = async (data) => {
    try {
      const result = await login(data);

      toast[result.success ? "success" : "error"](result.message);

      if (result.success) {
        const role = result.user.roleName;

        if (role === "Admin") navigate("/admin");
        else if (role === "Customer") navigate("/plants");
        else navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <div>
      {/* HERO SECTION */}
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left max-w-md">
            <h1 className="text-5xl font-bold">Welcome Back!</h1>
            <p className="py-6 text-base">
              Login to continue exploring and buying fresh, beautiful plants
              from GreenHub.
              <br />
              <button
                onClick={() => navigate("/")}
                className="link link-primary text-sm"
              >
                ← Back to Home
              </button>
            </p>
          </div>

          {/* RIGHT LOGIN CARD */}
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                {/* EMAIL */}
                <FormField
                  type="email"
                  label="Email"
                  register={register}
                  registerName="email"
                  error={errors.email}
                  placeholder="mail@example.com"
                />

                {/* PASSWORD */}
                <FormField
                  type="password"
                  label="Password"
                  register={register}
                  registerName="password"
                  placeholder="Enter your password"
                  error={errors.password}
                />

                {/* FORGOT PASSWORD */}
                <div className="mb-3">
                  <a className="link link-hover text-sm">Forgot password?</a>
                </div>

                {/* SIGNUP LINK MESSAGE */}
                <div className="text-center mb-3 text-sm">
                  <span className="text-gray-600">
                    Don’t have an account?{" "}
                    <a
                      className="link link-primary font-medium cursor-pointer"
                      onClick={() => navigate("/signup")}
                    >
                      Signup
                    </a>
                  </span>
                </div>

                {/* LOGIN BUTTON */}
                <ButtonLoader
                  loading={loading}
                  color="btn-primary"
                  size="w-full"
                >
                  Login
                </ButtonLoader>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
