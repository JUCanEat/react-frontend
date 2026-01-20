import * as React from 'react';
import { Button } from '~/shadcn/components/ui/button';

type UploadOptionCardProps = {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick: () => void;
};

export function UploadOptionCard({ Icon, label, onClick }: UploadOptionCardProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="
        flex h-[150px] w-[180px] flex-col items-center justify-center
        rounded-[10px] border-[1px] border-[#009DE0] bg-[#1B1B1B]
        shadow-sm hover:bg-[#262626]
      "
      onClick={onClick}
    >
      <Icon
        style={{ width: 60, height: 60 }}
        strokeWidth={2}
        className="text-white translate-y-[3px]"
      />

      <span className="mt-[-4px] font-light text-[20px] text-[#009DE0] leading-tight">{label}</span>
    </Button>
  );
}
