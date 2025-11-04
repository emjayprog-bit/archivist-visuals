import { Card } from "@/components/ui/card";
import { Database } from "lucide-react";
import { MemoryCell } from "../VonNeumannSimulator";

interface MemoryComponentProps {
  memory: MemoryCell[];
  isActive: boolean;
  programCounter: number;
}

const MemoryComponent = ({ memory, isActive, programCounter }: MemoryComponentProps) => {
  return (
    <Card className={`p-6 bg-memory-bg border-2 transition-all duration-300 ${
      isActive ? "border-memory-active shadow-glow animate-pulse-glow" : "border-border"
    }`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${isActive ? "bg-memory-active/20" : "bg-background/50"}`}>
          <Database className={`w-8 h-8 ${isActive ? "text-memory-active" : "text-accent"}`} />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-bold mb-2">Memory Unit</h3>
            <p className="text-sm text-muted-foreground">
              Stores both instructions and data
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Address</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Data</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Type</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {memory.map((cell) => (
                  <tr 
                    key={cell.address}
                    className={`border-b border-border/50 transition-all ${
                      cell.accessed ? "bg-memory-active/20" : ""
                    } ${
                      cell.address === programCounter && cell.type === "instruction" ? "bg-primary/20" : ""
                    }`}
                  >
                    <td className="py-2 px-3 font-mono">{cell.address}</td>
                    <td className="py-2 px-3 font-mono text-accent">{cell.data}</td>
                    <td className="py-2 px-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        cell.type === "instruction" 
                          ? "bg-instruction-flow/20 text-instruction-flow" 
                          : "bg-data-flow/20 text-data-flow"
                      }`}>
                        {cell.type}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      {cell.address === programCounter && cell.type === "instruction" && (
                        <span className="text-xs text-primary">← PC</span>
                      )}
                      {cell.accessed && (
                        <span className="text-xs text-memory-active">✓ Accessed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MemoryComponent;
