import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ControlPanelProps {
  onLoadInstructions: (instructions: string[]) => void;
  onLoadMemory: (address: number, value: number) => void;
}

const ControlPanel = ({ onLoadInstructions, onLoadMemory }: ControlPanelProps) => {
  const [instructions, setInstructions] = useState("");
  const [memoryAddress, setMemoryAddress] = useState("");
  const [memoryValue, setMemoryValue] = useState("");
  const { toast } = useToast();

  const handleLoadInstructions = () => {
    const lines = instructions.trim().split("\n").filter(line => line.trim());
    if (lines.length === 0) {
      toast({
        title: "No instructions",
        description: "Please enter at least one instruction",
        variant: "destructive",
      });
      return;
    }
    onLoadInstructions(lines);
    toast({
      title: "Instructions loaded",
      description: `${lines.length} instruction(s) loaded successfully`,
    });
  };

  const handleLoadMemory = () => {
    const addr = parseInt(memoryAddress);
    const val = parseInt(memoryValue);
    
    if (isNaN(addr) || isNaN(val)) {
      toast({
        title: "Invalid input",
        description: "Please enter valid numbers",
        variant: "destructive",
      });
      return;
    }
    
    onLoadMemory(addr, val);
    setMemoryAddress("");
    setMemoryValue("");
    toast({
      title: "Memory updated",
      description: `Address ${addr} set to ${val}`,
    });
  };

  const handleClear = () => {
    setInstructions("");
    setMemoryAddress("");
    setMemoryValue("");
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">Instruction Input</h3>
          </div>
          
          <Textarea 
            placeholder="Enter instructions (e.g., LOAD R1, 100)"
            className="font-mono text-sm min-h-[120px] bg-background/50"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
          
          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleLoadInstructions}
            >
              Load Instructions
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-border space-y-4">
          <h4 className="text-sm font-semibold">Direct Memory Input</h4>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Address"
              className="flex h-10 w-24 rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
              value={memoryAddress}
              onChange={(e) => setMemoryAddress(e.target.value)}
            />
            <input
              type="number"
              placeholder="Value"
              className="flex h-10 flex-1 rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
              value={memoryValue}
              onChange={(e) => setMemoryValue(e.target.value)}
            />
            <Button onClick={handleLoadMemory}>Set</Button>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-semibold mb-2">Supported Instructions:</h4>
          <div className="space-y-1 text-sm text-muted-foreground font-mono">
            <p>• LOAD reg, address</p>
            <p>• STORE reg, address</p>
            <p>• ADD dest, src1, src2</p>
            <p>• SUB dest, src1, src2</p>
            <p>• MUL dest, src1, src2</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ControlPanel;
