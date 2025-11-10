import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/')({
  component: UsersIndexComponent,
})

function UsersIndexComponent() {
  return (
    <div className="p-6">
      <p className="text-muted-foreground">
        Select a user or{' '}
        <a
          href="/api/users"
          className="text-primary hover:text-primary/80 transition-colors underline"
        >
          view as JSON
        </a>
      </p>
    </div>
  )
}
