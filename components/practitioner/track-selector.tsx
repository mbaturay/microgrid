"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrackType } from "@/lib/model/types";

const TRACKS: { id: TrackType; title: string; description: string }[] = [
  {
    id: "track-1",
    title: "Track 1 · End-of-Life Decision",
    description: "Evaluate refresh vs. replacement pathways.",
  },
  {
    id: "track-2",
    title: "Track 2 · Fully Off-Grid Facility",
    description: "Model full resilience and islanding strategy.",
  },
  {
    id: "track-3",
    title: "Track 3 · Isolate Critical Loads",
    description: "Prioritize essential circuits and phased loads.",
  },
];

export default function TrackSelector({
  value,
  onChange,
  disabled = false,
}: {
  value: TrackType;
  onChange: (track: TrackType) => void;
  disabled?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Track Selection</CardTitle>
          <Badge className="bg-sun/20 text-ink">Required</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        {TRACKS.map((track) => (
          <button
            key={track.id}
            onClick={() => !disabled && onChange(track.id)}
            className={cn(
              "rounded-2xl border border-ink/10 p-4 text-left transition",
              value === track.id
                ? "border-jade/50 bg-jade/10"
                : "bg-white hover:border-ink/20",
              disabled && "cursor-not-allowed opacity-60"
            )}
            disabled={disabled}
          >
            <p className="font-medium text-ink">{track.title}</p>
            <p className="text-sm text-ink/60">{track.description}</p>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
