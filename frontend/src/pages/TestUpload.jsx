import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ImageUpload from "../components/common/imageUpload";

function TestUpload() {
  const { register, handleSubmit, setValue, watch } = useForm();

  const [trigger, setTrigger] = useState(false);

  const startUpload = () => setTrigger((prev) => !prev);

  const onSubmit = (data) => {
    console.log("Final Form Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-5">
      <div className="text-xl font-bold">TestUpload Form</div>

      {/* Universal Image Upload */}
      <ImageUpload
        folderName="plants"
        uploadTrigger={trigger}
        onUploadComplete={(url) => {
          console.log("Uploaded URL:", url);
          setValue("imageUrl", url); // store inside form
        }}
      />

      {/* Hidden field to store uploaded image URL */}
      <input type="hidden" {...register("imageUrl")} />

      <button type="button" className="btn btn-primary" onClick={startUpload}>
        Upload Image
      </button>

      <button type="submit" className="btn btn-success">
        Submit Form
      </button>
    </form>
  );
}

export default TestUpload;
