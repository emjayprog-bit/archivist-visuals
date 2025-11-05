import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";

interface InfoPanelProps {
  architecture: "von-neumann" | "harvard" | "modified-harvard";
}

const architectureInfo = {
  "von-neumann": {
    title: "Von Neumann Architecture",
    description: "Uses a single memory space for both instructions and data, connected via a shared bus.",
    advantages: [
      "Simple design and implementation",
      "Flexible memory allocation",
      "Cost-effective due to single memory unit",
    ],
    disadvantages: [
      "Von Neumann bottleneck (sequential access)",
      "Cannot fetch instruction and data simultaneously",
    ],
  },
  "harvard": {
    title: "Harvard Architecture",
    description: "Uses separate memory spaces and buses for instructions and data, enabling parallel access.",
    advantages: [
      "Simultaneous instruction and data access",
      "Higher performance and throughput",
      "No Von Neumann bottleneck",
    ],
    disadvantages: [
      "More complex and expensive",
      "Fixed memory allocation",
      "Requires more physical space",
    ],
  },
  "modified-harvard": {
    title: "Modified Harvard Architecture",
    description: "Combines features of both architectures with separate caches but shared main memory.",
    advantages: [
      "Balance between performance and complexity",
      "Flexible memory usage",
      "Cache benefits for performance",
    ],
    disadvantages: [
      "Moderate complexity",
      "Cache management overhead",
    ],
  },
};

const InfoPanel = ({ architecture }: InfoPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentInfo = architectureInfo[architecture];

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-1" />
            <h3 className="text-lg font-bold">{currentInfo.title}</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2"
          >
            Info
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-4 animate-accordion-down">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentInfo.description}
            </p>

            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Advantages
              </h4>
              <ul className="space-y-2">
                {currentInfo.advantages.map((advantage, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-destructive" />
                Disadvantages
              </h4>
              <ul className="space-y-2">
                {currentInfo.disadvantages.map((disadvantage, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>{disadvantage}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
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
