"use client";

import { useState } from "react";
import { Cross as Hamburger } from "hamburger-react";

type MobileMenuProps = {
  iconSize?: number;
  className?: string;
};

export default function MobileMenu({ iconSize, className }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>

      <Hamburger
        size={iconSize}
        toggled={isOpen} 
        toggle={setIsOpen}
        color="white"
        direction="right"
        label="Show menu"
        easing="ease-out"
        distance="sm"
        rounded
      />
      <p className = "text-white md:ml-2">Menu</p>


    </div>
  );
}