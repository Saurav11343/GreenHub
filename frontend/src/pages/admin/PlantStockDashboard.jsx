import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usePlantStockStore } from "../../store/usePlantStockStore";
import DashboardStatCard from "../../components/page/admin/DashboardStatCard";
import PageLoader from "../../components/loader/PageLoader";

function PlantStockDashboard() {
  const {
    stockSummary,
    plantStocks,
    loading,
    error,
    getStockSummary,
    getLowStockPlants,
    updatePlantStock,
  } = usePlantStockStore();

  const [stockInputs, setStockInputs] = useState({});

  useEffect(() => {
    getStockSummary();
    getLowStockPlants(5);
  }, [getStockSummary, getLowStockPlants]);

  const handleChange = (id, value) => {
    setStockInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async (id) => {
    const qty = Number(stockInputs[id]);
    if (qty < 0 || isNaN(qty)) return;

    const res = await updatePlantStock(id, qty);

    if (res?.success) {
      toast.success("Stock updated successfully");
      setStockInputs((prev) => ({ ...prev, [id]: "" }));
      getLowStockPlants(5);
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!stockSummary) return null;

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-hidden pb-0">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-3">
          <h1 className="text-2xl md:text-3xl font-bold">
            Plant Stock Dashboard
          </h1>
          <span className="badge badge-neutral text-sm md:badge-lg">
            {stockSummary.totalPlants} Plants
          </span>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <DashboardStatCard
          title="Total Plants"
          value={stockSummary.totalPlants}
        />
        <DashboardStatCard
          title="In Stock"
          value={stockSummary.inStock}
          color="success"
        />
        <DashboardStatCard
          title="Low Stock"
          value={stockSummary.lowStock}
          color="warning"
        />
        <DashboardStatCard
          title="Out of Stock"
          value={stockSummary.outOfStock}
          color="error"
        />
      </div>

      {/* MOBILE CARD VIEW  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {plantStocks.map((plant) => {
          const isOut = plant.stockQty === 0;

          return (
            <div
              key={plant._id}
              className={`bg-base-100 border rounded-xl shadow-sm hover:shadow-md transition ${
                isOut ? "border-error" : ""
              }`}
            >
              <div className="p-4 space-y-4">
                {/* IMAGE + INFO */}
                <div className="flex items-center gap-4">
                  <img
                    src={plant.imageUrl}
                    alt={plant.name}
                    className="w-16 h-16 rounded-lg object-cover border"
                  />
                  <div>
                    <h3 className="font-semibold">{plant.name}</h3>
                    <span className="text-xs text-gray-500">
                      {plant.categoryId?.name}
                    </span>
                  </div>
                </div>

                {/* STOCK BADGE */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Current Stock</span>
                  <span
                    className={`badge badge-lg ${
                      isOut ? "badge-error" : "badge-warning"
                    }`}
                  >
                    {isOut ? "Out of Stock" : `${plant.stockQty} left`}
                  </span>
                </div>

                {/* INPUT + ACTION */}
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    className="input input-bordered input-sm flex-1"
                    placeholder={isOut ? "Add Qty" : "Add More"}
                    value={stockInputs[plant._id] ?? ""}
                    onChange={(e) => handleChange(plant._id, e.target.value)}
                  />
                  <button
                    className={`btn btn-sm ${
                      isOut ? "btn-error" : "btn-primary"
                    }`}
                    onClick={() => handleUpdate(plant._id)}
                    disabled={stockInputs[plant._id] === undefined}
                  >
                    {isOut ? "Restock" : "Update"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="border-2 rounded-lg bg-base-100 overflow-hidden hidden md:block">
        <h2 className="text-lg font-semibold p-4 border-b">Low Stock Plants</h2>

        {plantStocks.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">No low stock plants 🎉</p>
        ) : (
          <div className="overflow-x-auto max-h-[55vh]">
            <table className="table table-zebra w-full">
              <thead className="sticky top-0 bg-base-200 z-10">
                <tr>
                  <th>Plant</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Update Stock</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {plantStocks.map((plant) => {
                  const isOut = plant.stockQty === 0;

                  return (
                    <tr key={plant._id}>
                      <td className="flex items-center gap-3">
                        <img
                          src={plant.imageUrl}
                          alt={plant.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="font-medium">{plant.name}</span>
                      </td>

                      <td>{plant.categoryId?.name}</td>

                      <td>
                        <span
                          className={`badge ${
                            isOut ? "badge-error" : "badge-warning"
                          }`}
                        >
                          {isOut ? "Out of Stock" : plant.stockQty}
                        </span>
                      </td>

                      <td>
                        <input
                          type="number"
                          min={1}
                          className="input input-bordered input-sm w-24"
                          placeholder="Add"
                          value={stockInputs[plant._id] ?? ""}
                          onChange={(e) =>
                            handleChange(plant._id, e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <button
                          className={`btn btn-sm ${
                            isOut ? "btn-error" : "btn-primary"
                          }`}
                          onClick={() => handleUpdate(plant._id)}
                          disabled={stockInputs[plant._id] === undefined}
                        >
                          {isOut ? "Restock" : "Update"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlantStockDashboard;
