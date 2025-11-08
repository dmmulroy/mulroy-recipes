import { Await, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Suspense, useState } from 'react'

const personServerFn = createServerFn({ method: 'GET' })
  .inputValidator((d: string) => d)
  .handler(({ data: name }) => {
    return { name, randomNumber: Math.floor(Math.random() * 100) }
  })

const slowServerFn = createServerFn({ method: 'GET' })
  .inputValidator((d: string) => d)
  .handler(async ({ data: name }) => {
    await new Promise((r) => setTimeout(r, 1000))
    return { name, randomNumber: Math.floor(Math.random() * 100) }
  })

export const Route = createFileRoute('/deferred')({
  loader: async () => {
    return {
      deferredStuff: new Promise<string>((r) =>
        setTimeout(() => r('Hello deferred!'), 2000),
      ),
      deferredPerson: slowServerFn({ data: 'Tanner Linsley' }),
      person: await personServerFn({ data: 'John Doe' }),
    }
  },
  component: Deferred,
})

function Deferred() {
  const [count, setCount] = useState(0)
  const { deferredStuff, deferredPerson, person } = Route.useLoaderData()

  return (
    <div className="p-6 space-y-4">
      <div data-testid="regular-person" className="text-foreground">
        {person.name} - {person.randomNumber}
      </div>
      <Suspense fallback={<div className="text-muted-foreground">Loading person...</div>}>
        <Await
          promise={deferredPerson}
          children={(data) => (
            <div data-testid="deferred-person" className="text-foreground">
              {data.name} - {data.randomNumber}
            </div>
          )}
        />
      </Suspense>
      <Suspense fallback={<div className="text-muted-foreground">Loading stuff...</div>}>
        <Await
          promise={deferredStuff}
          children={(data) => (
            <h3 data-testid="deferred-stuff" className="text-xl font-bold text-foreground">
              {data}
            </h3>
          )}
        />
      </Suspense>
      <div className="text-foreground">Count: {count}</div>
      <div>
        <button
          onClick={() => setCount(count + 1)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold hover:opacity-90 transition-opacity"
        >
          Increment
        </button>
      </div>
    </div>
  )
}
