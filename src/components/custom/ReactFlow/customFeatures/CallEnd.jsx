import { Badge } from "@/components/ui/badge";
import { CircleX, PhoneOff } from "lucide-react";
import React from "react";
import { Position, useReactFlow } from "@xyflow/react";
import CustomHandle from "../CustomHandle";
import { Button } from "@/components/ui/button";

const CallEnd = ({ id }) => {
  const { setNodes } = useReactFlow();
  return (
    <>
      <Badge className="bg-red-400 p-2 font-bold">
        <PhoneOff className="mr-2" />
        Call End
        <Button
          className="text-red-600 hover:bg-red-100 hover:text-red-600 cursor-pointer"
          variant="ghost"
          size="icon"
          onClick={() =>
            setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id))
          }
        >
          <CircleX />
        </Button>
      </Badge>
      <CustomHandle type="target" position={Position.Left} />
    </>
  );
};

export default CallEnd;
