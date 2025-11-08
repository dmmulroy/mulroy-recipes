import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/')({
  component: PostsIndexComponent,
})

function PostsIndexComponent() {
  return (
    <div className="p-6">
      <p className="text-muted-foreground">Select a post.</p>
    </div>
  )
}
