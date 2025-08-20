import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  CircleX,
  Keyboard,
  Pencil,
  Plus,
  Split,
  Trash2,
  Info,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Position, useReactFlow } from "@xyflow/react";
import CustomHandle from "../CustomHandle";
import { v4 as uuidv4 } from "uuid";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
import { useDispatch, useSelector } from "react-redux";

const PressDigit = ({ id, data }) => {
  const dispatch = useDispatch();

  const { setNodes } = useReactFlow();

  const [fields, setFields] = useState([]);
  const textAreaRefs = useRef({}); // Store refs for each text area
  const clickedNodeId = useSelector((state) => state.app.clickedNodeId);

  // initially set all the fields comes from data
  useEffect(() => {
    if (data.subNodes && data.subNodes.length > 0) {
      const initialFields = data.subNodes.map((item) => ({
        id: item.id,
        value: item.value || "",
      }));
      setFields(initialFields);
    }
  }, [data.subNodes]);

  // Add new field
  const addField = () => {
    if (fields.some((field) => field.value.trim() === "")) return;
    const newField = { id: uuidv4(), value: "" };
    const updatedFields = [...fields, newField];
    setFields(updatedFields);

    // Update the parent node's data
    if (data.onUpdate) {
      data.onUpdate({ fields: updatedFields });
    }
  };

  // Delete a field
  const deleteField = (id) => {
    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
    delete textAreaRefs.current[id];

    // Update the parent node's data
    if (data.onUpdate) {
      data.onUpdate({ fields: updatedFields });
    }
  };

  // Handle value change
  const handleChange = (id, newValue) => {
    const updatedFields = fields.map((field) =>
      field.id === id ? { ...field, value: newValue } : field
    );
    setFields(updatedFields);

    // Update the parent node's data when field value changes
    if (data.onUpdate) {
      data.onUpdate({ fields: updatedFields });
    }
  };

  // Focus on the text area when the edit icon is clicked
  const focusTextArea = (id) => {
    if (textAreaRefs.current[id]) {
      textAreaRefs.current[id].focus(); // Programmatically focus
    }
  };

  return (
    <>
      <Card
        className={`w-[300px] text-center flex flex-col items-center px-2 pt-2 pb-1 bg-yellow-900 ${
          clickedNodeId === id ? "border-2 border-blue-700" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: "SET_NODE_CONFIG_BAR", payload: true });
          dispatch({ type: "SET_CLICKED_NODE_TYPE", payload: "pressDigit" });
          dispatch({ type: "SET_CLICKED_NODE_ID", payload: id });
        }}
      >
        <Dialog>
          <div className="w-full ps-1">
            <CardTitle className="flex justify-between">
              <h1 className="pt-3 flex">
                <Keyboard className="w-4 h-4 mr-1" /> {data.label}
              </h1>
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
                {data.description}
              </p>
            </CardDescription>
          </div>
          {data.schema && data.schema.length > 0 && (
            <div>
              {data?.schema.map((item, index) => (
                <p key={index}>{item.title}</p>
              ))}
            </div>
          )}

          {/* Node dynamic input fields here */}
          <div className="w-full bg-gray-950 rounded-sm pb-1">
            <div className="flex justify-between items-center p-2">
              <span className="flex gap-2 items-center text-xs opacity-40">
                <Split className="w-4 h-4" /> Conditions
              </span>
              <span>
                <Button variant="ghost" size="icon" onClick={addField}>
                  <Plus />
                </Button>
              </span>
            </div>
            <div className="flex flex-col gap-y-2 ps-2">
              {fields.map((field) => (
                <>
                  <div
                    key={field.id}
                    className="flex justify-between items-center"
                  >
                    <Input
                      type="number"
                      ref={(el) => (textAreaRefs.current[field.id] = el)} // Assign ref dynamically
                      value={field.value}
                      onFocus={() => console.log("Editing field:", field.id)}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      onBlur={() => console.log("Field saved:", field)} // Logs the saved field on blur
                      placeholder="Type here..."
                      className="min-h-2 text-xs font-normal text-muted-foreground placeholder:text-muted-foreground"
                    />
                    <span className="flex items-center text-xs opacity-40">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-green-600 hover:bg-green-100 hover:text-green-600 cursor-pointer"
                        onClick={() => focusTextArea(field.id)} // Trigger focus
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:bg-red-100 hover:text-red-600 cursor-pointer"
                        onClick={() => deleteField(field.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </span>
                    <CustomHandle
                      type="source"
                      position={Position.Right}
                      id={`source-${field.id}`}
                      className="!relative !transform-none !top-1/2 !-translate-y-1/2"
                    />
                  </div>
                </>
              ))}
            </div>
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
      {/* <CustomHandle type="source" position={Position.Right} /> */}
      <CustomHandle type="target" position={Position.Left} />
    </>
  );
};

export default PressDigit;
