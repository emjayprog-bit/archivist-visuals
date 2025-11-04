import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ModifiedHarvardSimulatorProps {
  onBack: () => void;
}

const ModifiedHarvardSimulator = ({ onBack }: ModifiedHarvardSimulatorProps) => {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background to-bus-bg">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Selection
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Modified Harvard Architecture
          </h1>
          <div className="w-32" />
        </div>

        <Card className="p-12 bg-gradient-card border-border">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Coming Soon</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Modified Harvard Architecture simulator combining features of both Von Neumann and Harvard architectures is under development.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ModifiedHarvardSimulator;
