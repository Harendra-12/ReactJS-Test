import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { CircleX } from "lucide-react";
import React from "react";
import { Position, useReactFlow } from "@xyflow/react";
import CustomHandle from "../CustomHandle";
import { useDispatch } from "react-redux";

const Function = ({ id, data }) => {
  const dispatch = useDispatch();

  const { setNodes } = useReactFlow();
  return (
    <>
      <Card
        className="w-[300px] text-center flex flex-col items-center"
        onClick={() => dispatch({ type: "SET_NODE_CONFIG_BAR", payload: true })}
      >
        <div>
          <CardTitle className="flex justify-between">
            <h1>{data.label}</h1>
            <Button
              className="text-red-600 hover:bg-red-100 hover:text-red-600 cursor-pointer"
              variant="ghost"
              size="icon"
              onClick={() =>
                setNodes((prevNodes) =>
                  prevNodes.filter((node) => node.id !== id)
                )
              }
            >
              <CircleX />
            </Button>
          </CardTitle>
          <CardDescription>
            <p>{data.description}</p>
          </CardDescription>
        </div>
        {data.schema && data.schema.length > 0 && (
          <div>
            {data?.schema.map((item, index) => (
              <p key={index}>{item.title}</p>
            ))}
          </div>
        )}
      </Card>
      <CustomHandle type="source" position={Position.Right} />
      <CustomHandle type="target" position={Position.Left} />
    </>
  );
};

export default Function;
