import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AuthSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md p-8 rounded-2xl shadow-xl border border-border bg-card">
        <CardHeader className="text-center space-y-4">
          {/* Logo Skeleton */}
          <div className="flex items-center gap-3 justify-center">
            <Skeleton className="h-8 w-8 rounded-xl" />
            <div>
              <Skeleton className="h-5 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          
          {/* Title Skeleton */}
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Form Fields Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          
          {/* Button Skeleton */}
          <Skeleton className="h-12 w-full rounded-lg" />
          
          {/* Link Skeleton */}
          <div className="text-center">
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 