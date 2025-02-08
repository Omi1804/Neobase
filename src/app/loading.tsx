import React from "react";

const loading = () => {
  return (
    <div className="flex items-center justify-center h-screen relative bg-black">
      <div className="absolute inset-0">
        <img src="/bg.png" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="w-40 h-40 animate-spin">
        <img src="./loading.png" alt="" className="" />
      </div>
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center justify-center flex-col">
        <div className="text-white text-lg font-bold">Loading...</div>
        <div className="text-white text-sm">Please wait a moment</div>
      </div>
    </div>
  );
};

export default loading;
