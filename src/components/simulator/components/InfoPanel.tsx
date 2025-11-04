import { Card } from "@/components/ui/card";
import { Info, CheckCircle2, XCircle } from "lucide-react";

interface InfoPanelProps {
  architecture: "von-neumann" | "harvard" | "modified-harvard";
}

const InfoPanel = ({ architecture }: InfoPanelProps) => {
  const getArchitectureInfo = () => {
    switch (architecture) {
      case "von-neumann":
        return {
          title: "Von Neumann Architecture",
          description: "A computer architecture where program instructions and data share the same memory and communication pathways.",
          advantages: [
            "Simpler design and implementation",
            "Cost-effective with single memory system",
            "Flexible memory allocation",
            "Easier to program and modify"
          ],
          disadvantages: [
            "Von Neumann bottleneck (shared bus)",
            "Cannot fetch instruction and data simultaneously",
            "Lower performance for parallel operations",
            "Bus contention between instruction and data access"
          ]
        };
      case "harvard":
        return {
          title: "Harvard Architecture",
          description: "A computer architecture with physically separate storage and pathways for instructions and data.",
          advantages: [
            "Parallel instruction and data access",
            "Higher performance potential",
            "No bus contention",
            "Better for real-time applications"
          ],
          disadvantages: [
            "More complex hardware design",
            "Higher cost due to dual memory systems",
            "Fixed memory allocation",
            "More difficult to program"
          ]
        };
      default:
        return {
          title: "Modified Harvard Architecture",
          description: "A hybrid architecture combining benefits of both Von Neumann and Harvard designs.",
          advantages: [
            "Flexible memory access",
            "Performance benefits of Harvard",
            "Simplicity of Von Neumann",
            "Cache optimization"
          ],
          disadvantages: [
            "Moderate complexity",
            "Cache management overhead",
            "Potential cache coherency issues",
            "Still has some bottleneck concerns"
          ]
        };
    }
  };

  const info = getArchitectureInfo();

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card border-border">
        <div className="flex items-start gap-3 mb-4">
          <Info className="w-5 h-5 text-primary mt-1" />
          <div>
            <h3 className="text-lg font-bold mb-2">{info.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {info.description}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-card border-border">
        <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-accent" />
          Advantages
        </h4>
        <ul className="space-y-2">
          {info.advantages.map((advantage, index) => (
            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>{advantage}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6 bg-gradient-card border-border">
        <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
          <XCircle className="w-4 h-4 text-destructive" />
          Disadvantages
        </h4>
        <ul className="space-y-2">
          {info.disadvantages.map((disadvantage, index) => (
            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-destructive mt-1">•</span>
              <span>{disadvantage}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6 bg-gradient-card border-border">
        <h4 className="text-sm font-bold mb-3">Instruction Cycle</h4>
        <div className="space-y-2">
          {["Fetch", "Decode", "Execute", "Store"].map((step, index) => (
            <div key={step} className="flex items-center gap-3 p-2 bg-background/30 rounded">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <span className="text-sm font-medium">{step}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default InfoPanel;
