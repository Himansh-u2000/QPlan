import { List } from "lucide-react";
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

const resources = [
  { name: "Quantum Rig A-1", status: "Available", location: "Lab 3" },
  { name: "Supercomputer Cygnus", status: "Unavailable", location: "Data Center" },
  { name: "VR/AR Development Kit", status: "Available", location: "Innovation Hub" },
  { name: "High-Res 3D Printer", status: "Available", location: "Maker Space" },
  { name: "Bio-Sequencer Z-9", status: "Unavailable", location: "BioLab 1" },
];

export default function ResourceList() {
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.name}>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
