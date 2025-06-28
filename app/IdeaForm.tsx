'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function IdeaForm({ onAdded }: { onAdded: () => void }) {
  const [text, setText] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    await supabase.from('Ideas').insert({ content: text })
    setText('')
    onAdded()
  }

  return (
    <form onSubmit={submit} className="flex gap-2 w-full">
      <input
        className="flex-1 border rounded p-2 text-black"
        placeholder="Share an idea..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Post
      </button>
    </form>
  )
}
