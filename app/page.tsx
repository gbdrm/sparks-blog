"use client";
import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Home() {
  const { session } = useSessionContext();
  const supabase = useSupabaseClient();

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

  return (
    <div style={{ padding: 20 }}>
      <h1>Sparksblog</h1>
      {session ? (
        <>
          <p>Logged in as {session.user.email}</p>
          <button onClick={() => (window.location.href = "/ideas")}>
            Go to Ideas
          </button>
          <button onClick={signOut}>Sign out</button>
        </>
      ) : (
        <button onClick={signIn}>Sign in</button>
      )}
    </div>
  );
}
