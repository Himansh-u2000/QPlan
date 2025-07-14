"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase"; 
import { getEvents, getResources, Event, Resource } from "@/lib/firebase-service";

import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/header";
import EventCalendar from "@/components/event-calendar";
import ResourceList from "@/components/resource-list";
import ChatBot from "@/components/chat-bot";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isClient, setIsClient] = React.useState(false);
  
  const [events, setEvents] = React.useState<Event[]>([]);
  const [resources, setResources] = React.useState<Resource[]>([]);

  React.useEffect(() => {
    setIsClient(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchData();
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchData = async () => {
    try {
      const [eventsData, resourcesData] = await Promise.all([getEvents(), getResources()]);
      setEvents(eventsData);
      setResources(resourcesData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load data",
        description: "There was a problem fetching data from the server."
      });
      console.error(error);
    }
  };

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
            <EventCalendar events={events} />
            <ResourceList resources={resources} user={user} />
          </div>
          <div className="lg:col-span-1 lg:sticky lg:top-8">
            <ChatBot events={events} resources={resources} />
          </div>
        </div>
      </main>
    </div>
  );
}
