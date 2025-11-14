import Role from "../models/Role.js";

const predefinedRoles = [
  { roleName: "Customer", description: "Regular user of the platform." },
  { roleName: "Admin", description: "Administrator with full access." },
];

export const seedRoles = async () => {
  try {
    for (const role of predefinedRoles) {
      const exists = await Role.findOne({ roleName: role.roleName });

      if (!exists) {
        await Role.create(role);
        // No console.log — silent insertion
      }
    }
  } catch (error) {
    console.error("Error seeding roles:", error.message);
  }
};
