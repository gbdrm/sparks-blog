"use client";
import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

interface Idea {
  id: number;
  text: string;
  created_at: string;
  user_email?: string;
}

export default function Home() {
  const { session } = useSessionContext();
  const supabase = useSupabaseClient();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const fetchIdeas = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('Ideas')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    if (error) {
      console.error(error);
      setIsLoading(false);
      return;
    }
    setIdeas(data || []);
    setIsLoading(false);
  };

  const postIdea = async () => {
    if (!text.trim()) return;
    setIsPosting(true);
    const { error } = await supabase.from('Ideas').insert([{ text }]);
    if (error) {
      console.error(error);
      setIsPosting(false);
      return;
    }
    setText("");
    await fetchIdeas();
    setIsPosting(false);
  };

  const signIn = async () => {
    const email = prompt("Enter your email for login:");
    if (!email) return;
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert("Check your email for a magic link.");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SparksBlog
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {session.user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 hidden sm:block">
                      {session.user.email}
                    </span>
                  </div>
                  <button 
                    onClick={() => (window.location.href = "/ideas")}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    My Ideas
                  </button>
                  <button 
                    onClick={signOut}
                    className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <button 
                  onClick={signIn}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Twitter-style Post Box */}
        {session && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex items-center space-x-3 border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {session.user.email?.charAt(0).toUpperCase()}
            </div>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="What's happening?"
              className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-gray-50 outline-none"
              maxLength={200}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  postIdea();
                }
              }}
              disabled={isPosting}
            />
            <button
              onClick={postIdea}
              disabled={!text.trim() || isPosting}
              className="ml-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-purple-200 z-0" />
          <ul className="space-y-8 pl-0">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <li key={i} className="relative flex items-start space-x-4 animate-pulse">
                  <div className="z-10 w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                  </div>
                </li>
              ))
            ) : ideas.length > 0 ? (
              ideas.map((idea, idx) => (
                <li key={idea.id} className="relative flex items-start space-x-4">
                  <div className="z-10 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {idea.user_email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-900 text-base mb-1">{idea.text}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(idea.created_at).toLocaleString()}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="relative flex items-start space-x-4">
                <div className="z-10 w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 text-gray-400">No posts yet.</div>
              </li>
            )}
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 SparksBlog.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
