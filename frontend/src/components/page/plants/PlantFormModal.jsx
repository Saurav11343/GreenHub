import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormField from "../../common/FormField.jsx";
import { createPlantSchema } from "../../../../../shared/validations/plant.validation.js";
import { useUploadStore } from "../../../store/useUploadStore.js";
import { useImageCompression } from "../../../utils/useImageCompression.js";
import ButtonLoader from "../../common/ButtonLoader.jsx";
import ImageUpload from "../../common/UploadImage.jsx";

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
      categoryId: "",
      price: undefined,
      stockQty: undefined,
      description: "",
      imageUrl: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [saving, setSaving] = useState(false);

  const normalizedCategories = useMemo(
    () =>
      (categories || []).map((c) => {
        if (!c) return { id: "", name: "" };
        if (typeof c === "string") return { id: c, name: c };
        return {
          id: c._id ?? c.id ?? String(c.name ?? ""),
          name: c.name ?? String(c._id ?? c),
        };
      }),
    [categories]
  );

  const resolveInitialCategoryId = (initial) => {
    if (!initial) return "";
    const cat = initial.categoryId;
    if (cat) {
      if (typeof cat === "object") return cat._id ?? cat.id ?? "";
      if (typeof cat === "string") return cat;
    }
    const name = initial.category ?? initial.categoryName ?? "";
    if (name) {
      const found = normalizedCategories.find(
        (nc) => String(nc.name).toLowerCase() === String(name).toLowerCase()
      );
      if (found) return found.id;
    }
    return "";
  };

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
  }, [initialData, reset]);

  if (!isOpen) return null;

  const handleFinalSubmit = async (formData) => {
    setSaving(true);

    try {
      if (selectedFile) {
        const compressed = await compressImage(selectedFile);
        const url = await uploadImage(compressed, "plants");
        formData.imageUrl = url;
        setValue("imageUrl", url);
      }

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

      if (
        typeof formData.categoryId === "object" &&
        formData.categoryId !== null
      ) {
        formData.categoryId =
          formData.categoryId._id ?? formData.categoryId.id ?? "";
      }

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
