import React from 'react';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({
    className,
    variant = 'primary',
    size = 'default',
    children,
    ...props
}, ref) => {

    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200",
        secondary: "bg-white border-2 border-primary text-primary hover:bg-primary/5 shadow-sm hover:shadow-md transition-all duration-200",
        ghost: "bg-transparent text-primary hover:bg-primary/10 hover:underline transition-colors duration-200",
        outline: "border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-900"
    };

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
    };

    return (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button };
