import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import FormField from "../../common/FormField";
import { usePlantCareStore } from "../../../store/usePlantCareStore";
import { usePlantStore } from "../../../store/usePlantStore";
import toast from "react-hot-toast";
function PlantCareUpdateForm({ readOnly = false }) {
  const { plantId } = useParams();

  const { plantCare, loading, getPlantCareById, updateCareInstructions } =
    usePlantCareStore();
  const { plant, getPlantById } = usePlantStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      watering: "",
      sunlight: "",
      soil: "",
      temperature: "",
      pestCare: "",
      pruning: "",
      repotting: "",
    },
  });

  useEffect(() => {
    if (plantId) {
      getPlantCareById(plantId);
      getPlantById(plantId);
    }
  }, [plantId, getPlantCareById, getPlantById]);

  useEffect(() => {
    if (plantCare?.careInstructions) {
      reset({
        watering: plantCare.careInstructions.watering || "",
        sunlight: plantCare.careInstructions.sunlight || "",
        soil: plantCare.careInstructions.soil || "",
        temperature: plantCare.careInstructions.temperature || "",
        pestCare: plantCare.careInstructions.pestCare || "",
        pruning: plantCare.careInstructions.pruning || "",
        repotting: plantCare.careInstructions.repotting || "",
      });
    }
  }, [plantCare, reset]);

  const onSubmit = async (data) => {
    const res = await updateCareInstructions(plantId, data);

    if (res?.success) {
      toast.success("Plant care instructions updated successfully");
      navigate("/admin/plantCare");
    } else {
      toast.error(res?.message || "Failed to update care instructions");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-base-100 rounded-xl shadow p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-sm btn-outline"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-semibold">
          Update Plant Care Instructions
        </h2>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: PLANT INFO */}
        <div className="lg:col-span-1">
          {plant && (
            <div className="sticky top-4 rounded-lg border bg-base-200 p-4 space-y-3">
              <img
                src={plant.imageUrl || "/plant.webp"}
                alt={plant.name}
                className="w-full h-48 object-cover rounded"
              />

              <div>
                <h3 className="text-lg font-semibold">{plant.name}</h3>

                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                  {plant.categoryId?.name || "Uncategorized"}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                Edit care instructions for this plant.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT: CARE FORM */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Watering"
              as="textarea"
              rows={4}
              register={register}
              registerName="watering"
              placeholder="Enter watering instructions"
              error={errors.watering}
              readOnly={readOnly}
            />

            <FormField
              label="Sunlight"
              as="textarea"
              rows={4}
              register={register}
              registerName="sunlight"
              placeholder="Enter sunlight requirements"
              error={errors.sunlight}
              readOnly={readOnly}
            />

            <FormField
              label="Soil & Fertilizer"
              as="textarea"
              rows={4}
              register={register}
              registerName="soil"
              placeholder="Enter soil and fertilizer details"
              error={errors.soil}
              readOnly={readOnly}
            />

            <FormField
              label="Temperature & Humidity"
              as="textarea"
              rows={4}
              register={register}
              registerName="temperature"
              placeholder="Enter temperature and humidity details"
              error={errors.temperature}
              readOnly={readOnly}
            />

            <FormField
              label="Pest & Disease Care"
              as="textarea"
              rows={4}
              register={register}
              registerName="pestCare"
              placeholder="Enter pest control instructions"
              error={errors.pestCare}
              readOnly={readOnly}
            />

            <FormField
              label="Pruning & Maintenance"
              as="textarea"
              rows={4}
              register={register}
              registerName="pruning"
              placeholder="Enter pruning instructions"
              error={errors.pruning}
              readOnly={readOnly}
            />

            {/* FULL WIDTH */}
            <div className="md:col-span-2">
              <FormField
                label="Repotting"
                as="textarea"
                rows={4}
                register={register}
                registerName="repotting"
                placeholder="Enter repotting instructions"
                error={errors.repotting}
                readOnly={readOnly}
              />
            </div>
          </div>

          {/* ACTIONS */}
          {!readOnly && (
            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                className="btn btn-primary px-8"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Care Instructions"}
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

export default PlantCareUpdateForm;
