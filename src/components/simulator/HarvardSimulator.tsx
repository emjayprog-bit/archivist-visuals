import { useState } from "react";
import { ArrowLeft, Play, Pause, RotateCcw, StepForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CPUComponent from "./components/CPUComponent";
import ControlPanel from "./components/ControlPanel";
import InfoPanel from "./components/InfoPanel";
import DataFlowAnimation from "./components/DataFlowAnimation";
import TaskRecord, { TaskRecordEntry } from "./components/TaskRecord";
import { Database } from "lucide-react";
import { toast } from "sonner";
import type { Instruction, SimulationState } from "./VonNeumannSimulator";

type StepInfo = {
  name: string;
  description: string;
  timeRange: string;
};

interface HarvardSimulatorProps {
  onBack: () => void;
}

type MemoryCell = {
  address: number;
  data: string;
  accessed: boolean;
};

const HarvardSimulator = ({ onBack }: HarvardSimulatorProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<SimulationState>("idle");
  const [stepInfo, setStepInfo] = useState<StepInfo | null>(null);
  const [taskRecords, setTaskRecords] = useState<TaskRecordEntry[]>([]);
  const [instructionMemory, setInstructionMemory] = useState<MemoryCell[]>([
    { address: 0, data: "LOAD R1, 100", accessed: false },
    { address: 1, data: "LOAD R2, 200", accessed: false },
    { address: 2, data: "ADD R3, R1, R2", accessed: false },
    { address: 3, data: "STORE R3, 300", accessed: false },
  ]);
  const [dataMemory, setDataMemory] = useState<MemoryCell[]>([
    { address: 100, data: "42", accessed: false },
    { address: 200, data: "58", accessed: false },
    { address: 300, data: "0", accessed: false },
  ]);
  const [programCounter, setProgramCounter] = useState(0);
  const [currentInstruction, setCurrentInstruction] = useState<Instruction | null>(null);
  const [registers, setRegisters] = useState({ R1: 0, R2: 0, R3: 0 });
  const [dataFlows, setDataFlows] = useState<Array<{ id: string; from: string; to: string; type: "data" | "instruction" }>>([]);

  const addTaskRecord = (stepName: string, description: string, actualTime: number) => {
    const record: TaskRecordEntry = {
      id: `task-${Date.now()}-${Math.random()}`,
      stepName,
      description,
      actualTime,
      timestamp: new Date().toLocaleTimeString(),
    };
    setTaskRecords(prev => [...prev, record]);
  };

  const executeStep = () => {
    const steps: SimulationState[] = ["fetching", "decoding", "executing", "storing"];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentStep === "idle") {
      const totalInstructions = instructionMemory.filter(m => m.data).length;
      if (programCounter >= totalInstructions) {
        setIsPlaying(false);
        toast.success("Program execution complete!");
        return;
      }
      setCurrentStep("fetching");
      setTimeout(() => {
        handleFetch();
        handleFetchData();
      }, 0);
    } else if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
      
      setTimeout(() => {
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
      }, 0);
    } else {
      setCurrentStep("idle");
      const nextPC = programCounter + 1;
      setProgramCounter(nextPC);
      
      const totalInstructions = instructionMemory.filter(m => m.data).length;
      if (isPlaying && nextPC < totalInstructions) {
        setTimeout(() => executeStep(), 600);
      } else if (nextPC >= totalInstructions) {
        setIsPlaying(false);
        toast.success("All instructions executed!");
      }
    }
  };

  const handleFetch = () => {
    const startTime = performance.now();
    
    if (programCounter >= instructionMemory.length) {
      toast.error("Program complete!");
      setIsPlaying(false);
      return;
    }

    const instruction = instructionMemory[programCounter];
    setInstructionMemory(prev => prev.map((m, i) => 
      i === programCounter ? { ...m, accessed: true } : { ...m, accessed: false }
    ));
    
    const parts = instruction.data.split(" ");
    setCurrentInstruction({
      id: `inst-${programCounter}`,
      operation: parts[0],
      operands: parts.slice(1).join("").split(","),
      address: programCounter,
    });

    const actualTime = Math.round(performance.now() - startTime + (40 + Math.random() * 40));
    
    setStepInfo({
      name: "Fetch Instruction",
      description: `Fetching instruction from address ${programCounter}`,
      timeRange: `${actualTime}ms`
    });

    addTaskRecord("Fetch Instruction", `Fetched: ${instruction.data}`, actualTime);
    addDataFlow("instruction-memory", "cpu", "instruction");
    toast.info(`Fetched: ${instruction.data}`);
  };

  const handleFetchData = () => {
    if (!currentInstruction) return;
    const startTime = performance.now();
    
    const { operation, operands } = currentInstruction;
    if (operation === "LOAD" && operands[1]) {
      const addr = parseInt(operands[1]);
      setDataMemory(prev => prev.map(m => 
        m.address === addr ? { ...m, accessed: true } : { ...m, accessed: false }
      ));
      const actualTime = Math.round(performance.now() - startTime + (30 + Math.random() * 30));
      addTaskRecord("Fetch Data (Parallel)", `Fetched data from address ${addr}`, actualTime);
    }
  };

  const handleDecode = () => {
    const startTime = performance.now();
    
    if (currentInstruction) {
      const actualTime = Math.round(performance.now() - startTime + (20 + Math.random() * 20));
      
      setStepInfo({
        name: "Decode",
        description: `Decoding instruction: ${currentInstruction.operation}`,
        timeRange: `${actualTime}ms`
      });
      
      addTaskRecord("Decode", `Decoded ${currentInstruction.operation} instruction`, actualTime);
      toast.info(`Decoding: ${currentInstruction.operation}`);
    }
  };

  const handleExecute = () => {
    const startTime = performance.now();
    
    if (!currentInstruction) return;

    const { operation, operands } = currentInstruction;
    const actualTime = Math.round(performance.now() - startTime + (80 + Math.random() * 70));
    
    setStepInfo({
      name: "Execute",
      description: `Executing ${operation} operation`,
      timeRange: `${actualTime}ms`
    });

    switch (operation) {
      case "LOAD": {
        const reg = operands[0];
        const addr = parseInt(operands[1]);
        const value = parseInt(dataMemory.find(m => m.address === addr)?.data || "0");
        setRegisters(prev => ({ ...prev, [reg]: value }));
        setDataMemory(prev => prev.map(m => m.address === addr ? { ...m, accessed: true } : { ...m, accessed: false }));
        addDataFlow("data-memory", "cpu", "data");
        addTaskRecord("Execute", `LOAD: Loaded ${value} into ${reg} from address ${addr}`, actualTime);
        toast.success(`Loaded ${value} into ${reg}`);
        break;
      }
      case "ADD": {
        const destReg = operands[0];
        const src1 = operands[1];
        const src2 = operands[2];
        const result = registers[src1 as keyof typeof registers] + registers[src2 as keyof typeof registers];
        setRegisters(prev => ({ ...prev, [destReg]: result }));
        addTaskRecord("Execute", `ADD: ${src1} + ${src2} = ${result}, stored in ${destReg}`, actualTime);
        toast.success(`Added ${src1} + ${src2} = ${result}`);
        break;
      }
      case "STORE": {
        const reg = operands[0];
        const addr = parseInt(operands[1]);
        const value = registers[reg as keyof typeof registers];
        setDataMemory(prev => prev.map(m => 
          m.address === addr ? { ...m, data: value.toString(), accessed: true } : m
        ));
        addDataFlow("cpu", "data-memory", "data");
        addTaskRecord("Execute", `STORE: Stored ${value} from ${reg} to address ${addr}`, actualTime);
        toast.success(`Stored ${value} to address ${addr}`);
        break;
      }
    }
  };

  const handleStore = () => {
    const startTime = performance.now();
    const actualTime = Math.round(performance.now() - startTime + (40 + Math.random() * 40));
    
    setStepInfo({
      name: "Store",
      description: "Writing results back to memory/registers",
      timeRange: `${actualTime}ms`
    });
    
    addTaskRecord("Store", "Instruction cycle complete, results written back", actualTime);
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
    setInstructionMemory(prev => prev.map(m => ({ ...m, accessed: false })));
    setDataMemory(prev => prev.map(m => ({ ...m, accessed: false })));
    setDataFlows([]);
    setTaskRecords([]);
    toast.success("Simulation reset");
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      executeStep();
    }
  };

  const handleLoadInstructions = (instructions: string[]) => {
    const startIndex = instructionMemory.filter(cell => cell.data).length;
    const newInstructions = instructions.map((inst, idx) => ({
      address: startIndex + idx,
      data: inst,
      accessed: false,
    }));
    
    setInstructionMemory(prev => [...prev.filter(m => m.data), ...newInstructions]);
    if (programCounter === 0 && instructionMemory.filter(m => m.data).length === 0) {
      setProgramCounter(0);
    }
  };

  const handleResetInstructions = () => {
    setInstructionMemory([]);
    setProgramCounter(0);
    setCurrentStep("idle");
    setIsPlaying(false);
    setCurrentInstruction(null);
    toast.success("Instructions cleared");
  };

  const handleLoadMemory = (address: number, value: number) => {
    setDataMemory(prev => {
      const existing = prev.find(m => m.address === address);
      if (existing) {
        return prev.map(m => m.address === address ? { ...m, data: value.toString() } : m);
      } else {
        return [...prev, { address, data: value.toString(), accessed: false }];
      }
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background to-memory-bg">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Selection
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Harvard Architecture
          </h1>
          <div className="w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-gradient-card border-border relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-glow opacity-30" />
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-6">Architecture Visualization</h2>
                
                <div className="space-y-6">
                  <CPUComponent 
                    isActive={currentStep === "executing" || currentStep === "decoding"}
                    registers={registers}
                    currentInstruction={currentInstruction}
                  />

                  <DataFlowAnimation flows={dataFlows} />

                  <div className="grid grid-cols-2 gap-4">
                    <Card className={`p-4 bg-instruction-flow/10 border-2 transition-all ${
                      currentStep === "fetching" ? "border-instruction-flow shadow-glow" : "border-border"
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Database className="w-5 h-5 text-instruction-flow" />
                        <h3 className="font-bold text-sm">Instruction Memory</h3>
                      </div>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {instructionMemory.map((cell, idx) => (
                          <div key={idx} className={`text-xs font-mono p-2 rounded transition-all ${
                            cell.accessed ? "bg-instruction-flow/20" : "bg-background/50"
                          } ${idx === programCounter ? "ring-2 ring-primary" : ""}`}>
                            <span className="text-muted-foreground">{cell.address}:</span> {cell.data}
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className={`p-4 bg-data-flow/10 border-2 transition-all ${
                      currentStep === "executing" || currentStep === "storing" ? "border-data-flow shadow-glow" : "border-border"
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Database className="w-5 h-5 text-data-flow" />
                        <h3 className="font-bold text-sm">Data Memory</h3>
                      </div>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {dataMemory.map((cell, idx) => (
                          <div key={idx} className={`text-xs font-mono p-2 rounded transition-all ${
                            cell.accessed ? "bg-data-flow/20" : "bg-background/50"
                          }`}>
                            <span className="text-muted-foreground">{cell.address}:</span> {cell.data}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <div className="text-center text-xs text-muted-foreground py-2 bg-bus-bg rounded">
                    Separate Buses: Instruction Bus | Data Bus
                  </div>
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

                {stepInfo && (
                  <div className="mt-4">
                    <Card className="p-4 bg-cpu-bg border-primary/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-primary">{stepInfo.name}</span>
                        <span className="text-xs text-muted-foreground">{stepInfo.timeRange}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{stepInfo.description}</p>
                    </Card>
                  </div>
                )}
              </div>
            </Card>

          <ControlPanel 
            onLoadInstructions={handleLoadInstructions}
            onLoadMemory={handleLoadMemory}
            onResetInstructions={handleResetInstructions}
          />
          </div>

          <div className="space-y-6">
            <TaskRecord records={taskRecords} />
            <InfoPanel architecture="harvard" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HarvardSimulator;
