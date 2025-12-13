import React from "react";
import { useParams, useNavigate } from "react-router";
import { usePlantStore } from "../../store/usePlantStore";
import {
  ArrowLeft,
  ShoppingCart,
  Leaf,
  Tag,
  Info,
  Layers3,
} from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";

/* Inline button loader */
function ButtonLoader() {
  return <span className="loading loading-dots loading-sm" aria-hidden />;
}

/* Full page loader */
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <span className="loading loading-dots loading-xl" />
    </div>
  );
}

function formatCurrency(v) {
  if (v == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(v));
}

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // plant store
  const {
    plant,
    loading: plantLoading,
    error: plantError,
    getPlantById,
  } = usePlantStore();

  // cart store (use store loading/error)
  const {
    loading: cartLoading,
    error: cartError,
    createCartItem,
  } = useCartStore();

  const { userId } = useAuthStore();

  // local UI state (quantity only) and local buy-loading
  const [qtySelected, setQtySelected] = React.useState(1);
  const [buyLoading, setBuyLoading] = React.useState(false);

  // fetch plant
  React.useEffect(() => {
    if (id) getPlantById(id);
  }, [id, getPlantById]);

  // reset qty when plant changes
  React.useEffect(() => {
    setQtySelected(1);
  }, [plant?._id]);

  // show full-page loader while plant is loading
  if (plantLoading) return <PageLoader />;

  if (plantError)
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <p className="text-red-500">Error: {plantError}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded bg-gray-100"
        >
          <ArrowLeft size={14} /> Go back
        </button>
      </div>
    );

  if (!plant)
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <p className="text-gray-600">No plant found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded bg-gray-100"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>
    );

  const image = plant.imageUrl || "/plant.webp";
  const price = Number(plant.price) || 0;
  const stockQty = Number(plant.stockQty) || 0;
  const categoryName =
    plant.categoryId?.name || plant.category || "Uncategorized";

  // Add to cart: uses store createCartItem and store loading (cartLoading)
  const onAddToCart = async () => {
    const toastId = toast.loading("Adding to cart...");
    try {
      const res = await createCartItem({
        userId,
        plantId: plant._id,
        quantity: qtySelected,
      });

      toast.dismiss(toastId);

      if (res?.success) {
        toast.success(res.message || "Added to cart");
        setQtySelected(1); // reset quantity on success
      } else {
        toast.error(res?.message || "Failed to add to cart");
      }
    } catch (e) {
      toast.dismiss(toastId);
      toast.error(e?.message || "Failed to add to cart");
    }
  };

  // Buy now: uses local buyLoading (independent of store)
  const onBuyNow = async () => {
    setBuyLoading(true);
    const toastId = toast.loading("Processing purchase...");

    try {
      const res = await createCartItem({
        userId,
        plantId: plant._id,
        quantity: qtySelected,
      });

      toast.dismiss(toastId);

      if (res?.success) {
        toast.success(res.message || "Proceeding to checkout");

        const createdItem = res.data;

        navigate(`/customer/checkout/${userId}`, {
          state: { items: [createdItem] },
        });
      } else {
        toast.error(res?.message || "Failed to proceed to buy");
      }
    } catch (e) {
      toast.dismiss(toastId);
      toast.error(e?.message || "Failed to proceed to buy");
    } finally {
      setBuyLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm mb-4 text-gray-700 font-medium hover:text-black"
      >
        <ArrowLeft size={16} /> Back to listings
      </button>

      <div className="rounded-2xl shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-200">
        {/* Left Image Section */}
        <div className="flex items-center justify-center p-4">
          <img
            src={image}
            alt={plant.name}
            className="max-h-[420px] w-full object-contain rounded-lg"
          />
        </div>

        {/* Right Section */}
        <div className="p-6 flex flex-col">
          {/* Plant Name + Category */}
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
              <Leaf size={28} className="text-emerald-600" />
              {plant.name}
            </h1>

            <p className="mt-2 flex items-center gap-2 text-gray-600 text-sm">
              <Tag size={16} className="text-gray-500" />
              {categoryName}
            </p>

            {/* Price + Stock */}
            <div className="mt-4">
              <p className="text-2xl font-bold text-emerald-700">
                {formatCurrency(price)}
              </p>

              <p
                className={`mt-1 text-sm font-medium flex items-center gap-2 ${
                  stockQty > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                <Layers3 size={16} />{" "}
                {stockQty > 0 ? `${stockQty} in stock` : "Out of stock"}
              </p>
            </div>
          </div>

          {/* Description */}
          <section className="mt-6">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Info size={18} className="text-gray-700" /> Description
            </h2>
            <p className="mt-2 whitespace-pre-wrap">
              {plant.description || "No description provided."}
            </p>
          </section>

          {/* Care Instructions */}
          <section className="mt-5">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Leaf size={18} className="text-emerald-600" /> Care Instructions
            </h3>
            <pre className="mt-2 p-3 rounded whitespace-pre-wrap">
              {plant.careInstructions || "No care instructions provided."}
            </pre>
          </section>

          {/* Cart Section */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <ShoppingCart size={18} className="text-emerald-600" /> Cart
            </h3>

            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border rounded-md overflow-hidden">
                <button
                  onClick={() => setQtySelected((s) => Math.max(1, s - 1))}
                  disabled={qtySelected <= 1 || cartLoading}
                  className="px-3 py-2 text-lg disabled:opacity-40"
                >
                  −
                </button>

                <div className="px-4 py-2 text-lg font-medium">
                  {qtySelected}
                </div>

                <button
                  onClick={() =>
                    setQtySelected((s) => Math.min(stockQty, s + 1))
                  }
                  disabled={qtySelected >= stockQty || cartLoading}
                  className="px-3 py-2 text-lg disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* Total */}
              <div className="ml-auto text-right">
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(price * qtySelected)}
                </div>
              </div>
            </div>

            {/* Show store-level cartError inline (optional) */}
            {cartError && (
              <div className="mt-3 px-3 py-2 rounded text-sm bg-red-50 text-red-700">
                {cartError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={onAddToCart}
                disabled={stockQty <= 0 || cartLoading}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow transition ${
                  stockQty > 0
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart size={16} />{" "}
                {cartLoading ? <ButtonLoader /> : "Add to cart"}
              </button>

              <button
                onClick={onBuyNow}
                disabled={stockQty <= 0 || buyLoading}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium border transition ${
                  stockQty > 0
                    ? "border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    : "border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {buyLoading ? <ButtonLoader /> : "Buy now"}
              </button>
            </div>
          </div>

          <div className="flex-1" />
        </div>
      </div>
    </div>
  );
}
