import { Link } from '@tanstack/react-router'
import { cn } from '~/utils/cn'

export function NotFound({ children }: { children?: any }) {
  return (
    <div className="space-y-4 p-4">
      <div className="text-muted-foreground">
        {children || <p>The page you are looking for does not exist.</p>}
      </div>
      <p className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => window.history.back()}
          className={cn(
            "bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-semibold text-sm",
            "hover:opacity-90 transition-opacity"
          )}
        >
          Go back
        </button>
        <Link
          to="/"
          className={cn(
            "bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold text-sm",
            "hover:opacity-90 transition-opacity"
          )}
        >
          Start Over
        </Link>
      </p>
    </div>
  )
}
