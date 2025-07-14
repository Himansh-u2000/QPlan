"use client";

import { List, Send } from "lucide-react";
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

type Resource = {
  id: number;
  name: string;
  status: "Available" | "Unavailable";
  location: string;
};

type ResourceListProps = {
  resources: Resource[];
};

export default function ResourceList({ resources }: ResourceListProps) {
    const { toast } = useToast();

    const handleRequest = (resourceName: string) => {
        // In a real app, this would trigger a backend process.
        // For now, we just show a confirmation toast.
        toast({
            title: "Request Sent",
            description: `Your request for ${resourceName} has been sent to the admin.`,
        });
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
                        onClick={() => handleRequest(resource.name)}
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
