import React, { useState } from "react";
import { useForm } from "react-hook-form";
import FormField from "../../common/FormField";

function PaymentFilter({ onFilter }) {
  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      status: "",
      method: "",
      minAmount: "",
      maxAmount: "",
      dateRange: "",
    },
  });

  const cleanFilters = (data) =>
    Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) =>
          value !== "" &&
          value !== null &&
          value !== undefined &&
          !(typeof value === "number" && Number.isNaN(value))
      )
    );

  const onSubmit = (data) => {
    onFilter(cleanFilters(data));
    setIsOpen(false);
  };

  const resetFilters = () => {
    reset();
    onFilter();
    setIsOpen(false);
  };

  return (
    <>
      {/* MOBILE FILTER TOGGLE */}
      <div className="md:hidden mb-3">
        <button
          type="button"
          className="btn btn-outline btn-sm w-full"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? "Close Filters" : "Open Filters"}
        </button>
      </div>

      {/* FILTER FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`
          p-4 rounded
          grid grid-cols-1
          md:grid-cols-[repeat(5,minmax(0,1fr))_auto]
          gap-4 items-end
          ${isOpen ? "block" : "hidden"} md:grid
        `}
      >
        {/* Status */}
        <FormField
          as="select"
          label="Status"
          register={register}
          registerName="status"
        >
          <option value="">All</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
        </FormField>

        {/* Method */}
        <FormField
          as="select"
          label="Method"
          register={register}
          registerName="method"
        >
          <option value="">All</option>
          <option value="UPI">UPI</option>
          <option value="CARD">Card</option>
          <option value="NETBANKING">Net Banking</option>
          <option value="WALLET">Wallet</option>
          <option value="EMI">EMI</option>
          <option value="PAYLATER">Pay Later</option>
          <option value="ONLINE">Online (Unknown)</option>
        </FormField>

        {/* Min Amount */}
        <FormField
          label="Min Amount"
          type="number"
          placeholder="Min ₹"
          register={register}
          registerName="minAmount"
          registerOptions={{ valueAsNumber: true }}
        />

        {/* Max Amount */}
        <FormField
          label="Max Amount"
          type="number"
          placeholder="Max ₹"
          register={register}
          registerName="maxAmount"
          registerOptions={{ valueAsNumber: true }}
        />

        {/* Date Range */}
        <FormField
          as="select"
          label="Date Range"
          register={register}
          registerName="dateRange"
        >
          <option value="">All Dates</option>
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="month">Last Month</option>
        </FormField>

        {/* Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <button
            type="submit"
            className="btn btn-primary btn-sm flex-1 md:flex-none md:w-auto"
          >
            Apply
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm flex-1 md:flex-none md:w-auto"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </form>
    </>
  );
}

export default PaymentFilter;
