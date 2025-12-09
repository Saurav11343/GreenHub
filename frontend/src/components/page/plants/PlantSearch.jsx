import React from "react";
import FormField from "../../common/FormField";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";

function PlantSearch({ onSearch }) {
  const { register, watch } = useForm();

  const query = watch("search");

  React.useEffect(() => {
    onSearch(query || "");
  }, [query]);

  return (
    <FormField
      as="search"
      icon={Search}
      placeholder="Search plant..."
      register={register}
      registerName="search"
    />
  );
}

export default PlantSearch;
