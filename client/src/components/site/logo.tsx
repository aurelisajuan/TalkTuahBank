import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  withText?: boolean;
}

export function Logo({ className, withText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/40 text-primary-foreground shadow-sm shadow-primary/30">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="M5 4h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 4V5a1 1 0 0 1 1-1Z"
            fill="currentColor"
            opacity="0.95"
          />
          <path
            d="M9 9h6M9 12h4"
            stroke="var(--color-primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {withText && (
        <span className="text-sm font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
            TalkTuah
          </span>
          <span className="text-foreground">Bank</span>
        </span>
      )}
    </div>
  );
}
