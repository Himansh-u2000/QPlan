import { CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

const events = [
  {
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    title: "AI & The Future of Work",
    description: "A seminar on the impact of AI on various industries.",
  },
  {
    date: new Date(new Date().setDate(new Date().getDate() + 7)),
    title: "Quantum Computing Symposium",
    description: "Deep dive into quantum algorithms and hardware.",
  },
  {
    date: new Date(new Date().setDate(new Date().getDate() + 15)),
    title: "Web3 Developer Meetup",
    description: "Networking and talks on decentralized applications.",
  },
];

export default function EventCalendar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6" />
          <span>Event Calendar</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div>
          <Calendar
            mode="single"
            selected={new Date()}
            className="rounded-md border"
            classNames={{
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground rounded-md",
            }}
          />
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Upcoming Events</h3>
          <ul className="space-y-3">
            {events.map((event, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-primary">{event.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-xl font-bold">{event.date.getDate()}</span>
                </div>
                <div>
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
