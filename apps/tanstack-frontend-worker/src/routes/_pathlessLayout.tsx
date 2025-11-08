import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_pathlessLayout')({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <div className="p-6">
      <div className="border-b border-border pb-4 mb-4 text-muted-foreground">
        I'm a layout
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
