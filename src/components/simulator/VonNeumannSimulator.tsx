import { useState } from "react";
import { ArrowLeft, Play, Pause, RotateCcw, StepForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CPUComponent from "./components/CPUComponent";
import MemoryComponent from "./components/MemoryComponent";
import ControlPanel from "./components/ControlPanel";
import InfoPanel from "./components/InfoPanel";
import DataFlowAnimation from "./components/DataFlowAnimation";
import { toast } from "sonner";

interface VonNeumannSimulatorProps {
  onBack: () => void;
}

export type Instruction = {
  id: string;
  operation: string;
  operands: string[];
  address: number;
};

export type MemoryCell = {
  address: number;
  data: string;
  type: "instruction" | "data";
  accessed: boolean;
};

export type SimulationState = "idle" | "fetching" | "decoding" | "executing" | "storing";

const VonNeumannSimulator = ({ onBack }: VonNeumannSimulatorProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<SimulationState>("idle");
  const [memory, setMemory] = useState<MemoryCell[]>([
    { address: 0, data: "LOAD R1, 100", type: "instruction", accessed: false },
    { address: 1, data: "LOAD R2, 200", type: "instruction", accessed: false },
    { address: 2, data: "ADD R3, R1, R2", type: "instruction", accessed: false },
    { address: 3, data: "STORE R3, 300", type: "instruction", accessed: false },
    { address: 100, data: "42", type: "data", accessed: false },
    { address: 200, data: "58", type: "data", accessed: false },
    { address: 300, data: "0", type: "data", accessed: false },
  ]);
  const [programCounter, setProgramCounter] = useState(0);
  const [currentInstruction, setCurrentInstruction] = useState<Instruction | null>(null);
  const [registers, setRegisters] = useState({ R1: 0, R2: 0, R3: 0 });
  const [dataFlows, setDataFlows] = useState<Array<{ id: string; from: string; to: string; type: "data" | "instruction" }>>([]);

  const executeStep = () => {
    const steps: SimulationState[] = ["fetching", "decoding", "executing", "storing"];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentStep === "idle") {
      setCurrentStep("fetching");
      handleFetch();
    } else if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
      
      switch (nextStep) {
        case "decoding":
          handleDecode();
          break;
        case "executing":
          handleExecute();
          break;
        case "storing":
          handleStore();
          break;
      }
    } else {
      setCurrentStep("idle");
      setProgramCounter(prev => prev + 1);
    }
  };

  const handleFetch = () => {
    if (programCounter >= memory.filter(m => m.type === "instruction").length) {
      toast.error("Program complete!");
      setIsPlaying(false);
      return;
    }

    const instruction = memory[programCounter];
    setMemory(prev => prev.map(m => 
      m.address === programCounter ? { ...m, accessed: true } : { ...m, accessed: false }
    ));
    
    const parts = instruction.data.split(" ");
    setCurrentInstruction({
      id: `inst-${programCounter}`,
      operation: parts[0],
      operands: parts.slice(1).join("").split(","),
      address: programCounter,
    });

    addDataFlow("memory", "cpu", "instruction");
    toast.info(`Fetched: ${instruction.data}`);
  };

  const handleDecode = () => {
    if (currentInstruction) {
      toast.info(`Decoding: ${currentInstruction.operation}`);
    }
  };

  const handleExecute = () => {
    if (!currentInstruction) return;

    const { operation, operands } = currentInstruction;
    
    switch (operation) {
      case "LOAD": {
        const reg = operands[0];
        const addr = parseInt(operands[1]);
        const value = parseInt(memory.find(m => m.address === addr)?.data || "0");
        setRegisters(prev => ({ ...prev, [reg]: value }));
        addDataFlow("memory", "cpu", "data");
        toast.success(`Loaded ${value} into ${reg}`);
        break;
      }
      case "ADD": {
        const destReg = operands[0];
        const src1 = operands[1];
        const src2 = operands[2];
        const result = registers[src1 as keyof typeof registers] + registers[src2 as keyof typeof registers];
        setRegisters(prev => ({ ...prev, [destReg]: result }));
        toast.success(`Added ${src1} + ${src2} = ${result}`);
        break;
      }
      case "STORE": {
        const reg = operands[0];
        const addr = parseInt(operands[1]);
        const value = registers[reg as keyof typeof registers];
        setMemory(prev => prev.map(m => 
          m.address === addr ? { ...m, data: value.toString(), accessed: true } : m
        ));
        addDataFlow("cpu", "memory", "data");
        toast.success(`Stored ${value} to address ${addr}`);
        break;
      }
    }
  };

  const handleStore = () => {
    toast.info("Instruction cycle complete");
  };

  const addDataFlow = (from: string, to: string, type: "data" | "instruction") => {
    const id = `flow-${Date.now()}`;
    setDataFlows(prev => [...prev, { id, from, to, type }]);
    setTimeout(() => {
      setDataFlows(prev => prev.filter(f => f.id !== id));
    }, 1500);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep("idle");
    setProgramCounter(0);
    setCurrentInstruction(null);
    setRegisters({ R1: 0, R2: 0, R3: 0 });
    setMemory(prev => prev.map(m => ({ ...m, accessed: false })));
    setDataFlows([]);
    toast.success("Simulation reset");
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      executeStep();
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background to-cpu-bg">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Selection
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Von Neumann Architecture
          </h1>
          <div className="w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-gradient-card border-border relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-glow opacity-30" />
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-6">Architecture Visualization</h2>
                
                <div className="space-y-8">
                  <CPUComponent 
                    isActive={currentStep === "executing" || currentStep === "decoding"}
                    registers={registers}
                    currentInstruction={currentInstruction}
                  />

                  <DataFlowAnimation flows={dataFlows} />

                  <div className="relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border" />
                    <div className="text-center text-xs text-muted-foreground py-2 bg-bus-bg rounded">
                      Shared Bus (Data & Instructions)
                    </div>
                  </div>

                  <MemoryComponent 
                    memory={memory}
                    isActive={currentStep === "fetching" || currentStep === "storing"}
                    programCounter={programCounter}
                  />
                </div>

                <div className="mt-6 flex items-center justify-center gap-3">
                  <Button onClick={togglePlay} variant={isPlaying ? "destructive" : "default"}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button onClick={executeStep} variant="outline" disabled={isPlaying}>
                    <StepForward className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleReset} variant="outline">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-cpu-bg rounded-lg">
                    <span className="text-sm font-medium">Current Step:</span>
                    <span className="text-sm text-primary capitalize">{currentStep}</span>
                  </div>
                </div>
              </div>
            </Card>

            <ControlPanel />
          </div>

          <div className="space-y-6">
            <InfoPanel architecture="von-neumann" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VonNeumannSimulator;
