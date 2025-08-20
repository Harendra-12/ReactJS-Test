import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import CustomHandle from "../ReactFlow/CustomHandle";
import { Position, useReactFlow } from "@xyflow/react";
import { Cable, CircleX, Info, PhoneOutgoing } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch } from "react-redux";

const CustomNode = ({ id, data }) => {
  const dispatch = useDispatch();
  const { setNodes } = useReactFlow();

  return (
    <>
      <Card
        className={
          "w-[300px] min-h-[50px] text-center flex flex-col items-center bg-violet-900 px-2 pt-2 pb-1"
        }
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: "SET_SQUAD_CONFIG_BAR", payload: true });
        }}
      >
        <Dialog>
          <div className="w-full ps-1">
            <CardTitle className="flex justify-between">
              <h1 className="pt-3 flex">{data.label}</h1>
              <DialogTrigger asChild>
                <Button
                  className="text-red-600 hover:bg-red-100 hover:text-red-600 cursor-pointer"
                  variant="ghost"
                  size="icon"
                >
                  <CircleX />
                </Button>
              </DialogTrigger>
            </CardTitle>
            <CardDescription>
              <p className="text-xs text-muted-foreground text-start">
                {data.agentId}
              </p>
            </CardDescription>
          </div>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Info className="w-6 h-6 text-red-700 mr-2" />
                Delete Conversation
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this conversation? This action
                cannot be reversed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2 cursor-pointer"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="cursor-pointer"
                onClick={() =>
                  setNodes((prevNodes) =>
                    prevNodes.filter((node) => node.id !== id)
                  )
                }
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
      <CustomHandle type="source" position={Position.Right} />
      <CustomHandle type="target" position={Position.Left} />
    </>
  );
};

export default CustomNode;
