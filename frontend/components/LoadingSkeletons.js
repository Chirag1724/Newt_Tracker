// Loading skeleton for dashboard stat cards
export function StatCardSkeleton() {
    return (
        <div className="card-premium animate-pulse">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
            </div>
        </div>
    );
}

// Loading skeleton for table rows
export function TableRowSkeleton({ columns = 5 }) {
    return (
        <tr className="border-b border-gray-100">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="py-4 px-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
            ))}
        </tr>
    );
}

// Loading skeleton for cards (meetings, sales)
export function CardSkeleton() {
    return (
        <div className="card-premium animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 flex-1">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
        </div>
    );
}

// Loading skeleton for list items
export function ListItemSkeleton() {
    return (
        <div className="p-4 bg-gray-50 rounded-lg animate-pulse">
            <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        </div>
    );
}

// Full page loading spinner
export function PageLoader() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading...</p>
            </div>
        </div>
    );
}

// Button loading state
export function ButtonLoader() {
    return (
        <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Processing...</span>
        </div>
    );
}
