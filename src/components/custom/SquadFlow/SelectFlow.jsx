import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useReactFlow } from "@xyflow/react";
import { BadgeDollarSign, Cable, Plus } from "lucide-react";
import React from "react";
import { v4 as uuid4 } from "uuid";

const NODE_TYPES = [
  {
    code: "squads",
    name: "Squads",
    type: "squads",
    icon: <Cable className="w-4 h-4" />,
    description: "Add a squads node",
    agentId: uuid4(),
  },
  {
    code: "squads2",
    name: "Squads2",
    type: "squads",
    icon: <Cable className="w-4 h-4" />,
    description: "Add a squads node",
    agentId: uuid4(),
  },
];

const SelectFlow = () => {
  const { setNodes } = useReactFlow();
  const onNodeClick = (nodeType) => {
    const location = Math.random() * 500;

    setNodes((prevNodes) => [
      ...prevNodes,
      {
        id: uuid4(),
        type: nodeType.type,
        position: { x: location, y: location },
        data: {
          label: nodeType.name,
          description: nodeType.description,
          agentId: nodeType.agentId,
          icon: nodeType.icon,
        },
      },
    ]);
  };
  return (
    <div className="w-[300px] max-h-[400px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
      <h1 className="text-lg font-bold">Available Agents</h1>
      <Separator className={"my-3"} />
      <div className="w-full flex items-center gap-2 px-2 mb-2">
        <Input placeholder="Add new assistant" className={"font-normal"} />
        <Button size={"icon"} className={"cursor-pointer"} disabled>
          <Plus className="w-5 h-5 font-bold" />
        </Button>
      </div>
      <ul className="w-full h-full overflow-y-auto px-2">
        {NODE_TYPES.map((node, index) => (
          <li
            className="flex items-center gap-2 hover:bg-slate-800 rounded-md p-2 cursor-pointer"
            key={index}
            value={node.code}
            onClick={() => onNodeClick(node)}
          >
            <div>
              <BadgeDollarSign />
            </div>
            <div>
              <h2>{node.name}</h2>
              <p className="text-xs text-muted-foreground">{node.agentId}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectFlow;
