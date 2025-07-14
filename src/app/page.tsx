"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/header";
import EventCalendar from "@/components/event-calendar";
import ResourceList from "@/components/resource-list";
import ChatBot from "@/components/chat-bot";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (!isClient || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between p-4 border-b">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-24" />
        </header>
        <main className="flex-1 p-4 md:p-8 grid gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-full w-full min-h-[500px]" />
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect is happening
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2 space-y-8">
            <EventCalendar />
            <ResourceList />
          </div>
          <div className="lg:col-span-1 lg:sticky lg:top-8">
            <ChatBot />
          </div>
        </div>
      </main>
    </div>
  );
}
