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
            className="flex h-[150px] w-[180px] flex-col items-center justify-center rounded-[10px] border-2 border-[#009DE0] shadow-sm transition-colors
                bg-white text-[#009DE0] hover:bg-zinc-100
                dark:bg-zinc-900 dark:text-[#009DE0] dark:border-[#009DE0] dark:hover:bg-zinc-800"
            onClick={onClick}
        >
            <Icon
                style={{ width: 60, height: 60 }}
                strokeWidth={2}
                className="translate-y-[3px]"
            />
            <span className="mt-[-4px] font-light text-[20px] leading-tight">
                {label}
            </span>
        </Button>
    )
}
