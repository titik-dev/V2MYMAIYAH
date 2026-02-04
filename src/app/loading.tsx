export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8 animate-pulse min-h-screen">
            {/* Hero Skeleton */}
            <div className="w-full aspect-video md:aspect-[21/9] bg-gray-200 dark:bg-gray-800 rounded-2xl mb-8"></div>

            {/* Grid Skeleton */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex md:flex-col gap-4">
                        <div className="w-1/3 md:w-full aspect-[4/3] md:aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                        <div className="flex-1 space-y-2 py-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
