import React from "react";
import PlantCareBrowse from "../../components/page/plantCare/PlantCareBrowse";

function PlantCareDashboard() {
  return (
    <div>
      <PlantCareBrowse redirectBasePath="/admin/plantcare/update" />
    </div>
  );
}

export default PlantCareDashboard;
