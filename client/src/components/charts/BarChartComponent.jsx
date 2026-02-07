import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const themeColors = {
    crm: {
        primary: '#3B82F6', // Blue
        secondary: '#14B8A6' // Teal
    },
    inventory: {
        primary: '#F97316', // Orange
        secondary: '#EF4444' // Red
    },
    finance: {
        primary: '#8B5CF6', // Purple
        secondary: '#10B981' // Green
    },
    default: {
        primary: '#714B67', // Deep Plum
        secondary: '#E3B341' // Mustard
    }
};

const BarChartComponent = ({ title, data, dataKey, series, moduleName = 'default', className }) => {
    const colors = themeColors[moduleName] || themeColors.default;

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey={dataKey}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            {series.map((item, index) => (
                                <Bar
                                    key={item.key}
                                    dataKey={item.key}
                                    name={item.name}
                                    fill={index === 0 ? colors.primary : colors.secondary}
                                    radius={[4, 4, 0, 0]}
                                    barSize={32}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export { BarChartComponent };
