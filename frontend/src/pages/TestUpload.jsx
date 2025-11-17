import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadSchema } from "../../../shared/validations/upload.validation";
import { useUploadStore } from "../store/useUploadStore";

function TestUpload() {
  const { imageUrl, loading, uploadImage } = useUploadStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(uploadSchema),
  });

  const onSubmit = async (data) => {
    const res = await uploadImage(data.file, data.folder);

    if (!res.success) {
      alert(res.message);
    }
  };

  return (
    <div className="p-10 max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Test Image Upload</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Folder Input */}
        <div>
          <input
            type="text"
            placeholder="Folder Name"
            className="input input-bordered w-full"
            {...register("folder")}
          />
          {errors.folder && (
            <p className="text-red-500 text-sm mt-1">{errors.folder.message}</p>
          )}
        </div>

        {/* File Input */}
        <div>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            accept="image/*"
            onChange={(e) => setValue("file", e.target.files[0])}
          />
          {errors.file && (
            <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
          )}
        </div>

        <button
          className="btn btn-primary w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {imageUrl && (
        <div className="mt-4">
          <p className="font-semibold">Uploaded Image:</p>
          <img src={imageUrl} alt="Uploaded" className="mt-2 rounded shadow" />
        </div>
      )}
    </div>
  );
}

export default TestUpload;
