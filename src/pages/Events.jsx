import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isSameMonth, addMonths, subMonths, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, MapPin, Clock, ExternalLink, Wifi, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EVENT_TYPES = {
  networking: { label: "Networking", color: "bg-blue-100 text-blue-700 border-blue-200" },
  workshop: { label: "Workshop", color: "bg-purple-100 text-purple-700 border-purple-200" },
  seminar: { label: "Seminar", color: "bg-green-100 text-green-700 border-green-200" },
  government: { label: "Government", color: "bg-amber-100 text-amber-700 border-amber-200" },
  other: { label: "Other", color: "bg-gray-100 text-gray-700 border-gray-200" },
};

const DOT_COLORS = {
  networking: "bg-blue-500",
  workshop: "bg-purple-500",
  seminar: "bg-green-500",
  government: "bg-amber-500",
  other: "bg-gray-400",
};

export default function Events() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: () => base44.entities.Event.list("-date"),
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart); // 0 = Sunday

  const filteredEvents = useMemo(() =>
    events.filter(e => filterType === "all" || e.event_type === filterType),
    [events, filterType]
  );

  const eventsOnDay = (day) =>
    filteredEvents.filter(e => e.date && isSameDay(parseISO(e.date), day));

  const selectedEvents = selectedDate
    ? eventsOnDay(selectedDate)
    : filteredEvents.filter(e => {
        if (!e.date) return false;
        const d = parseISO(e.date);
        return isSameMonth(d, currentMonth);
      }).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-3">
          Local Business Events
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Networking mixers, SBA workshops, permit clinics, and more — all happening in Indian River County.
        </p>
      </motion.div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilterType("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${filterType === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary"}`}
        >
          All Events
        </button>
        {Object.entries(EVENT_TYPES).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setFilterType(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${filterType === key ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary"}`}
          >
            {val.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
            {/* Month nav */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="font-heading text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7">
              {Array.from({ length: startPadding }).map((_, i) => (
                <div key={`pad-${i}`} className="h-16 border-b border-r border-border/50" />
              ))}
              {calendarDays.map((day, i) => {
                const dayEvents = eventsOnDay(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(isSelected ? null : day)}
                    className={`h-16 border-b border-r border-border/50 p-1.5 text-left hover:bg-muted/50 transition-colors relative ${isSelected ? "bg-primary/5" : ""}`}
                  >
                    <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-accent text-white" : isSelected ? "bg-primary text-primary-foreground" : "text-foreground"}`}>
                      {format(day, "d")}
                    </span>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">
                      {dayEvents.slice(0, 3).map((e, j) => (
                        <span key={j} className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[e.event_type] || "bg-gray-400"}`} />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 px-1">
            {Object.entries(EVENT_TYPES).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`w-2 h-2 rounded-full ${DOT_COLORS[key]}`} />
                {val.label}
              </div>
            ))}
          </div>
        </div>

        {/* Event list */}
        <div className="lg:col-span-2">
          <h3 className="font-semibold text-foreground mb-4">
            {selectedDate ? format(selectedDate, "EEEE, MMMM d") : format(currentMonth, "MMMM yyyy")} Events
            {selectedDate && (
              <button onClick={() => setSelectedDate(null)} className="ml-2 text-xs text-muted-foreground underline font-normal">clear</button>
            )}
          </h3>

          {selectedEvents.length === 0 ? (
            <div className="bg-card rounded-xl border p-8 text-center">
              <p className="text-muted-foreground text-sm">No events {selectedDate ? "on this day" : "this month"}.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {selectedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }) {
  const typeInfo = EVENT_TYPES[event.event_type] || EVENT_TYPES.other;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border p-4 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-semibold text-foreground text-sm leading-snug">{event.title}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium whitespace-nowrap ${typeInfo.color}`}>
          {typeInfo.label}
        </span>
      </div>

      {event.date && (
        <p className="text-xs text-muted-foreground mb-1 font-medium">
          {format(parseISO(event.date), "EEE, MMM d")}
          {event.start_time && ` · ${event.start_time}`}
          {event.end_time && ` – ${event.end_time}`}
        </p>
      )}

      {event.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
      )}

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {event.location && (
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
        )}
        {event.is_virtual && (
          <span className="flex items-center gap-1"><Wifi className="w-3 h-3" />Virtual</span>
        )}
        {event.organizer && (
          <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{event.organizer}</span>
        )}
        {!event.is_free && event.cost && (
          <span className="flex items-center gap-1 text-accent font-medium">{event.cost}</span>
        )}
        {event.is_free && (
          <span className="text-green-600 font-medium">Free</span>
        )}
      </div>

      {event.registration_url && (
        <a
          href={event.registration_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Register <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </motion.div>
  );
}