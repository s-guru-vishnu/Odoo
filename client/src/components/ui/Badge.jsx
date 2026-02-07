import React from 'react';
import { cn } from '../../lib/utils';

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
    const variants = {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-red-100 text-red-900 hover:bg-red-200",
        success: "border-transparent bg-green-100 text-green-900 hover:bg-green-200",
        warning: "border-transparent bg-accent-mustard/20 text-yellow-900 hover:bg-accent-mustard/30",
        outline: "text-foreground",
    };

    return (
        <div
            ref={ref}
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                variants[variant],
                className
            )}
            {...props}
        />
    );
});
Badge.displayName = "Badge";

export { Badge };
