import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { fetchPosts } from '../utils/posts'

export const Route = createFileRoute('/posts')({
  loader: async () => fetchPosts(),
  component: PostsComponent,
})

function PostsComponent() {
  const posts = Route.useLoaderData()

  return (
    <div className="p-6 flex gap-6">
      <aside className="w-64 flex-shrink-0">
        <ul className="space-y-1">
          {[...posts, { id: 'i-do-not-exist', title: 'Non-existent Post' }].map(
            (post) => {
              return (
                <li key={post.id}>
                  <Link
                    to="/posts/$postId"
                    params={{
                      postId: String(post.id),
                    }}
                    className="block py-2 px-3 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    activeProps={{
                      className: 'bg-accent text-accent-foreground font-semibold'
                    }}
                  >
                    <div>{post.title.substring(0, 30)}</div>
                  </Link>
                </li>
              )
            },
          )}
        </ul>
      </aside>
      <div className="border-l border-border" />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
