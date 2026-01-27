import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade/40 disabled:cursor-not-allowed disabled:bg-mist disabled:text-ink/50 disabled:shadow-none",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
