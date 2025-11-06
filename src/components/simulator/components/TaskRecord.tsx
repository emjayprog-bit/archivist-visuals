import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";

export type TaskRecordEntry = {
  id: string;
  stepName: string;
  description: string;
  actualTime: number;
  timestamp: string;
};

interface TaskRecordProps {
  records: TaskRecordEntry[];
}

const TaskRecord = ({ records }: TaskRecordProps) => {
  return (
    <Card className="p-4 bg-gradient-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold">Task Record</h3>
      </div>
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {records.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No tasks recorded yet. Start simulation to see records.
            </p>
          ) : (
            records.map((record) => (
              <Card key={record.id} className="p-3 bg-background/50 border-border/50">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-bold text-primary">{record.stepName}</span>
                  <span className="text-xs text-accent font-mono">{record.actualTime}ms</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{record.description}</p>
                <span className="text-xs text-muted-foreground/70">{record.timestamp}</span>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default TaskRecord;
