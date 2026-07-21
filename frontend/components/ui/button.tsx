import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "glass" | "gradient";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variants = {
      default:
        "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/35 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-white",
      outline:
        "border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 hover:border-slate-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-700",
      ghost: "text-slate-800 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-zinc-800/80 dark:hover:text-white",
      glass:
        "bg-slate-900/5 hover:bg-slate-900/10 text-slate-900 border border-slate-900/10 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white dark:border-white/10 backdrop-blur-md",
      gradient:
        "bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white hover:brightness-110 shadow-lg shadow-indigo-600/20 dark:from-indigo-500 dark:to-violet-600",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5",
      icon: "h-9 w-9 p-0 rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
