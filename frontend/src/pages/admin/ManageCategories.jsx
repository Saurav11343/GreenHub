import { Pencil, Trash2, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

import CategoryFormModal from "../../components/page/categories/CategoryFormModal";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import CategorySearch from "../../components/page/categories/CategorySearch";
import CategoryTable from "../../components/page/categories/CategoryTable";
import { universalSearch } from "../../utils/universalSearch";

import { useCategoryStore } from "../../store/useCategoryStore.js";
import PageLoader from "../../components/loader/PageLoader";
import toast from "react-hot-toast";

function ManageCategories() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formType, setFormType] = useState("add"); // add | edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    categories,
    loading,
    getAllCategories,
    createCategory,
    deleteCategory,
    updateCategory,
  } = useCategoryStore();

  useEffect(() => {
    getAllCategories();
  }, []);

  const filteredData = universalSearch(categories, searchQuery, [
    "name",
    "description",
  ]);

  /* -----------------------------
        OPEN MODALS
  ------------------------------ */
  const openAddModal = () => {
    setFormType("add");
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const openEditModal = (category) => {
    setFormType("edit");
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  /* -----------------------------
        ACTION HANDLERS
  ------------------------------ */
  const handleFormSubmit = async (data) => {
    let res;

    if (formType === "edit") {
      res = await updateCategory(selectedCategory._id, data);
    } else {
      res = await createCategory(data);
    }

    if (res.success) {
      toast.success(res.message);
      setIsFormOpen(false);
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory?._id) return;

    const res = await deleteCategory(selectedCategory._id);

    if (res.success) {
      toast.success(res.message || "Category deleted");
      setIsDeleteOpen(false);
      setSelectedCategory(null);
    } else {
      toast.error(res.message || "Delete failed");
    }
  };

  if (loading) return <PageLoader />;
  return (
    <div className="p-4 md:p-6 space-y-6 overflow-hidden pb-0">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-3">
          <h1 className="text-2xl md:text-3xl font-bold">Manage Categories</h1>
          <span className="badge badge-neutral text-sm md:badge-lg">
            {categories.length} Total
          </span>
        </div>

        <button
          className="btn btn-primary flex items-center gap-2 w-full md:w-auto"
          onClick={openAddModal}
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {/* SEARCH */}
      <CategorySearch onSearch={setSearchQuery} />

      {/* TABLE */}
      <CategoryTable
        data={filteredData}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      {/* CATEGORY FORM MODAL */}
      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedCategory}
        type={formType}
      />

      {/* DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedCategory?.name}
      />
    </div>
  );
}

export default ManageCategories;
