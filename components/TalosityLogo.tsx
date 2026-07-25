import Link from 'next/link';

type TalosityLogoProps = {
  className?: string;
  compact?: boolean;
  showDescriptor?: boolean;
  iconClassName?: string;
  textClassName?: string;
};

export function TalosityLogo({
  className = '',
  compact = false,
  showDescriptor = true,
  iconClassName = '',
  textClassName = '',
}: TalosityLogoProps) {
  const icon = (
    <svg
      viewBox="0 0 160 160"
      aria-hidden="true"
      className={`h-10 w-10 shrink-0 ${iconClassName}`.trim()}
    >
      <rect x="24" y="24" width="112" height="112" rx="24" fill="#071C2D" />
      <circle cx="64" cy="64" r="10" fill="#0F5DFF" />
      <circle cx="96" cy="64" r="10" fill="#0F5DFF" />
      <circle cx="80" cy="96" r="10" fill="#0F5DFF" />
      <path d="M64 64L80 96" stroke="#F8FAFC" strokeWidth="8" strokeLinecap="round" />
      <path d="M96 64L80 96" stroke="#F8FAFC" strokeWidth="8" strokeLinecap="round" />
      <path d="M64 64L96 64" stroke="#F8FAFC" strokeWidth="8" strokeLinecap="round" />
      <path d="M44 44L64 64" stroke="#F8FAFC" strokeWidth="8" strokeLinecap="round" />
      <path d="M96 64L116 44" stroke="#F8FAFC" strokeWidth="8" strokeLinecap="round" />
      <path d="M80 96L80 116" stroke="#F8FAFC" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );

  const content = (
    <>
      {icon}
      {!compact ? (
        <div className="flex min-w-0 flex-col leading-none">
          <span
            className={`text-[1.05rem] font-semibold tracking-[0.28em] text-slate-950 ${textClassName}`.trim()}
          >
            TALOSITY
          </span>
          {showDescriptor ? (
            <span className="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.34em] text-slate-500">
              ROBOTICS INTELLIGENCE
            </span>
          ) : null}
        </div>
      ) : null}
    </>
  );

  if (compact) {
    return (
      <Link href="/" className={`inline-flex items-center ${className}`.trim()}>
        {content}
      </Link>
    );
  }

  return (
    <Link href="/" className={`inline-flex items-center gap-3 ${className}`.trim()}>
      {content}
    </Link>
  );
}
