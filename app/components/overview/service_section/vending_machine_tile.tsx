import * as React from 'react';

interface VendingMachineTileProps {
  description: string;
}

export function VendingMachineTile({ description }: VendingMachineTileProps) {
  return (
    <div className="w-[227px] h-[148px] rounded-xl overflow-hidden flex flex-col bg-black">
      <div className="flex-1 bg-white" />

      <div className="bg-[#1B1B1B] px-3 py-2">
        <h3 className="text-[10.5px] font-semibold leading-snug text-white line-clamp-2">
          {description}
        </h3>
      </div>

      <div className="bg-[#1B1B1B] px-3 py-[3px] flex items-center">
        <div className="w-full border-t border-dotted border-[#00000060]" />
      </div>
    </div>
  );
}
