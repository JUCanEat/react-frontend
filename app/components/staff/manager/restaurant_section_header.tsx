interface RestaurantSectionHeaderProps {
  title: string;
  addLabel: string;
  onAdd: () => void;
}

export function RestaurantSectionHeader({ title, addLabel, onAdd }: RestaurantSectionHeaderProps) {
  return (
    <div className="mb-4 inline-flex max-w-full items-center gap-2 md:gap-3">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{title}</h2>
      <button
        onClick={onAdd}
        aria-label={addLabel}
        title={addLabel}
        className="shrink-0 h-8 w-8 flex items-center justify-center text-base font-semibold text-white bg-[#009DE0] rounded hover:bg-[#007bb8] transition-colors"
      >
        +
      </button>
    </div>
  );
}
