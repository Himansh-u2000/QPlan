"use client";

import { List, Send } from "lucide-react";
import { User } from "firebase/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addResourceRequest, Resource } from "@/lib/firebase-service";

type ResourceListProps = {
  resources: Resource[];
  user: User | null;
};

export default function ResourceList({ resources, user }: ResourceListProps) {
    const { toast } = useToast();

    const handleRequest = async (resource: Resource) => {
        if (!user) {
            toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to request a resource." });
            return;
        }

        try {
            await addResourceRequest({
                resourceId: resource.id,
                resourceName: resource.name,
                userId: user.uid,
                userName: user.email || "Unknown User",
                status: "pending"
            });
            toast({
                title: "Request Sent",
                description: `Your request for ${resource.name} has been sent to the admin.`,
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Request Failed",
                description: "Could not send your resource request. Please try again.",
            });
            console.error("Failed to send resource request:", error);
        }
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-6 w-6" />
          <span>Resource Availability</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell className="font-medium">{resource.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={resource.status === "Available" ? "default" : "destructive"}
                    className={resource.status === "Available" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
                  >
                    {resource.status}
                  </Badge>
                </TableCell>
                <TableCell>{resource.location}</TableCell>
                <TableCell className="text-right">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={resource.status !== 'Available'}
                        onClick={() => handleRequest(resource)}
                    >
                        <Send className="mr-2 h-4 w-4" />
                        Request
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
