"use client";
import { Dot } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import path from "path";
import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <main className="bg-black min-h-screen relative">
      <Header />
      {children}
    </main>
  );
};

const Header = () => {
  const router = useRouter();
  const pathName = usePathname();
  return (
    <div className="absolute top-[14%] left-1/2 -translate-x-1/2 flex items-center justify-center z-50">
      <button
        onClick={() => router.push("/transfers")}
        className="cursor-pointer z-50 flex items-center justify-center gap-1 bg-gradient-to-r from-[#4200FF] to-[#FF00E1] px-4 py-2 rounded-full text-sm font-semibold text-white"
      >
        {pathName === "/transfers" && (
          <Dot size={18} strokeWidth={5} className="font-bold" />
        )}
        <span>TRANSFERS</span>
      </button>
      <div className="text-white tracking-widest font-bold">-------------</div>
      <button
        onClick={() => router.push("/bridge")}
        className="cursor-pointer z-50 flex items-center justify-center gap-1 bg-gradient-to-r from-[#4200FF] to-[#FF00E1] px-4 py-2 rounded-full text-sm font-semibold text-white"
      >
        {pathName === "/bridge" && (
          <Dot size={18} strokeWidth={5} className="font-bold" />
        )}
        BRIDGE
      </button>
    </div>
  );
};

export default Layout;
