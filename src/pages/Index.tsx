import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cpu, Database, GitBranch } from "lucide-react";
import VonNeumannSimulator from "@/components/simulator/VonNeumannSimulator";
import HarvardSimulator from "@/components/simulator/HarvardSimulator";
import ModifiedHarvardSimulator from "@/components/simulator/ModifiedHarvardSimulator";

type Architecture = "selection" | "von-neumann" | "harvard" | "modified-harvard";

const Index = () => {
  const [selectedArchitecture, setSelectedArchitecture] = useState<Architecture>("selection");

  const renderContent = () => {
    switch (selectedArchitecture) {
      case "von-neumann":
        return <VonNeumannSimulator onBack={() => setSelectedArchitecture("selection")} />;
      case "harvard":
        return <HarvardSimulator onBack={() => setSelectedArchitecture("selection")} />;
      case "modified-harvard":
        return <ModifiedHarvardSimulator onBack={() => setSelectedArchitecture("selection")} />;
      default:
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background via-background to-cpu-bg">
            <div className="text-center mb-12 animate-slide-in">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                Computer Architecture Simulator
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explore and understand how different computer architectures process data and instructions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
              <Card
                className="p-8 bg-gradient-card border-border hover:border-primary transition-all duration-300 cursor-pointer group hover:shadow-glow"
                onClick={() => setSelectedArchitecture("von-neumann")}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-cpu-bg rounded-full group-hover:bg-primary/20 transition-colors">
                    <Cpu className="w-12 h-12 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Von Neumann</h2>
                  <p className="text-muted-foreground">
                    Single memory for both data and instructions with a shared bus architecture
                  </p>
                  <Button variant="outline" className="mt-4 w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Explore →
                  </Button>
                </div>
              </Card>

              <Card
                className="p-8 bg-gradient-card border-border hover:border-accent transition-all duration-300 cursor-pointer group hover:shadow-glow"
                onClick={() => setSelectedArchitecture("harvard")}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-memory-bg rounded-full group-hover:bg-accent/20 transition-colors">
                    <Database className="w-12 h-12 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold">Harvard</h2>
                  <p className="text-muted-foreground">
                    Separate memory and buses for data and instructions, enabling parallel access
                  </p>
                  <Button variant="outline" className="mt-4 w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    Explore →
                  </Button>
                </div>
              </Card>

              <Card
                className="p-8 bg-gradient-card border-border hover:border-instruction-flow transition-all duration-300 cursor-pointer group hover:shadow-glow"
                onClick={() => setSelectedArchitecture("modified-harvard")}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-bus-bg rounded-full group-hover:bg-instruction-flow/20 transition-colors">
                    <GitBranch className="w-12 h-12 text-instruction-flow" />
                  </div>
                  <h2 className="text-2xl font-bold">Modified Harvard</h2>
                  <p className="text-muted-foreground">
                    Hybrid approach combining benefits of both architectures with flexible memory access
                  </p>
                  <Button variant="outline" className="mt-4 w-full group-hover:bg-instruction-flow group-hover:text-background transition-colors">
                    Explore →
                  </Button>
                </div>
              </Card>
            </div>

            <div className="mt-12 text-center text-sm text-muted-foreground max-w-2xl">
              <p>
                Click on any architecture to start an interactive simulation. Watch data flow through components,
                execute instructions step-by-step, and learn how computers process information.
              </p>
            </div>
          </div>
        );
    }
  };

  return <div className="min-h-screen bg-background">{renderContent()}</div>;
};

export default Index;
