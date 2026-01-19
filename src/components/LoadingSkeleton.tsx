export function LoadingSkeleton() {
  return (
    <div className="bg-white border-b border-gray-100 p-4 animate-pulse">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        
        <div className="flex-1">
          {/* Username & Badge */}
          <div className="flex items-center gap-2 mb-1">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
          
          {/* Timestamp */}
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
      </div>

      {/* Title */}
      <div className="mb-2">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-5 bg-gray-200 rounded w-1/2" />
      </div>

      {/* Content */}
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-11/12" />
        <div className="h-4 bg-gray-200 rounded w-4/5" />
      </div>

      {/* Image placeholder (sometimes) */}
      {Math.random() > 0.5 && (
        <div className="w-full h-48 bg-gray-200 rounded-xl mb-3" />
      )}

      {/* Footer */}
      <div className="flex items-center gap-4">
        <div className="h-8 bg-gray-200 rounded-full w-16" />
        <div className="h-8 bg-gray-200 rounded-full w-16" />
        <div className="h-8 bg-gray-200 rounded-full w-16" />
      </div>
    </div>
  );
}

export function LoadingSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <LoadingSkeleton key={`skeleton-${i}`} />
      ))}
    </>
  );
}
