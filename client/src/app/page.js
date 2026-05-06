'use client'

import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import Header from "@/components/pages/Header";
import Hero from "@/components/pages/Hero";

export default function Home() {
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* <h1>Hi I am page.js main</h1>
      <h2>Checking for user</h2>

      {user ? (
        <div>
          <p>Welcome: {user.username}</p>
          <p>Email: {user.email}</p>
          <Button onClick={logout}>
            Logout 
          </Button>
        </div>
      ) : (
        <div> 
          <p>Not logged in</p>
          <Button 
            href="/login"
          >Login here
          </Button>
        </div>
      )} */}

      <Hero />
    </div>
  );
}