import { Dot } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export const TransactionHeader = () => {
  const router = useRouter();
  const pathName = usePathname();
  return (
    <div className=" mt-20 mb-10 flex items-center justify-center z-50">
      <button
        onClick={() => router.push("/transfers")}
        className="cursor-pointer z-50 flex items-center justify-center gap-1 bg-gradient-to-r from-[#4200FF] to-[#FF00E1] px-4 py-2 rounded-full text-sm font-normal text-white"
      >
        {pathName === "/transfers" && (
          <Dot size={15} strokeWidth={5} className="font-bold" />
        )}
        <span>TRANSFERS</span>
      </button>
      <div className="text-white tracking-widest font-bold">-------------</div>
      <button
        onClick={() => router.push("/bridge")}
        className="cursor-pointer z-50 flex items-center justify-center gap-1 bg-gradient-to-r from-[#4200FF] to-[#FF00E1] px-4 py-2.5 rounded-full text-sm font-normal text-white"
      >
        {pathName === "/bridge" && (
          <Dot size={15} strokeWidth={5} className="font-bold" />
        )}
        BRIDGE
      </button>
    </div>
  );
};
