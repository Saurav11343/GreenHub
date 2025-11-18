import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormField from "../../common/FormField.jsx";
import { createCategorySchema } from "../../../../../shared/validations/category.validation.js";
import { useUploadStore } from "../../../store/useUploadStore.js";
import { useImageCompression } from "../../../utils/useImageCompression.js";
import ImageUpload from "../../common/imageUpload.jsx";
import ButtonLoader from "../../common/ButtonLoader.jsx";

function CategoryFormModal({ isOpen, onClose, onSubmit, initialData, type }) {
  const { uploadImage } = useUploadStore();
  const { compressImage } = useImageCompression();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createCategorySchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [saving, setSaving] = useState(false);

  // Load initial data (edit mode)
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description,
        imageUrl: initialData.imageUrl,
      });
      setPreviewImg(initialData.imageUrl);
    } else {
      reset();
      setPreviewImg(null);
    }
  }, [initialData, reset]);

  if (!isOpen) return null;

  // ⭐ One-click submit: upload image + save category
  const handleFinalSubmit = async (formData) => {
    setSaving(true);

    if (selectedFile) {
      const compressed = await compressImage(selectedFile);
      const url = await uploadImage(compressed, "categories");

      formData.imageUrl = url;
      setValue("imageUrl", url);
    }

    await onSubmit(formData);
    setSaving(false);
  };

  return (
    <dialog open className="modal">
      <div className="modal-box w-11/12 max-w-lg">
        <h3 className="font-bold text-lg">
          {type === "edit" ? "Edit Category" : "Add New Category"}
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
            label="Category Name"
            as="input"
            type="text"
            register={register}
            registerName="name"
            placeholder="Enter category name"
            error={errors.name}
          />

          <FormField
            label="Category Description"
            as="textarea"
            rows={4}
            register={register}
            registerName="description"
            placeholder="Enter description"
            error={errors.description}
          />

          {/* Hidden URL field */}
          <input type="hidden" {...register("imageUrl")} />

          {/* Buttons Section */}
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

export default CategoryFormModal;
