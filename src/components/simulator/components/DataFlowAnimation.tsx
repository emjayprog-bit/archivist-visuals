interface DataFlowAnimationProps {
  flows: Array<{ id: string; from: string; to: string; type: "data" | "instruction" }>;
}

const DataFlowAnimation = ({ flows }: DataFlowAnimationProps) => {
  if (flows.length === 0) return null;

  return (
    <div className="relative py-4">
      {flows.map((flow) => (
        <div key={flow.id} className="relative">
          <div className="flex items-center justify-center gap-2">
            <div
              className={`h-1 w-24 rounded-full animate-flow-data ${
                flow.type === "data" ? "bg-data-flow" : "bg-instruction-flow"
              }`}
            />
            <span className="text-xs font-medium px-2 py-1 rounded bg-background/50">
              {flow.type === "data" ? "Data" : "Instruction"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataFlowAnimation;
