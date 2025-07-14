"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Check, X, ShieldAlert, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

import { app } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const auth = getAuth(app);

const ADMIN_EMAIL = "admin@example.com"; // The designated admin user

const eventFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  date: z.date({ required_error: "A date is required." }),
});

const resourceFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  location: z.string().min(2, "Location must be at least 2 characters."),
  status: z.enum(["Available", "Unavailable"]),
});

type EventFormValues = z.infer<typeof eventFormSchema>;
type ResourceFormValues = z.infer<typeof resourceFormSchema>;
type Event = { id: number; title: string; description: string; date: Date };
type Resource = { id: number; name: string; location: string; status: "Available" | "Unavailable" };
type ResourceRequest = { id: number; resourceName: string; userName: string; resourceId: number; };

// Mock data - in a real app, this would come from a database
const MOCK_EVENTS: Event[] = [
    { id: 1, title: "AI & The Future of Work", description: "A seminar on the impact of AI on various industries.", date: new Date(new Date().setDate(new Date().getDate() + 2)) },
    { id: 2, title: "Quantum Computing Symposium", description: "Deep dive into quantum algorithms and hardware.", date: new Date(new Date().setDate(new Date().getDate() + 7)) },
    { id: 3, title: "Web3 Developer Meetup", description: "Networking and talks on decentralized applications.", date: new Date(new Date().setDate(new Date().getDate() + 15)) },
];

const MOCK_RESOURCES: Resource[] = [
  { id: 1, name: "Quantum Rig A-1", location: "Lab 3", status: "Available" },
  { id: 2, name: "Supercomputer Cygnus", location: "Data Center", status: "Unavailable" },
  { id: 3, name: "VR/AR Development Kit", location: "Innovation Hub", status: "Available" },
  { id: 4, name: "High-Res 3D Printer", location: "Maker Space", status: "Available" },
  { id: 5, name: "Bio-Sequencer Z-9", location: "BioLab 1", status: "Unavailable" },
];

const MOCK_REQUESTS: ResourceRequest[] = [
    { id: 1, resourceName: "Quantum Rig A-1", userName: "alex@example.com", resourceId: 1 },
    { id: 2, resourceName: "VR/AR Development Kit", userName: "sara@example.com", resourceId: 3 },
];


