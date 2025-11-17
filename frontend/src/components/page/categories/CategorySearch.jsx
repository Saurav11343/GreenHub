import React from "react";
import FormField from "../../common/FormField";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";

function CategorySearch({ onSearch }) {
  const { register, watch } = useForm();

  const query = watch("search");

  React.useEffect(() => {
    onSearch(query || "");
  }, [query]);

  return (
    <FormField
      as="search"
      icon={Search}
      placeholder="Search categories..."
      register={register}
      registerName="search"
    />
  );
}

export default CategorySearch;
