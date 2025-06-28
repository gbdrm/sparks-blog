'use client'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'

export default function IdeasPage() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const [ideas, setIdeas] = useState<any[]>([])
  const [text, setText] = useState('')

  const fetchIdeas = async () => {
    const { data } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false })
    setIdeas(data || [])
  }

  const addIdea = async () => {
    if (!text.trim()) return
    await supabase.from('ideas').insert({ text })
    setText('')
    fetchIdeas()
  }

  useEffect(() => {
    if (session) fetchIdeas()
  }, [session])

  if (!session) return <p>Please log in to view and post ideas.</p>

  return (
    <div style={{ padding: 20 }}>
      <h2>Share your idea</h2>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Your idea..."
        style={{ width: 300 }}
      />
      <button onClick={addIdea}>Send</button>
      <ul>
        {ideas.map((i) => (
          <li key={i.id}>
            {i.text} <small>{new Date(i.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
      <button onClick={() => (window.location.href = '/')}>← Back</button>
    </div>
  )
}
