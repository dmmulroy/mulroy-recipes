import { Link, createFileRoute } from '@tanstack/react-router'
import { fetchPost } from '../utils/posts'
import { NotFound } from '~/components/NotFound'
import { PostErrorComponent } from '~/components/PostError'

export const Route = createFileRoute('/posts/$postId')({
  loader: ({ params: { postId } }) => fetchPost({ data: postId }),
  errorComponent: PostErrorComponent,
  component: PostComponent,
  notFoundComponent: () => {
    return <NotFound>Post not found</NotFound>
  },
})

function PostComponent() {
  const post = Route.useLoaderData()

  return (
    <div className="p-6 space-y-4">
      <h4 className="text-2xl font-bold text-foreground">{post.title}</h4>
      <div className="text-sm text-muted-foreground">{post.body}</div>
      <Link
        to="/posts/$postId/deep"
        params={{
          postId: String(post.id),
        }}
        activeProps={{ className: 'font-bold text-primary' }}
        className="inline-block py-1 text-primary hover:text-primary/80 transition-colors underline"
      >
        Deep View
      </Link>
    </div>
  )
}
