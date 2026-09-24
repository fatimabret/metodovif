
export default function SectionHeader({ eyebrow, title, highlight }) {
  return (
    <div className="flex flex-col items-start text-left gap-2 mb-8 md:mb-12 px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72 w-full">
      {eyebrow && <span className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-muted-foreground font-semibold">{eyebrow}</span>}
      <h2 className="text-5xl md:text-6xl lg:text-7xl text-foreground font-display">
        {title} {highlight && <span className="script text-primary">{highlight}</span>}
      </h2>
    </div>
  );
}