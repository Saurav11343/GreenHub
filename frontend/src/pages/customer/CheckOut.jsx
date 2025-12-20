import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrderSchema } from "../../../../shared/validations/order.validation";
import FormField from "../../components/common/FormField";
import PageLoader from "../../components/loader/PageLoader";
import toast from "react-hot-toast";
import { useOrderStore } from "../../store/useOrderStore";
import Payment from "./Payment";

function CheckOut() {
  const navigate = useNavigate();

  /* -----------------------------
     AUTH
  ------------------------------ */
  const { userId } = useAuthStore();

  /* -----------------------------
     CART STORE
  ------------------------------ */
  const {
    cartItems = [],
    getUserCartItem,
    updateCartItem: updateCartItemQuantity,
    clearCartItem,
    deleteCartItem,
  } = useCartStore();

  const { loading, createOrder } = useOrderStore();

  /* -----------------------------
     FORM
  ------------------------------ */
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(createOrderSchema),
    mode: "onChange",
    defaultValues: {
      userId,
      totalAmount: 0,
      shippingAddress: "",
    },
  });

  /* -----------------------------
     LOCAL STATE
  ------------------------------ */
  const [quantities, setQuantities] = useState({});
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  /* -----------------------------
     INITIAL FETCH
  ------------------------------ */
  useEffect(() => {
    const fetchCart = async () => {
      if (userId) {
        await getUserCartItem(userId);
        setInitialLoading(false);
      }
    };
    fetchCart();
  }, [userId, getUserCartItem]);

  /* -----------------------------
     SYNC QUANTITIES
  ------------------------------ */
  useEffect(() => {
    const map = {};
    cartItems.forEach((it) => {
      map[it._id] = it.quantity;
    });
    setQuantities(map);
  }, [cartItems]);

  /* -----------------------------
     HELPERS
  ------------------------------ */
  const getStockForItem = (item) => Number(item?.plantId?.stockQty ?? 0);

  const lineTotal = (item) =>
    (item?.plantId?.price ?? 0) * (quantities[item._id] ?? item.quantity);

  const subtotal = cartItems.reduce((sum, item) => sum + lineTotal(item), 0);

  useEffect(() => {
    setValue("userId", userId);
    setValue("totalAmount", subtotal);
  }, [subtotal, userId, setValue]);

  /* -----------------------------
     STOCK-SAFE QUANTITY UPDATE
  ------------------------------ */
  const updateQtyByDelta = async (itemId, delta) => {
    const item = cartItems.find((i) => i._id === itemId);
    if (!item) return;

    const stockQty = getStockForItem(item);
    const currentQty = quantities[itemId];
    const newQty = currentQty + delta;

    if (newQty < 1) return;

    if (newQty > stockQty) {
      toast.error(`Only ${stockQty} item(s) available in stock`);
      return;
    }

    try {
      setUpdatingItemId(itemId);
      setQuantities((prev) => ({ ...prev, [itemId]: newQty }));

      await updateCartItemQuantity(itemId, {
        quantity: newQty,
        userId,
      });
    } catch {
      toast.error("Failed to update quantity");
      setQuantities((prev) => ({ ...prev, [itemId]: currentQty }));
    } finally {
      setUpdatingItemId(null);
    }
  };

  /* -----------------------------
     CART ACTIONS
  ------------------------------ */
  const handleRemove = async (id) => {
    const res = await deleteCartItem(userId, id);
    res.success
      ? toast.success(res.message || "Item removed")
      : toast.error(res.message || "Failed to remove item");
  };

  const handleClear = async () => {
    const res = await clearCartItem(userId);
    res.success
      ? toast.success(res.message || "Cart cleared")
      : toast.error(res.message || "Failed to clear cart");
  };

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  /* -----------------------------
     STOCK VALIDATION BEFORE PAY
  ------------------------------ */
  const hasStockIssue = cartItems.some(
    (item) => quantities[item._id] > getStockForItem(item)
  );

  /* -----------------------------
     SUBMIT ORDER
  ------------------------------ */
  const onSubmit = async (data) => {
    if (hasStockIssue) {
      toast.error("Some items exceed available stock");
      return;
    }

    try {
      const res = await createOrder(data);

      if (res.success) {
        toast.success("Order created successfully");
        setCreatedOrderId(res.data.orderId);
        setShowPaymentModal(true);
      } else {
        toast.error(res.message || "Failed to create order");
      }
    } catch {
      toast.error("Something went wrong while creating order");
    }
  };

  const handlePaymentClose = async () => {
    setShowPaymentModal(false);
    setCreatedOrderId(null);

    // ✅ Refetch cart
    if (userId) {
      await getUserCartItem(userId);
    }

    // ✅ RESET FORM FIELDS
    reset({
      userId,
      totalAmount: 0,
      shippingAddress: "",
    });

    // ✅ RESET LOCAL QUANTITIES
    setQuantities({});
  };

  if (initialLoading) return <PageLoader />;

  function ButtonLoader() {
    return <span className="loading loading-spinner loading-xs" />;
  }

  /* =============================
     RENDER
  ============================== */
  return (
    <div className="container mx-auto px-4 py-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold">Checkout</h1>

        <div className="flex items-center gap-2">
          {cartItems.length > 0 && (
            <button className="btn btn-warning btn-sm" onClick={handleClear}>
              Clear Cart
            </button>
          )}
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate(-1)}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* LEFT */}
        <div className="md:col-span-3">
          {cartItems.length === 0 ? (
            <div className="bg-base-100 shadow p-6 rounded text-center opacity-70">
              Your cart is empty
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cartItems.map((it) => (
                <div
                  key={it._id}
                  className="bg-base-100 shadow rounded overflow-hidden flex flex-col"
                >
                  <div className="relative w-full h-48">
                    <img
                      src={it?.plantId?.imageUrl || "/plant.webp"}
                      alt={it.plantId?.name}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="p-3 flex-1 flex flex-col">
                    <div className="mt-auto flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="btn btn-sm"
                          onClick={() => updateQtyByDelta(it._id, -1)}
                          disabled={updatingItemId === it._id}
                        >
                          {updatingItemId === it._id ? <ButtonLoader /> : "-"}
                        </button>

                        <input
                          readOnly
                          value={quantities[it._id]}
                          className="input input-sm w-20 text-center"
                        />

                        <button
                          className="btn btn-sm"
                          onClick={() => updateQtyByDelta(it._id, +1)}
                          disabled={updatingItemId === it._id}
                        >
                          {updatingItemId === it._id ? <ButtonLoader /> : "+"}
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="font-semibold">
                          {formatINR(lineTotal(it))}
                        </div>

                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => handleRemove(it._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {quantities[it._id] >= getStockForItem(it) && (
                      <p className="text-xs text-red-500 mt-1">
                        Max stock reached ({getStockForItem(it)})
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-base-100 shadow p-4 rounded md:sticky md:top-24"
          >
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>

            <div className="flex justify-between mt-3 border-t pt-3 font-semibold">
              <span>Total</span>
              <span>{formatINR(subtotal)}</span>
            </div>

            <FormField
              label="Shipping Address"
              as="textarea"
              rows={3}
              register={register}
              registerName="shippingAddress"
              placeholder="Enter full shipping address"
              error={errors.shippingAddress}
            />

            {hasStockIssue && (
              <p className="text-sm text-red-500 mt-2">
                Please adjust quantities to match available stock.
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-block mt-4"
              disabled={
                cartItems.length === 0 || updatingItemId || hasStockIssue
              }
            >
              Proceed to Pay
            </button>
          </form>
        </div>

        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-base-100 rounded shadow-lg w-full max-w-md relative">
              <Payment orderId={createdOrderId} onClose={handlePaymentClose} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckOut;
