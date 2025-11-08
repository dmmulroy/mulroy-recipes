import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import type { User } from '../utils/users'

export const Route = createFileRoute('/users')({
  loader: async () => {
    const res = await fetch('/api/users')

    if (!res.ok) {
      throw new Error('Unexpected status code')
    }

    const data = await res.json()

    return data as Array<User>
  },
  component: UsersComponent,
})

function UsersComponent() {
  const users = Route.useLoaderData()

  return (
    <div className="p-6 flex gap-6">
      <aside className="w-64 flex-shrink-0">
        <ul className="space-y-1">
          {[
            ...users,
            { id: 'i-do-not-exist', name: 'Non-existent User', email: '' },
          ].map((user) => {
            return (
              <li key={user.id}>
                <Link
                  to="/users/$userId"
                  params={{
                    userId: String(user.id),
                  }}
                  className="block py-2 px-3 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  activeProps={{
                    className: 'bg-accent text-accent-foreground font-semibold'
                  }}
                >
                  <div>{user.name}</div>
                </Link>
              </li>
            )
          })}
        </ul>
      </aside>
      <div className="border-l border-border" />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
