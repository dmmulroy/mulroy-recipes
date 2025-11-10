import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_pathlessLayout/_nested-layout/route-a')(
  {
    component: LayoutAComponent,
  },
)

function LayoutAComponent() {
  return <div className="text-foreground">I'm A!</div>
}
