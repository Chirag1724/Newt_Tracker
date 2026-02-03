'use client';

export default function StatsCard({ title, value, icon, color = 'primary', subtitle }) {
    const colorClasses = {
        primary: 'bg-primary text-white',
        secondary: 'bg-secondary text-white',
        accent: 'bg-accent text-white',
        green: 'bg-green-500 text-white',
        blue: 'bg-blue-500 text-white',
        purple: 'bg-purple-500 text-white',
    };

    return (
        <div className="card hover:scale-105 transition-smooth">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-gray-600 text-sm font-semibold mb-2">{title}</p>
                    <h3 className="text-3xl font-bold text-dark mb-1">{value}</h3>
                    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                </div>
                {icon && (
                    <div className={`${colorClasses[color]} p-3 rounded-lg`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
