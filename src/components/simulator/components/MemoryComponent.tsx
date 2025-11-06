import { Card } from "@/components/ui/card";
import { Database } from "lucide-react";
import { MemoryCell } from "../VonNeumannSimulator";

interface MemoryComponentProps {
  memory: MemoryCell[];
  isActive: boolean;
  programCounter: number;
  unified?: boolean;
}

const MemoryComponent = ({ memory, isActive, programCounter, unified = false }: MemoryComponentProps) => {
  const instructions = memory.filter(cell => cell.type === "instruction").sort((a, b) => a.address - b.address);
  const data = memory.filter(cell => cell.type === "data").sort((a, b) => a.address - b.address);
  const allMemory = [...memory].sort((a, b) => a.address - b.address);

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
              {unified ? "Single unified memory for instructions and data" : "Stores both instructions and data"}
            </p>
          </div>

          {unified ? (
            /* Unified Memory Table for Von Neumann */
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Address</th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Type</th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Content</th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allMemory.map((cell) => (
                      <tr 
                        key={cell.address}
                        className={`border-b border-border/50 transition-all ${
                          cell.accessed ? "bg-memory-active/20" : ""
                        } ${
                          cell.address === programCounter ? "bg-primary/20" : ""
                        }`}
                      >
                        <td className="py-2 px-2 font-mono text-xs">{cell.address}</td>
                        <td className="py-2 px-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            cell.type === "instruction" 
                              ? "bg-instruction-flow/20 text-instruction-flow" 
                              : "bg-data-flow/20 text-data-flow"
                          }`}>
                            {cell.type}
                          </span>
                        </td>
                        <td className={`py-2 px-2 font-mono text-xs ${
                          cell.type === "instruction" ? "text-instruction-flow" : "text-data-flow"
                        }`}>
                          {cell.data}
                        </td>
                        <td className="py-2 px-2">
                          {cell.address === programCounter && cell.type === "instruction" && (
                            <span className="text-xs text-primary">← PC</span>
                          )}
                          {cell.accessed && (
                            <span className="text-xs text-memory-active ml-2">✓</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Split Tables for Harvard/Modified Harvard */
            <div className="grid grid-cols-2 gap-4">
              {/* Instructions Table */}
              <div>
                <h4 className="text-sm font-semibold mb-2 text-instruction-flow">Instructions</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Addr</th>
                        <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Operation</th>
                        <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {instructions.map((cell) => (
                        <tr 
                          key={cell.address}
                          className={`border-b border-border/50 transition-all ${
                            cell.accessed ? "bg-memory-active/20" : ""
                          } ${
                            cell.address === programCounter ? "bg-primary/20" : ""
                          }`}
                        >
                          <td className="py-2 px-2 font-mono text-xs">{cell.address}</td>
                          <td className="py-2 px-2 font-mono text-xs text-instruction-flow">{cell.data}</td>
                          <td className="py-2 px-2">
                            {cell.address === programCounter && (
                              <span className="text-xs text-primary">← PC</span>
                            )}
                            {cell.accessed && (
                              <span className="text-xs text-memory-active">✓</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data Table */}
              <div>
                <h4 className="text-sm font-semibold mb-2 text-data-flow">Data</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Addr</th>
                        <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Value</th>
                        <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((cell) => (
                        <tr 
                          key={cell.address}
                          className={`border-b border-border/50 transition-all ${
                            cell.accessed ? "bg-memory-active/20" : ""
                          }`}
                        >
                          <td className="py-2 px-2 font-mono text-xs">{cell.address}</td>
                          <td className="py-2 px-2 font-mono text-xs text-data-flow">{cell.data}</td>
                          <td className="py-2 px-2">
                            {cell.accessed && (
                              <span className="text-xs text-memory-active">✓</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MemoryComponent;
