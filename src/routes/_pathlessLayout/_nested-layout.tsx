import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_pathlessLayout/_nested-layout')({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <div className="space-y-4">
      <div className="text-muted-foreground">I'm a nested layout</div>
      <div className="flex gap-4 border-b border-border pb-4">
        <Link
          to="/route-a"
          activeProps={{
            className: 'font-bold text-primary',
          }}
          inactiveProps={{
            className: 'text-muted-foreground hover:text-foreground transition-colors',
          }}
        >
          Go to route A
        </Link>
        <Link
          to="/route-b"
          activeProps={{
            className: 'font-bold text-primary',
          }}
          inactiveProps={{
            className: 'text-muted-foreground hover:text-foreground transition-colors',
          }}
        >
          Go to route B
        </Link>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
