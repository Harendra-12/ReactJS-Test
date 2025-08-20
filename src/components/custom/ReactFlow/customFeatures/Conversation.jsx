import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  CircleX,
  Info,
  MessageSquare,
  Pencil,
  Plus,
  Split,
  SquarePen,
  Trash2,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Position, useReactFlow } from "@xyflow/react";
import CustomHandle from "../CustomHandle";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";

const Conversation = ({ id, data }) => {
  const dispatch = useDispatch();
  const { setNodes } = useReactFlow();

  const [fields, setFields] = useState(data.fields || []);
  const [prompt, setPrompt] = useState(data.prompt || "");
  const textAreaRefs = useRef({});
  // const [inputs, setInputs] = useState(data.inputs || []);
  const [isReadonly, setIsreadonly] = useState(false);
  const clickedNodeId = useSelector((state) => state.app.clickedNodeId);

  // const clickedNodeType = useSelector((state) => state.app.clickedNodeType);

  // useEffect(() => {
  //   console.log("clickedNodeType:", clickedNodeType);
  // }, [clickedNodeType, dispatch]);

  // initially set all the fields comes from data
  useEffect(() => {
    if (data.subNodes && data.subNodes.length > 0) {
      const initialFields = data.subNodes.map((item) => ({
        id: item.id,
        value: item.value || "",
      }));
      setFields(initialFields);
    }
  }, []);

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

  // Handle prompt change
  const handlePromptChange = (newValue) => {
    setPrompt(newValue);

    // Update the parent node's data when prompt changes
    if (data.onUpdate) {
      data.onUpdate({ prompt: newValue });
    }
  };

  // Focus on the text area when the edit icon is clicked
  const focusTextArea = (id) => {
    if (textAreaRefs.current[id]) {
      textAreaRefs.current[id].focus(); // Programmatically focus
    }
  };

  // Function to add a new input (sub-node)
  // const addInput = () => {
  //   const newInput = {
  //     id: `input-${inputs.length + 1}`,
  //     label: `Input ${inputs.length + 1}`,
  //     type: "source", // Example type
  //   };
  //   const updatedInputs = [...inputs, newInput];
  //   setInputs(updatedInputs);

  //   // Update the parent node's data
  //   if (data.onUpdate) {
  //     data.onUpdate({ inputs: updatedInputs });
  //   }
  // };

  return (
    <>
      <Card
        className={`w-[300px] px-2 pt-2 pb-1 text-center flex flex-col items-center bg-teal-900 ${
          clickedNodeId === id ? "border-2 border-blue-700" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: "SET_NODE_CONFIG_BAR", payload: true });
          dispatch({ type: "SET_CLICKED_NODE_TYPE", payload: "conversation" });
          dispatch({ type: "SET_CLICKED_NODE_ID", payload: id });
        }}
      >
        <Dialog>
          <div className="w-full ps-1">
            <CardTitle className="flex justify-between">
              <div className="pt-3 pr-3 flex items-center ">
                <MessageSquare className="w-6 h-6 mr-1" />
                <Input
                  value={data.label}
                  readOnly={isReadonly}
                  onChange={(e) => data.onUpdate({ label: e.target.value })}
                  className={`h-6 text-md font-bold placeholder:text-muted-foreground border-none !bg-transparent !focus:outline-none focus:ring-0 ${
                    isReadonly ? "!border-1 !border-gray-800" : ""
                  }`}
                />
                <SquarePen
                  className="w-4 h-4 ms-1 cursor-pointer text-muted-foreground"
                  onClick={() => setIsreadonly(!isReadonly)}
                />
                {/* {data.label} */}
              </div>
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

          {/* User prompt section */}
          <div className="w-full bg-gray-950 rounded-sm pb-1 mt-2">
            <Textarea
              value={prompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              placeholder="Type your prompts for the LLM..."
              className="min-h-30 max-h-60 text-xs font-normal text-muted-foreground placeholder:text-muted-foreground"
            />
          </div>

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
                <div
                  key={field.id}
                  className="flex justify-between items-center"
                >
                  <Textarea
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

export default Conversation;
