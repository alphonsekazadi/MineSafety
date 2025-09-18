
import React from "react";
import { Button } from "@progress/kendo-react-buttons";
// @ts-ignore
import logo from "../assets/logo.svg";


interface NavbarProps {
  onAddIncident: () => void;
  onExport: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAddIncident, onExport }) => {
  return (
    <header 
      className="fixed top-0 left-0 right-0 h-14 bg-white/60 backdrop-blur-lg shadow-sm flex items-center px-4 md:pl-72 z-30" 
      role="banner"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <img src={logo} alt="MineSafe Logo" className="h-8 w-8" />
          <span className="font-semibold text-lg">MineSafe</span>
        </div>

        <div className="flex items-center gap-2">
          <Button themeColor={"primary"} aria-label="Add Incident" onClick={onAddIncident}>Add Incident</Button>
          <Button themeColor={"secondary"} onClick={onExport}>Export</Button>
          <Button themeColor={"success"}>Help</Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;