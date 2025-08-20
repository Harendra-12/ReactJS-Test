import { Badge } from "@/components/ui/badge";
import { PhoneOutgoing } from "lucide-react";
import React from "react";
import { Position } from "@xyflow/react";
import CustomHandle from "../CustomHandle";

const CallBegin = () => {
  return (
    <>
      <Badge className="bg-green-500 p-2 font-bold">
        <PhoneOutgoing className="mr-2" />
        Call Begin
      </Badge>
      <CustomHandle type="source" position={Position.Right} />
    </>
  );
};

export default CallBegin;
