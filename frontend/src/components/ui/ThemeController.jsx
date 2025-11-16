import React from "react";
import { Sun, Moon } from "lucide-react";

function ThemeController() {
  return (
    <label className="swap swap-rotate cursor-pointer">
      {/* Theme toggle checkbox */}
      <input type="checkbox" className="theme-controller" value="forest" />

      {/* Light mode icon */}
      <Sun className="swap-off h-8 w-8" />

      {/* Dark mode icon */}
      <Moon className="swap-on h-8 w-8" />
    </label>
  );
}

export default ThemeController;
