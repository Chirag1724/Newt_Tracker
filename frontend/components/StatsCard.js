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
        <div className="bg-white rounded-[2rem] p-4 md:p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
            {/* Background Accent Gradient */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${colorClasses[color].split(' ')[0]}`}></div>

            <div className="flex items-center justify-between relative z-10">
                <div className="flex-1 min-w-0">
                    <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.15em] mb-1.5 md:mb-2 truncate">
                        {title}
                    </p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
                            {value}
                        </h3>
                    </div>
                    {subtitle && (
                        <p className="text-[10px] md:text-[11px] text-slate-500 font-bold mt-1.5 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            {subtitle}
                        </p>
                    )}
                </div>

                {icon && (
                    <div className={`${colorClasses[color]} p-2.5 md:p-3.5 rounded-2xl md:rounded-[1.25rem] shadow-2xl shadow-current/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out flex-shrink-0 ml-3`}>
                        <div className="w-5 h-5 md:w-6 md:h-6">
                            {icon}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
