import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { cn } from '~/utils/cn'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  console.error('DefaultCatchBoundary Error:', error)

  return (
    <div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">
      <ErrorComponent error={error} />
      <div className="flex gap-2 items-center flex-wrap">
        <button
          onClick={() => {
            router.invalidate()
          }}
          className={cn(
            "px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold",
            "hover:opacity-90 transition-opacity"
          )}
        >
          Try Again
        </button>
        {isRoot ? (
          <Link
            to="/"
            className={cn(
              "px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-semibold",
              "hover:opacity-90 transition-opacity"
            )}
          >
            Home
          </Link>
        ) : (
          <Link
            to="/"
            className={cn(
              "px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-semibold",
              "hover:opacity-90 transition-opacity"
            )}
            onClick={(e) => {
              e.preventDefault()
              window.history.back()
            }}
          >
            Go Back
          </Link>
        )}
      </div>
    </div>
  )
}
