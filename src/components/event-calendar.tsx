"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Event } from "@/lib/firebase-service";

type EventCalendarProps = {
  events: Event[];
};

export default function EventCalendar({ events }: EventCalendarProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  const eventDates = React.useMemo(() => events.map(e => e.date), [events]);

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
            mode="multiple"
            selected={eventDates}
            onSelect={() => {}} // readonly calendar
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
            {events.length > 0 ? events.map((event) => (
              <li key={event.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-primary">{event.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-xl font-bold">{event.date.getDate()}</span>
                </div>
                <div>
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </li>
            )) : (
              <p className="text-sm text-muted-foreground">No upcoming events.</p>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
