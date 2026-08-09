import { useState, type FormEvent, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { sendContactMessage } from '@/lib/api'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function ContactDialog({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setStatus('sending')
    const result = await sendContactMessage({
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      message: String(form.get('message') ?? ''),
    })
    if (result.ok) {
      setStatus('sent')
    } else {
      setStatus('error')
      setError(result.error ?? 'Something went wrong.')
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setStatus('idle')
          setError('')
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Get in touch</DialogTitle>
          <DialogDescription>
            Send a message and I'll get back to you.
          </DialogDescription>
        </DialogHeader>

        {status === 'sent' ? (
          <p className="rounded-2xl bg-surface px-4 py-3 text-sm text-ink">
            Thanks! Your message is on its way.
          </p>
        ) : (
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              name="name"
              required
              placeholder="Name"
              className="w-full rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Message"
              className="w-full resize-none rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-ring"
            />
            {status === 'error' && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button
              type="submit"
              disabled={status === 'sending'}
              className="w-full"
            >
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
