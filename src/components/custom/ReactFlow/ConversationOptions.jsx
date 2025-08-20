import { useReactFlow } from "@xyflow/react";
import React from "react";
import {
  PhoneOutgoing,
  PhoneOff,
  MessageSquare,
  FunctionSquare,
  Keyboard,
} from "lucide-react";
import { v4 as uuid4 } from "uuid";

const NODE_TYPES = [
  // {
  //   code: "callBegin",
  //   name: "Call Begin",
  //   type: "callBegin",
  //   icon: <PhoneOutgoing className="w-4 h-4" />,
  //   description: "Start a new call flow",
  // },
  {
    code: "conversation",
    name: "Conversation",
    type: "conversation",
    icon: <MessageSquare className="w-4 h-4" />,
    description: "Add a conversation node",
  },
  {
    code: "function",
    name: "Custom Function",
    type: "function",
    icon: <FunctionSquare className="w-4 h-4" />,
    description: "Add a custom function node",
  },
  {
    code: "callTransfer",
    name: "Call Transfer",
    type: "callTransfer",
    icon: <PhoneOutgoing className="w-4 h-4" />,
    description: "Transfer the call to another agent",
  },
  {
    code: "pressDigit",
    name: "Press Digit",
    type: "pressDigit",
    icon: <Keyboard className="w-4 h-4" />,
    description: "Press digits option to user",
  },
  {
    code: "callEnd",
    name: "Call End",
    type: "callEnd",
    icon: <PhoneOff className="w-4 h-4" />,
    description: "End the call flow",
  },
];

const ConversationOptions = () => {
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
        },
      },
    ]);
  };

  return (
    <div className="w-[250px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
      <h1 className="text-lg font-bold">Select a node</h1>
      <ul className="w-full h-full overflow-y-auto p-2">
        {NODE_TYPES.map((node) => (
          <li
            className="cursor-pointer hover:bg-slate-800 p-2 rounded-md flex items-center gap-2"
            key={node.code}
            value={node.code}
            onClick={() => onNodeClick(node)}
          >
            {node.icon}
            <div>
              <div className="font-medium">{node.name}</div>
              <div className="text-xs text-gray-500">{node.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationOptions;
