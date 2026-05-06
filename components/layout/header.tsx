import Image from "next/image";
import MobileMenu from "@/components/navigation/mobile-menu";
import Logo from "@/components/shared/Logo";
import GradientCard from "@/components/ui/GradientCard";

export default function Header() {

  return (
    <GradientCard className="h-18">
      <div className="flex justify-between rounded-xl items-center px-5 h-full bg-black">
      
        <div className = "w-lg">
          <MobileMenu 
            iconSize={30} 
            className = "w-fit relative flex items-center justify-left"
          />
        </div>

        <Logo />

        <div className = "hidden w-lg md:block"/>

      </div>
    </GradientCard>
  );
}


  // w-fit
  // relative flex items-center justify-left
  // p-2 px-4 rounded-md
  // transition-all duration-200
  // hover:bg-white/10
  // cursor-pointer