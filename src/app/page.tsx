"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/lib/firebase"; 

import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/header";
import EventCalendar from "@/components/event-calendar";
import ResourceList from "@/components/resource-list";
import ChatBot from "@/components/chat-bot";

const auth = getAuth(app);

// Consistent mock data, this would ideally come from a central store or API
const MOCK_EVENTS = [
    { id: 1, title: "AI & The Future of Work", description: "A seminar on the impact of AI on various industries.", date: new Date(new Date().setDate(new Date().getDate() + 2)) },
    { id: 2, title: "Quantum Computing Symposium", description: "Deep dive into quantum algorithms and hardware.", date: new Date(new Date().setDate(new Date().getDate() + 7)) },
    { id: 3, title: "Web3 Developer Meetup", description: "Networking and talks on decentralized applications.", date: new Date(new Date().setDate(new Date().getDate() + 15)) },
];

const MOCK_RESOURCES = [
  { id: 1, name: "Quantum Rig A-1", location: "Lab 3", status: "Available" as const },
  { id: 2, name: "Supercomputer Cygnus", location: "Data Center", status: "Unavailable" as const },
  { id: 3, name: "VR/AR Development Kit", location: "Innovation Hub", status: "Available" as const },
  { id: 4, name: "High-Res 3D Printer", location: "Maker Space", status: "Available" as const },
  { id: 5, name: "Bio-Sequencer Z-9", location: "BioLab 1", status: "Unavailable" as const },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isClient, setIsClient] = React.useState(false);
  
  // State for resources so it can be updated by user actions
  const [resources, setResources] = React.useState(MOCK_RESOURCES);

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
            <EventCalendar events={MOCK_EVENTS} />
            <ResourceList resources={resources} />
          </div>
          <div className="lg:col-span-1 lg:sticky lg:top-8">
            <ChatBot events={MOCK_EVENTS} resources={resources} />
          </div>
        </div>
      </main>
    </div>
  );
}
