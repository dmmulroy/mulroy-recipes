import { Link, createFileRoute } from '@tanstack/react-router'
import { fetchPost } from '../utils/posts'
import { PostErrorComponent } from '~/components/PostError'

export const Route = createFileRoute('/posts_/$postId/deep')({
  loader: async ({ params: { postId } }) =>
    fetchPost({
      data: postId,
    }),
  errorComponent: PostErrorComponent,
  component: PostDeepComponent,
})

function PostDeepComponent() {
  const post = Route.useLoaderData()

  return (
    <div className="p-6 space-y-4">
      <Link
        to="/posts"
        className="inline-block py-1 text-primary hover:text-primary/80 transition-colors"
      >
        ← All Posts
      </Link>
      <h4 className="text-2xl font-bold text-foreground">{post.title}</h4>
      <div className="text-sm text-muted-foreground">{post.body}</div>
    </div>
  )
}
