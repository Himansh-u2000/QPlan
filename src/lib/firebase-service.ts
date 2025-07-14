import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
  writeBatch,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
}

export interface Resource {
  id: string;
  name: string;
  location: string;
  status: "Available" | "Unavailable";
}

export interface ResourceRequest {
    id: string;
    resourceId: string;
    resourceName: string;
    userId: string;
    userName: string;
    status: 'pending' | 'approved' | 'denied';
}

// Event Functions
export async function getEvents(): Promise<Event[]> {
  const eventsCol = collection(db, "events");
  const eventSnapshot = await getDocs(eventsCol);
  const eventList = eventSnapshot.docs.map(doc => {
    const data = doc.data();
    return { 
        id: doc.id, 
        title: data.title,
        description: data.description,
        date: (data.date as Timestamp).toDate()
    };
  });
  return eventList;
}

export async function addEvent(event: Omit<Event, 'id' | 'date'> & { date: Date }) {
  await addDoc(collection(db, "events"), {
    ...event,
    date: Timestamp.fromDate(event.date)
  });
}

export async function deleteEvent(id: string) {
  await deleteDoc(doc(db, "events", id));
}

// Resource Functions
export async function getResources(): Promise<Resource[]> {
  const resourcesCol = collection(db, "resources");
  const resourceSnapshot = await getDocs(resourcesCol);
  const resourceList = resourceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
  return resourceList;
}

export async function addResource(resource: Omit<Resource, 'id'>) {
  await addDoc(collection(db, "resources"), resource);
}

export async function updateResourceStatus(id: string, status: "Available" | "Unavailable") {
  const resourceDoc = doc(db, "resources", id);
  await updateDoc(resourceDoc, { status });
}

// Resource Request Functions
export async function getResourceRequests(): Promise<ResourceRequest[]> {
    const q = query(collection(db, "resourceRequests"), where("status", "==", "pending"));
    const requestSnapshot = await getDocs(q);
    return requestSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ResourceRequest));
}

export async function addResourceRequest(request: Omit<ResourceRequest, 'id'>) {
    // Check if user already requested this resource and it's pending
    const q = query(collection(db, "resourceRequests"), 
        where("userId", "==", request.userId), 
        where("resourceId", "==", request.resourceId),
        where("status", "==", "pending"));

    const existingRequests = await getDocs(q);
    if (!existingRequests.empty) {
        throw new Error("You already have a pending request for this resource.");
    }

    await addDoc(collection(db, "resourceRequests"), request);
}

export async function approveResourceRequest(requestId: string, resourceId: string) {
    const batch = writeBatch(db);

    const requestRef = doc(db, "resourceRequests", requestId);
    const resourceRef = doc(db, "resources", resourceId);

    batch.delete(requestRef); // Or update status to 'approved'
    batch.update(resourceRef, { status: "Unavailable" });

    await batch.commit();
}

export async function denyResourceRequest(requestId: string) {
    await deleteDoc(doc(db, "resourceRequests", requestId)); // Or update status to 'denied'
}
