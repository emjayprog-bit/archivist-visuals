import { useState } from "react";
import { ArrowLeft, Play, Pause, RotateCcw, StepForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CPUComponent from "./components/CPUComponent";
import MemoryComponent from "./components/MemoryComponent";
import ControlPanel from "./components/ControlPanel";
import InfoPanel from "./components/InfoPanel";
import DataFlowAnimation from "./components/DataFlowAnimation";
import TaskRecord, { TaskRecordEntry } from "./components/TaskRecord";
import { Database } from "lucide-react";
import { toast } from "sonner";
import type { Instruction, MemoryCell, SimulationState } from "./VonNeumannSimulator";

type StepInfo = {
  name: string;
  description: string;
  timeRange: string;
};

interface ModifiedHarvardSimulatorProps {
  onBack: () => void;
}

const ModifiedHarvardSimulator = ({ onBack }: ModifiedHarvardSimulatorProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<SimulationState>("idle");
  const [stepInfo, setStepInfo] = useState<StepInfo | null>(null);
  const [taskRecords, setTaskRecords] = useState<TaskRecordEntry[]>([]);
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
  const [cacheEnabled, setCacheEnabled] = useState(true);

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
    const steps: SimulationState[] = ["fetching", "decoding", "fetch-operand", "executing", "storing"];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentStep === "idle") {
      const totalInstructions = memory.filter(m => m.type === "instruction").length;
      if (programCounter >= totalInstructions) {
        setIsPlaying(false);
        toast.success("Program execution complete!");
        return;
      }
      setCurrentStep("fetching");
      setTimeout(() => handleFetch(), 0);
    } else if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
      
      setTimeout(() => {
        switch (nextStep) {
          case "decoding":
            handleDecode();
            break;
          case "fetch-operand":
            handleFetchOperand();
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
      
      const totalInstructions = memory.filter(m => m.type === "instruction").length;
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

    const actualTime = cacheEnabled 
      ? Math.round(performance.now() - startTime + (20 + Math.random() * 20))
      : Math.round(performance.now() - startTime + (50 + Math.random() * 50));
    
    setStepInfo({
      name: "Fetch Instruction",
      description: cacheEnabled 
        ? `Fetching from instruction cache (address ${programCounter})`
        : `Fetching from memory (address ${programCounter})`,
      timeRange: `${actualTime}ms`
    });

    addTaskRecord(
      "Fetch Instruction", 
      cacheEnabled ? `Cache hit: ${instruction.data}` : `Fetched: ${instruction.data}`,
      actualTime
    );
    addDataFlow("memory", "cpu", "instruction");
    
    if (cacheEnabled) {
      toast.info(`Fetched from cache: ${instruction.data}`);
    } else {
      toast.info(`Fetched: ${instruction.data}`);
    }
  };

  const handleDecode = () => {
    const startTime = performance.now();
    
    if (currentInstruction) {
      const actualTime = Math.round(performance.now() - startTime + (25 + Math.random() * 20));
      
      setStepInfo({
        name: "Decode",
        description: `Decoding instruction: ${currentInstruction.operation}`,
        timeRange: `${actualTime}ms`
      });
      
      addTaskRecord("Decode", `Decoded ${currentInstruction.operation} instruction`, actualTime);
      toast.info(`Decoding: ${currentInstruction.operation}`);
    }
  };

  const handleFetchOperand = () => {
    const startTime = performance.now();
    
    if (currentInstruction) {
      const actualTime = cacheEnabled
        ? Math.round(performance.now() - startTime + (20 + Math.random() * 20))
        : Math.round(performance.now() - startTime + (40 + Math.random() * 30));
      
      const { operation, operands } = currentInstruction;
      
      let description = "Fetching operands";
      if (operation === "LOAD" && operands[1]) {
        const addr = parseInt(operands[1]);
        description = cacheEnabled 
          ? `Fetching data from cache (address ${addr})`
          : `Fetching data from memory (address ${addr})`;
        setMemory(prev => prev.map(m => 
          m.address === addr ? { ...m, accessed: true } : m
        ));
        addDataFlow("memory", "cpu", "data");
      }
      
      setStepInfo({
        name: "Fetch Operand",
        description,
        timeRange: `${actualTime}ms`
      });
      
      addTaskRecord("Fetch Operand", description, actualTime);
      toast.info("Fetching operands");
    }
  };

  const handleExecute = () => {
    const startTime = performance.now();
    
    if (!currentInstruction) return;

    const { operation, operands } = currentInstruction;
    const actualTime = Math.round(performance.now() - startTime + (90 + Math.random() * 90));
    
    setStepInfo({
      name: "Execute",
      description: `Executing ${operation} operation`,
      timeRange: `${actualTime}ms`
    });

    switch (operation) {
      case "LOAD": {
        const reg = operands[0];
        const addr = parseInt(operands[1]);
        const value = parseInt(memory.find(m => m.address === addr)?.data || "0");
        setRegisters(prev => ({ ...prev, [reg]: value }));
        addDataFlow("memory", "cpu", "data");
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
        setMemory(prev => prev.map(m => 
          m.address === addr ? { ...m, data: value.toString(), accessed: true } : m
        ));
        addDataFlow("cpu", "memory", "data");
        addTaskRecord("Execute", `STORE: Stored ${value} from ${reg} to address ${addr}`, actualTime);
        toast.success(`Stored ${value} to address ${addr}`);
        break;
      }
    }
  };

  const handleStore = () => {
    const startTime = performance.now();
    const actualTime = Math.round(performance.now() - startTime + (45 + Math.random() * 45));
    
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
    setMemory(prev => prev.map(m => ({ ...m, accessed: false })));
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
    const startIndex = memory.filter(cell => cell.type === "instruction").length;
    const newInstructions = instructions.map((inst, idx) => ({
      address: startIndex + idx,
      data: inst,
      type: "instruction" as const,
      accessed: false,
    }));
    
    setMemory(prev => [...prev, ...newInstructions]);
    if (programCounter === 0 && memory.filter(m => m.type === "instruction").length === 0) {
      setProgramCounter(0);
    }
  };

  const handleResetInstructions = () => {
    setMemory(prev => prev.filter(cell => cell.type !== "instruction"));
    setProgramCounter(0);
    setCurrentStep("idle");
    setIsPlaying(false);
    setCurrentInstruction(null);
    toast.success("Instructions cleared");
  };

  const handleLoadMemory = (address: number, value: number) => {
    setMemory(prev => {
      const existing = prev.find(m => m.address === address);
      if (existing) {
        return prev.map(m => m.address === address ? { ...m, data: value.toString() } : m);
      } else {
        return [...prev, { address, data: value.toString(), type: "data", accessed: false }];
      }
    });
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-gradient-card border-border relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-glow opacity-30" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Architecture Visualization</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Cache:</span>
                    <Button 
                      variant={cacheEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCacheEnabled(!cacheEnabled)}
                    >
                      {cacheEnabled ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {cacheEnabled && (
                    <Card className="p-3 bg-accent/10 border-accent/30">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-accent" />
                        <span className="text-xs font-semibold">Instruction Cache</span>
                        <span className="ml-auto text-xs text-muted-foreground">Fast Access</span>
                      </div>
                    </Card>
                  )}

                  <CPUComponent 
                    isActive={currentStep === "executing" || currentStep === "decoding"}
                    registers={registers}
                    currentInstruction={currentInstruction}
                  />

                  <DataFlowAnimation flows={dataFlows} />

                  <div className="relative">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="text-center text-xs text-instruction-flow py-1 bg-instruction-flow/10 rounded">
                        Instruction Path
                      </div>
                      <div className="text-center text-xs text-data-flow py-1 bg-data-flow/10 rounded">
                        Data Path (Shared)
                      </div>
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
            <InfoPanel architecture="modified-harvard" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifiedHarvardSimulator;