export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  // Using a single source of truth for mock data, managed by this component's state
  const [events, setEvents] = React.useState<Event[]>(MOCK_EVENTS);
  const [resources, setResources] = React.useState<Resource[]>(MOCK_RESOURCES);
  const [requests, setRequests] = React.useState<ResourceRequest[]>(MOCK_REQUESTS);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        if (user.email === ADMIN_EMAIL) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          // Non-admin users are not necessarily redirected, they see an "Access Denied" message.
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const eventForm = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: { title: "", description: "" },
  });

  const resourceForm = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: { name: "", location: "", status: "Available" },
  });

  function onEventSubmit(data: EventFormValues) {
    const newEvent = { ...data, id: Date.now() };
    setEvents(prev => [...prev, newEvent]);
    toast({
      title: "Event Created!",
      description: `The event "${data.title}" has been added.`,
    });
    eventForm.reset();
  }

  function onResourceSubmit(data: ResourceFormValues) {
    const newResource = { ...data, id: Date.now() };
    setResources(prev => [...prev, newResource]);
    toast({
      title: "Resource Created!",
      description: `The resource "${data.name}" has been added.`,
    });
    resourceForm.reset();
  }
  
  function deleteEvent(id: number) {
    setEvents(events.filter(e => e.id !== id));
    toast({ title: "Event Deleted" });
  }

  const handleResourceStatusChange = (resourceId: number, newStatus: boolean) => {
    setResources(currentResources => 
      currentResources.map(r => 
        r.id === resourceId ? { ...r, status: newStatus ? "Available" : "Unavailable" } : r
      )
    );
  };
  
  const handleRequest = (requestId: number, resourceId: number, approve: boolean) => {
    setRequests(currentRequests => currentRequests.filter(req => req.id !== requestId));
    if (approve) {
      handleResourceStatusChange(resourceId, false); // Make unavailable
      toast({ title: "Request Approved", description: "The resource has been assigned."});
    } else {
      toast({ title: "Request Denied" });
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between p-4 border-b">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
            <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  if (!user) {
    return null; // Should be redirected
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                        <ShieldAlert className="h-8 w-8 text-destructive" />
                        Access Denied
                    </CardTitle>
                    <CardDescription>You are not authorized to view this page.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Please sign in with an administrator account. The email for the admin account is{" "}
                        <code className="bg-muted px-1.5 py-1 rounded-sm text-foreground">admin@example.com</code>.
                    </p>
                    <Button asChild className="mt-6">
                        <Link href="/">Return to Dashboard</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground">Manage your events and resources here.</p>
          </div>

            {/* Resource Requests Section */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Requests</CardTitle>
                <CardDescription>Approve or deny user requests for resources.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {requests.length > 0 ? requests.map(req => (
                    <div key={req.id} className="flex justify-between items-center p-3 rounded-md border bg-card">
                        <div>
                            <p className="font-semibold">{req.resourceName}</p>
                            <p className="text-sm text-muted-foreground">Requested by: {req.userName}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleRequest(req.id, req.resourceId, true)}>
                                <Check className="mr-2 h-4 w-4"/> Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRequest(req.id, req.resourceId, false)}>
                                <X className="mr-2 h-4 w-4"/> Deny
                            </Button>
                        </div>
                    </div>
                )) : (
                    <p className="text-sm text-muted-foreground text-center p-4">No pending resource requests.</p>
                )}
              </CardContent>
            </Card>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Events Section */}
            <Card>
              <CardHeader>
                <CardTitle>Manage Events</CardTitle>
                <CardDescription>Add new events to the calendar.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...eventForm}>
                  <form onSubmit={eventForm.handleSubmit(onEventSubmit)} className="space-y-6">
                    <FormField control={eventForm.control} name="title" render={({ field }) => (
                      <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., AI Summit" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={eventForm.control} name="description" render={({ field }) => (
                      <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Event details..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={eventForm.control} name="date" render={({ field }) => (
                      <FormItem className="flex flex-col"><FormLabel>Date</FormLabel>
                        <Popover><PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
                          </PopoverContent>
                        </Popover><FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit"><PlusCircle className="mr-2 h-4 w-4" /> Add Event</Button>
                  </form>
                </Form>
                <div className="mt-6 space-y-2">
                    <h4 className="font-medium">Current Events</h4>
                    {events.map(event => (
                        <div key={event.id} className="flex justify-between items-center p-2 rounded-md border">
                            <span>{event.title}</span>
                            <Button variant="ghost" size="icon" onClick={() => deleteEvent(event.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete Event</span>
                            </Button>
                        </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Resources Section */}
            <Card>
              <CardHeader>
                <CardTitle>Manage Resources</CardTitle>
                <CardDescription>Add or update resource availability.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...resourceForm}>
                  <form onSubmit={resourceForm.handleSubmit(onResourceSubmit)} className="space-y-6">
                    <FormField control={resourceForm.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Resource Name</FormLabel><FormControl><Input placeholder="e.g., Quantum Rig" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={resourceForm.control} name="location" render={({ field }) => (
                      <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Lab 5" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={resourceForm.control} name="status" render={({ field }) => (
                      <FormItem><FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Unavailable">Unavailable</SelectItem>
                          </SelectContent>
                        </Select><FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit"><PlusCircle className="mr-2 h-4 w-4" /> Add Resource</Button>
                  </form>
                </Form>
                 <div className="mt-6 space-y-4">
                    <h4 className="font-medium">Current Resources</h4>
                    {resources.map(resource => (
                        <div key={resource.id} className="flex justify-between items-center p-3 rounded-md border">
                            <div>
                                <p className="font-semibold">{resource.name}</p>
                                <p className="text-sm text-muted-foreground">{resource.location}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch 
                                    id={`resource-status-${resource.id}`}
                                    checked={resource.status === 'Available'}
                                    onCheckedChange={(checked) => handleResourceStatusChange(resource.id, checked)}
                                />
                                <Label htmlFor={`resource-status-${resource.id}`} className={cn("text-sm", resource.status === 'Available' ? "text-green-600" : "text-red-600")}>
                                    {resource.status}
                                </Label>
                            </div>
                        </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
