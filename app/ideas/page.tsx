'use client'
import { useSessionContext } from '@supabase/auth-helpers-react'
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

interface Idea {
  id: number
  text: string
  created_at: string
}

export default function IdeasPage() {
  const { session } = useSessionContext()
  // Replace with your actual env variables or config
  const supabase = createBrowserClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [text, setText] = useState('')

  const fetchIdeas = async () => {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error(error)
      return
    }
    setIdeas(data || [])
  }

  const addIdea = async () => {
    if (!text.trim()) return
    const { error } = await supabase.from('ideas').insert([{ text }])
    if (error) {
      console.error(error)
      return
    }
    setText('')
    await fetchIdeas()
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
