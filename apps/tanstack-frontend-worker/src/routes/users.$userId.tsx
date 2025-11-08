import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from 'src/components/NotFound'
import { UserErrorComponent } from 'src/components/UserError'
import type { User } from '../utils/users'

export const Route = createFileRoute('/users/$userId')({
  loader: async ({ params: { userId } }) => {
    try {
      const res = await fetch('/api/users/' + userId)
      if (!res.ok) {
        throw new Error('Unexpected status code')
      }

      const data = await res.json()

      return data as User
    } catch {
      throw new Error('Failed to fetch user')
    }
  },
  errorComponent: UserErrorComponent,
  component: UserComponent,
  notFoundComponent: () => {
    return <NotFound>User not found</NotFound>
  },
})

function UserComponent() {
  const user = Route.useLoaderData()

  return (
    <div className="space-y-4">
      <h4 className="text-2xl font-bold text-foreground">{user.name}</h4>
      <div className="text-sm text-muted-foreground">{user.email}</div>
      <div>
        <a
          href={`/api/users/${user.id}`}
          className="text-primary hover:text-primary/80 transition-colors underline"
        >
          View as JSON
        </a>
      </div>
    </div>
  )
}
