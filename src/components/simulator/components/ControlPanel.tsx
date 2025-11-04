import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";

const ControlPanel = () => {
  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold">Instruction Input</h3>
        </div>
        
        <Textarea 
          placeholder="Enter instructions (e.g., LOAD R1, 100)"
          className="font-mono text-sm min-h-[120px] bg-background/50"
        />
        
        <div className="flex gap-2">
          <Button className="flex-1 bg-primary hover:bg-primary/90">
            Load Instructions
          </Button>
          <Button variant="outline" className="flex-1">
            Clear
          </Button>
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
