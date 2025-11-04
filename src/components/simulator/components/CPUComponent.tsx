import { Card } from "@/components/ui/card";
import { Cpu } from "lucide-react";
import { Instruction } from "../VonNeumannSimulator";

interface CPUComponentProps {
  isActive: boolean;
  registers: Record<string, number>;
  currentInstruction: Instruction | null;
}

const CPUComponent = ({ isActive, registers, currentInstruction }: CPUComponentProps) => {
  return (
    <Card className={`p-6 bg-cpu-bg border-2 transition-all duration-300 ${
      isActive ? "border-cpu-active shadow-glow animate-pulse-glow" : "border-border"
    }`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${isActive ? "bg-cpu-active/20" : "bg-background/50"}`}>
          <Cpu className={`w-8 h-8 ${isActive ? "text-cpu-active" : "text-primary"}`} />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-bold mb-2">Central Processing Unit</h3>
            <p className="text-sm text-muted-foreground">
              Processes instructions and performs calculations
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-primary">Registers</h4>
              {Object.entries(registers).map(([name, value]) => (
                <div key={name} className="flex justify-between items-center p-2 bg-background/30 rounded">
                  <span className="text-sm font-mono">{name}:</span>
                  <span className="text-sm font-mono text-accent">{value}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-primary">ALU</h4>
              <div className="p-3 bg-background/30 rounded">
                <p className="text-xs text-muted-foreground">Arithmetic Logic Unit</p>
                {currentInstruction && (
                  <p className="text-sm font-mono mt-2 text-accent">
                    {currentInstruction.operation}
                  </p>
                )}
              </div>
            </div>
          </div>

          {currentInstruction && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/30">
              <p className="text-xs text-muted-foreground mb-1">Current Instruction:</p>
              <p className="text-sm font-mono text-primary">
                {currentInstruction.operation} {currentInstruction.operands.join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CPUComponent;
