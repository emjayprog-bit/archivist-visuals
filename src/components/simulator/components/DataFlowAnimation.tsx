interface DataFlowAnimationProps {
  flows: Array<{ id: string; from: string; to: string; type: "data" | "instruction"; label?: string }>;
}

const DataFlowAnimation = ({ flows }: DataFlowAnimationProps) => {
  if (flows.length === 0) return null;

  return (
    <div className="relative py-6 overflow-visible">
      {flows.map((flow, index) => (
        <div 
          key={flow.id} 
          className="relative mb-4 flex items-center justify-center"
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <div className="relative flex items-center gap-2">
            {/* Travelling envelope/message */}
            <div className="relative w-64 h-12 flex items-center">
              <div
                className={`absolute left-0 w-16 h-10 border-2 rounded-md flex items-center justify-center text-xs font-bold animate-slide-in-right ${
                  flow.type === "data" 
                    ? "bg-green-500/20 border-green-500 text-green-300" 
                    : "bg-blue-500/20 border-blue-500 text-blue-300"
                }`}
                style={{
                  animation: 'envelope-travel 2s ease-in-out forwards'
                }}
              >
                <div className="flex flex-col items-center leading-tight">
                  <span className="text-[10px]">{flow.type === "data" ? "DATA" : "INST"}</span>
                  {flow.label && <span className="text-[8px] opacity-75">{flow.label}</span>}
                </div>
              </div>
              
              {/* Path trail */}
              <div className="absolute inset-0 flex items-center">
                <div className={`h-0.5 w-full ${
                  flow.type === "data" ? "bg-green-500/30" : "bg-blue-500/30"
                }`} />
              </div>
            </div>
            
            {/* Flow description */}
            <div className="ml-4 px-3 py-1.5 rounded-md bg-background/80 border border-border">
              <span className="text-xs font-medium">
                {flow.from} → {flow.to}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataFlowAnimation;
