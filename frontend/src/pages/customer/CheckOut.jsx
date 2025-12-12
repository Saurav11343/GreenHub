import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import PageLoader from "../../components/loader/PageLoader";
import toast from "react-hot-toast";

function CheckOut() {
  const navigate = useNavigate();

  // Get userId directly from auth store
  const { userId } = useAuthStore();

  // Cart store
  const {
    cartItems = [],
    getUserCartItem,
    updateCartItemQuantity,
    loading: cartLoading,
    clearCartItem,
    deleteCartItem,
  } = useCartStore();

  // Local quantity editing state
  const [quantities, setQuantities] = useState({});

  // timers for debounce per item
  const timersRef = useRef({});

  // Fetch cart on mount
  useEffect(() => {
    if (userId) {
      getUserCartItem(userId);
    }
    return () => {
      Object.values(timersRef.current).forEach((t) => clearTimeout(t));
      timersRef.current = {};
    };
  }, [userId, getUserCartItem]);

  // Sync editable quantities to cartItems
  useEffect(() => {
    const map = {};
    cartItems.forEach((it) => (map[it._id] = it.quantity));
    setQuantities(map);
  }, [cartItems]);

  const changeQtyLocal = (id, qty) => {
    if (qty < 1) return;
    setQuantities((prev) => ({ ...prev, [id]: qty }));

    // debounce save (600ms)
    if (timersRef.current[id]) clearTimeout(timersRef.current[id]);
    timersRef.current[id] = setTimeout(async () => {
      try {
        await updateCartItemQuantity(id, qty);
        await getUserCartItem(userId);
      } catch (err) {
        console.error("Failed to update qty", err);
      } finally {
        delete timersRef.current[id];
      }
    }, 600);
  };

  // Force immediate update (used on blur)
  const flushUpdate = async (id) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    const newQty = quantities[id];
    if (newQty < 1) return;
    try {
      await updateCartItemQuantity(id, newQty);
      await getUserCartItem(userId);
    } catch (err) {
      console.error("Failed to update qty", err);
    }
  };

  const handleRemove = async (id) => {
    const res = await deleteCartItem(userId, id);
    if (res.success) {
      toast.success(res.message || "Cart cleared successfully!");
    } else {
      toast.error(res.message || "Failed to clear cart");
    }
  };

  const handleClear = async () => {
    const res = await clearCartItem(userId);

    if (res.success) {
      toast.success(res.message || "Cart cleared successfully!");
    } else {
      toast.error(res.message || "Failed to clear cart");
    }
  };

  // Compute totals
  const lineTotal = (item) =>
    (item?.plantId?.price ?? 0) * (quantities[item._id] ?? item.quantity);

  const subtotal = cartItems.reduce((sum, item) => sum + lineTotal(item), 0);

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  if (cartLoading) return <PageLoader />;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold">Checkout</h1>

        <div className="flex items-center gap-2">
          {cartItems.length > 0 && (
            <button
              className="btn btn-warning btn-sm"
              onClick={handleClear}
              aria-label="Clear cart"
            >
              Clear Cart
            </button>
          )}

          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate(-1)}
            aria-label="Continue shopping"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Layout: left cards grid (3) and right summary (1) on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* LEFT — CARD GRID: spans 3 cols on md+ */}
        <div className="md:col-span-3">
          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="bg-base-100 shadow p-6 rounded text-center opacity-70">
                Your cart is empty
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cartItems.map((it) => {
                  const name = it.plantId?.name ?? "Plant";
                  const price = formatINR(it.plantId?.price ?? 0);
                  const desc =
                    it.plantId?.description &&
                    it.plantId.description.length > 120
                      ? it.plantId.description.slice(0, 117) + "..."
                      : it.plantId?.description ?? "";

                  return (
                    <div
                      key={it._id}
                      className="bg-base-100 shadow rounded overflow-hidden flex flex-col"
                    >
                      {/* IMAGE with overlays */}
                      <div className="relative w-full h-48">
                        <img
                          src={it?.plantId?.imageUrl || "/plant.webp"}
                          alt={name}
                          className="object-cover w-full h-full"
                        />

                        {/* gradient overlay to improve text contrast */}
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/70 to-transparent px-3 py-2 flex items-end justify-between">
                          <div className="text-white text-sm font-medium truncate pr-2">
                            {name}
                          </div>
                          <div className="text-white text-sm font-semibold pl-2">
                            {price}
                          </div>
                        </div>
                      </div>

                      {/* CARD BODY */}
                      <div className="p-3 flex-1 flex flex-col">
                        <div className="mt-auto flex items-center justify-between gap-3">
                          {/* quantity controls */}
                          <div className="flex items-center gap-2">
                            <button
                              className="btn btn-sm"
                              onClick={() =>
                                changeQtyLocal(
                                  it._id,
                                  (quantities[it._id] || it.quantity) - 1
                                )
                              }
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>

                            <input
                              type="number"
                              min="1"
                              value={quantities[it._id] ?? it.quantity}
                              onChange={(e) =>
                                changeQtyLocal(it._id, Number(e.target.value))
                              }
                              onBlur={() => flushUpdate(it._id)}
                              className="input input-sm w-20 text-center"
                            />

                            <button
                              className="btn btn-sm"
                              onClick={() =>
                                changeQtyLocal(
                                  it._id,
                                  (quantities[it._id] || it.quantity) + 1
                                )
                              }
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          {/* right side: line total and remove */}
                          <div className="flex items-center justify-end gap-3">
                            <div className="text-base font-semibold">
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
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — SUMMARY CARD */}
        <div>
          <div className="bg-base-100 shadow p-4 rounded md:sticky md:top-24">
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>

            <div className="flex justify-between mt-3 border-t pt-3 font-semibold">
              <span>Total</span>
              <span>{formatINR(subtotal)}</span>
            </div>

            <button
              className="btn btn-primary btn-block mt-4"
              disabled={cartItems.length === 0}
              onClick={() => navigate("/customer/checkout/success")}
            >
              Proceed to Pay
            </button>

            <button
              className="btn btn-outline btn-block mt-2"
              onClick={() => navigate(-1)}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
