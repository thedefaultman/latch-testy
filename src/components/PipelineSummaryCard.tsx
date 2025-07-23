import { Card, CardContent } from "@/components/ui/card";

export function PipelineSummaryCard({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <Card className="bg-background border border-border shadow flex flex-col items-center justify-center p-6">
      <CardContent className="flex flex-col items-center justify-center">
        <div className="mb-2 text-3xl">{icon}</div>
        <div className="text-2xl font-bold mb-1 text-foreground">{value}</div>
        <div className="text-xs text-foreground/70 text-center">{label}</div>
      </CardContent>
    </Card>
  );
} 