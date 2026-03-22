import * as React from 'react';

export function SectionSkeleton() {
  return (
    <div className="w-[227px] h-[148px] rounded-2xl overflow-hidden flex flex-col bg-black">
      <div className="flex-1 bg-neutral-300 animate-pulse" />

      <div className="bg-[#1B1B1B] px-3 py-2">
        <div className="w-1/2 h-[6px] bg-neutral-500 rounded animate-pulse mb-1" />
        <div className="w-full h-[5px] bg-neutral-700 rounded animate-pulse mb-1" />
        <div className="w-3/4 h-[5px] bg-neutral-700 rounded animate-pulse" />
      </div>

      <div className="bg-[#1B1B1B] px-3 py-[3px] flex items-center">
        <div className="w-full border-t border-dotted border-[#00000060] animate-pulse" />
      </div>
    </div>
  );
}
