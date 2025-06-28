'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Idea = {
  id: number
  content: string
  created_at: string
}

export default function IdeaList({ refresh }: { refresh: boolean }) {
  const [ideas, setIdeas] = useState<Idea[]>([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('Ideas')
        .select('*')
        .order('created_at', { ascending: false })
      setIdeas(data || [])
    }
    load()
  }, [refresh])

  return (
    <ul className="w-full flex flex-col gap-4">
      {ideas.map((idea) => (
        <li key={idea.id} className="border p-4 rounded">
          {idea.content}
        </li>
      ))}
    </ul>
  )
}
