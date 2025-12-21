import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import PlantSearch from "../../components/page/plants/PlantSearch";
import PlantCard from "../../components/page/plants/PlantCard";
import PlantFormModal from "../../components/page/plants/PlantFormModal";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import { universalSearch } from "../../utils/universalSearch";
import toast from "react-hot-toast";
import { usePlantStore } from "../../store/usePlantStore";
import { useCategoryStore } from "../../store/useCategoryStore";
import PageLoader from "../../components/loader/PageLoader";

function ManagePlants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [formType, setFormType] = useState("add");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    plants,
    loading: plantLoading,
    getAllPlants,
    createPlant,
    updatePlant,
    deletePlant,
  } = usePlantStore();

  const {
    categories,
    loading: categoryLoading,
    getAllCategories,
  } = useCategoryStore();

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    getAllPlants();
  }, []);

  const plantsForUI = plants.map((p) => ({
    ...p,
    category:
      p?.categoryId && typeof p.categoryId === "object"
        ? p.categoryId.name ?? ""
        : (Array.isArray(categories) &&
            categories.find((c) => (c._id ?? c.id) === p.categoryId)?.name) ||
          "",
  }));

  const filteredData = universalSearch(plantsForUI, searchQuery, [
    "name",
    "category",
    "description",
  ]);

  const openAddModal = () => {
    setFormType("add");
    setSelectedPlant(null);
    setIsFormOpen(true);
  };

  const openEditModal = (plant) => {
    setFormType("edit");
    setSelectedPlant(plant);
    setIsFormOpen(true);
  };

  const openDeleteModal = (plant) => {
    setSelectedPlant(plant);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data) => {
    let res;

    if (formType === "edit") {
      const id = selectedPlant?._id ?? selectedPlant?.id;
      res = await updatePlant(id, data);
    } else {
      res = await createPlant(data);
    }

    if (res?.success) {
      toast.success(res.message);
      setIsFormOpen(false);
      setSelectedPlant(null);
    } else {
      toast.error(res?.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    const id = selectedPlant?._id ?? selectedPlant?.id;
    const res = await deletePlant(id);

    if (res?.success) {
      toast.success(res.message);
      setIsDeleteOpen(false);
      setSelectedPlant(null);
    } else {
      toast.error(res?.message || "Delete failed");
    }
  };

  if (plantLoading || categoryLoading) return <PageLoader />;

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-hidden pb-0">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-3">
          <h1 className="text-2xl md:text-3xl font-bold">Manage Plants</h1>
          <span className="badge badge-neutral text-sm md:badge-lg">
            {plants.length} Total
          </span>
        </div>

        <button
          className="btn btn-primary flex items-center gap-2 w-full md:w-auto"
          onClick={openAddModal}
        >
          <Plus className="h-4 w-4" /> Add Plant
        </button>
      </div>

      {/* SEARCH */}
      <PlantSearch onSearch={setSearchQuery} />

      {/* GRID */}
      <div className="overflow-x-auto overflow-y-auto hide-scrollbar bg-base-100 rounded-xl shadow max-h-[590px] md:max-h-[470px] lg:max-h-[470px]">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((plant) => (
              <PlantCard
                key={plant._id ?? plant.id}
                plant={plant}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        </div>
      </div>

      {/* FORM MODAL */}
      <PlantFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={formType === "edit" ? selectedPlant : null}
        type={formType}
        categories={categories}
      />

      {/* DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedPlant?.name}
      />
    </div>
  );
}

export default ManagePlants;
