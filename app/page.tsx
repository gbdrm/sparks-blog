'use client'

import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import IdeaForm from './IdeaForm'
import IdeaList from './IdeaList'

export default function Home() {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    await supabase.auth.signInWithOtp({ email })
    setEmail('')
  }

  return (
    <main className="container mx-auto max-w-xl p-4 flex flex-col items-center gap-6">
      {!session ? (
        <div className="flex flex-col gap-4 w-full">
          <form onSubmit={signInWithEmail} className="flex gap-2">
            <input
              className="flex-1 border rounded p-2 text-black"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Email Link
            </button>
          </form>
          <button
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}
            className="px-4 py-2 bg-gray-800 text-white rounded"
          >
            Sign in with GitHub
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <button onClick={signOut} className="self-end px-4 py-2 border rounded">
            Sign out
          </button>
          <IdeaForm onAdded={() => setRefresh((r) => !r)} />
          <IdeaList refresh={refresh} />
        </div>
      )}
    </main>
  )
}
