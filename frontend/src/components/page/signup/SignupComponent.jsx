import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupValidationSchema } from "../../../../../shared/validations/user.validation.js";
import { useAuthStore } from "../../../store/useAuthStore.js";

import InputField from "../../common/InputField.jsx";
import FormField from "../../common/FormField.jsx";
import ButtonLoader from "../../common/ButtonLoader.jsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

function SignupComponent() {
  const signup = useAuthStore((state) => state.signup);
  const loading = useAuthStore((state) => state.loading);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupValidationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const result = await signup(data);
      toast[result.success ? "success" : "error"](result.message);

      if (result.success) {
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        {/* LEFT TEXT SECTION */}
        <div className="text-center lg:text-left max-w-md">
          <h1 className="text-5xl font-bold">Create Your Account</h1>
          <p className="py-6 text-base">
            Join GreenHub today and explore a wide range of healthy, beautiful
            plants delivered fresh to your home.
            <br />
            <button
              onClick={() => navigate("/")}
              className="link link-primary text-sm"
            >
              ← Back to Home
            </button>
          </p>
        </div>

        {/* RIGHT SIGNUP CARD */}
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              {/* HIDDEN ROLE */}
              <input type="hidden" value="Customer" {...register("roleName")} />

              {/* FIRST NAME */}
              <FormField
                label="First Name"
                register={register}
                registerName="firstName"
                placeholder="Enter first name"
                error={errors.firstName}
              />

              {/* LAST NAME */}
              <FormField
                label="Last Name"
                register={register}
                registerName="lastName"
                placeholder="Enter last name"
                error={errors.lastName}
              />

              {/* EMAIL */}
              <FormField
                type="email"
                label="Email"
                register={register}
                registerName="email"
                placeholder="mail@example.com"
                error={errors.email}
              />

              {/* PASSWORD */}
              <FormField
                type="password"
                label="Password"
                register={register}
                registerName="password"
                placeholder="Enter password"
                error={errors.password}
              />

              {/* CONFIRM PASSWORD */}
              <FormField
                type="password"
                label="Confirm Password"
                register={register}
                registerName="confirmPassword"
                placeholder="Re-enter password"
                error={errors.confirmPassword}
              />

              {/* ALREADY HAVE ACCOUNT */}
              <div className="text-center mb-3 text-sm">
                <span className="text-gray-600">
                  Already have an account?{" "}
                  <a
                    className="link link-primary font-medium cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </a>
                </span>
              </div>

              {/* SIGNUP BUTTON */}
              <ButtonLoader loading={loading} color="btn-primary" size="w-full">
                Signup
              </ButtonLoader>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupComponent;
