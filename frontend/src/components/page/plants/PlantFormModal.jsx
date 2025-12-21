import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormField from "../../common/FormField.jsx";
import { createPlantSchema } from "../../../../../shared/validations/plant.validation.js";
import { useUploadStore } from "../../../store/useUploadStore.js";
import { useImageCompression } from "../../../utils/useImageCompression.js";
import ButtonLoader from "../../common/ButtonLoader.jsx";
import ImageUpload from "../../common/UploadImage.jsx";

/**
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - onSubmit: async (data) => void
 * - initialData: optional plant object for edit mode
 * - type: "add" | "edit"
 * - categories: optional array of { _id, name } or strings
 */
function PlantFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  type,
  categories = [],
}) {
  const { uploadImage } = useUploadStore();
  const { compressImage } = useImageCompression();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createPlantSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      categoryId: "", // <-- align with schema
      price: undefined,
      stockQty: undefined,
      description: "",
      imageUrl: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [saving, setSaving] = useState(false);

  // Normalize categories to { id, name } using a memo so it's stable
  const normalizedCategories = useMemo(
    () =>
      (categories || []).map((c) => {
        if (!c) return { id: "", name: "" };
        // category shape from API seems to be { _id, name }
        if (typeof c === "string") return { id: c, name: c };
        return {
          id: c._id ?? c.id ?? String(c.name ?? ""),
          name: c.name ?? String(c._id ?? c),
        };
      }),
    [categories]
  );

  // Resolve initial categoryId from initialData:
  // - if initialData.categoryId is an object with _id, use that
  // - if it's a string/ID, use it
  // - else if initialData has category (name), try to find matching id by name
  const resolveInitialCategoryId = (initial) => {
    if (!initial) return "";
    const cat = initial.categoryId;
    if (cat) {
      // object like { _id, name }
      if (typeof cat === "object") return cat._id ?? cat.id ?? "";
      // string id
      if (typeof cat === "string") return cat;
    }
    // fallback: initial.category may be name string — try find matching normalized category
    const name = initial.category ?? initial.categoryName ?? "";
    if (name) {
      const found = normalizedCategories.find(
        (nc) => String(nc.name).toLowerCase() === String(name).toLowerCase()
      );
      if (found) return found.id;
    }
    return "";
  };

  // Load initial data (edit mode)
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name ?? "",
        categoryId: resolveInitialCategoryId(initialData) ?? "",
        price:
          typeof initialData.price === "number"
            ? initialData.price
            : initialData.price
            ? Number(initialData.price)
            : undefined,
        stockQty:
          typeof initialData.stockQty === "number"
            ? initialData.stockQty
            : initialData.stockQty
            ? Number(initialData.stockQty)
            : undefined,
        description: initialData.description ?? "",
        imageUrl: initialData.imageUrl ?? "",
      });
      setPreviewImg(initialData.imageUrl ?? null);
    } else {
      reset();
      setPreviewImg(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialData,
    reset /* normalizedCategories not added to avoid frequent resets */,
  ]);

  if (!isOpen) return null;

  // Final submit: compress & upload image if selected, then call onSubmit
  const handleFinalSubmit = async (formData) => {
    setSaving(true);

    try {
      if (selectedFile) {
        const compressed = await compressImage(selectedFile);
        const url = await uploadImage(compressed, "plants");
        formData.imageUrl = url;
        setValue("imageUrl", url);
      }

      // Safety fallback: ensure numbers before sending to backend
      formData.price =
        typeof formData.price === "number"
          ? formData.price
          : formData.price === "" || formData.price == null
          ? 0
          : Number(formData.price);

      formData.stockQty =
        typeof formData.stockQty === "number"
          ? formData.stockQty
          : formData.stockQty === "" || formData.stockQty == null
          ? 0
          : Number(formData.stockQty);

      // IMPORTANT: Ensure we send categoryId (string id) to backend
      // If the form somehow has an object, convert it:
      if (
        typeof formData.categoryId === "object" &&
        formData.categoryId !== null
      ) {
        formData.categoryId =
          formData.categoryId._id ?? formData.categoryId.id ?? "";
      }

      console.log(formData);
      await onSubmit(formData);
    } catch (err) {
      console.error("Save plant failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <dialog open className="modal">
      <div className="modal-box w-11/12 max-w-lg max-h-[80vh] overflow-y-auto hide-scrollbar relative">
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-2 top-2"
        >
          ✕
        </button>
        <h3 className="font-bold text-lg">
          {type === "edit" ? "Edit Plant" : "Add New Plant"}
        </h3>

        <form
          className="py-4 space-y-3"
          onSubmit={handleSubmit(handleFinalSubmit)}
        >
          {/* Image uploader */}
          <ImageUpload
            initialImage={previewImg}
            onFileSelect={(file) => {
              setSelectedFile(file);
              setPreviewImg(URL.createObjectURL(file));
            }}
          />

          <FormField
            label="Plant Name"
            as="input"
            type="text"
            register={register}
            registerName="name"
            placeholder="Enter plant name"
            error={errors.name}
          />

          <FormField
            label="Category"
            as="select"
            register={register}
            registerName="categoryId"
            error={errors.categoryId}
          >
            <option value="">Select category</option>
            {normalizedCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Price (₹)"
              as="input"
              type="number"
              step="0.01"
              register={register}
              registerName="price"
              registerOptions={{ valueAsNumber: true }}
              placeholder="0.00"
              error={errors.price}
            />

            <FormField
              label="Stock Qty"
              as="input"
              type="number"
              register={register}
              registerName="stockQty"
              registerOptions={{ valueAsNumber: true }}
              placeholder="0"
              error={errors.stockQty}
            />
          </div>

          <FormField
            label="Description"
            as="textarea"
            rows={4}
            register={register}
            registerName="description"
            placeholder="Enter plant description"
            error={errors.description}
          />



          {/* Hidden imageUrl field rendered via FormField */}
          <FormField
            as="input"
            type="hidden"
            register={register}
            registerName="imageUrl"
          />

          {/* Buttons */}
          <div className="modal-action w-full flex justify-center">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
              <button
                type="button"
                className="btn btn-outline w-full"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>

              <ButtonLoader
                type="submit"
                loading={saving}
                color="btn-primary"
                size="w-full"
              >
                {type === "edit" ? "Update" : "Save"}
              </ButtonLoader>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default PlantFormModal;
