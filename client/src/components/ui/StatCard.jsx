import React from 'react';
import { Card, CardContent } from './Card';
import { cn } from '../../lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, trend, trendValue, icon: Icon, moduleColor, className }) => {
    const isPositive = trend === 'up';

    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-neutral-500">{title}</p>
                        <h3 className="text-2xl font-bold text-primary mt-2">{value}</h3>
                    </div>
                    {Icon && (
                        <div className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center opacity-80",
                            moduleColor === 'crm' && "bg-module-crm/10 text-module-crm",
                            moduleColor === 'inventory' && "bg-module-inventory/10 text-module-inventory",
                            moduleColor === 'finance' && "bg-module-finance/10 text-module-finance",
                            !moduleColor && "bg-primary/10 text-primary" // Default
                        )}>
                            <Icon className="h-6 w-6" />
                        </div>
                    )}
                </div>

                {trendValue && (
                    <div className="flex items-center mt-4 text-xs font-medium">
                        <span className={cn(
                            "flex items-center gap-1 px-2 py-0.5 rounded-full",
                            isPositive ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                        )}>
                            {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {trendValue}
                        </span>
                        <span className="text-neutral-400 ml-2">vs last month</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export { StatCard };
