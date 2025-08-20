import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Bot,
  Box,
  Grid2x2,
  Keyboard,
  Move,
  Plus,
  Settings,
  Trash,
  Users,
} from "lucide-react";
import React, { useState } from "react";
// import { ReactSortable } from "react-sortablejs";

const PressDigitEdit = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
    { id: 4, name: "Item 4" },
  ]);

  const handleOnEnd = (evt) => {
    console.log("Moved Item:", items[evt.oldIndex].name);
    console.log("Old Index:", evt.oldIndex);
    console.log("New Index:", evt.newIndex);
  };

  const [globalNode, setGlobalNode] = useState(false);
  const [llm, setLlm] = useState(false);

  return (
    <>
      <Dialog>
        <div className="w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-3 font-bold text-sm cursor-pointer">
                  <Keyboard className="w-5 h-5" />
                  Press Digit Settings
                </div>
              </AccordionTrigger>
              <Separator />
              <AccordionContent>
                <div className="mt-3 px-4 font-normal">
                  <div className="mt-4">
                    <Label>Instruction</Label>
                    <Textarea
                      className={"mt-2 h-[100px]"}
                      placeholder="Press to the right digits to transfer to human agent."
                      defaultValue={
                        "Navigate to the human agent of customer support department"
                      }
                    />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="pause-detection">
                      Pause Detection Delay
                      <span className="text-xs text-muted-foreground">
                        (Optional){" "}
                      </span>
                    </Label>
                    <div className="flex items-center mt-2">
                      <Input
                        id="pause-detection"
                        className={"w-3/4 mx-2"}
                        defaultValue="5"
                      />{" "}
                      milliseconds
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="mb-2 font-bold">Global Node</p>
                    <p className="text-sm text-muted-foreground">
                      Allow other nodes jump to this node without edges.
                    </p>
                    <Switch
                      checked={globalNode}
                      onCheckedChange={setGlobalNode}
                      className={"mt-2 cursor-pointer"}
                    />
                  </div>
                  {globalNode && (
                    <Input
                      type="text"
                      className={"mt-3 h-10"}
                      placeholder="Enter condition (optional)"
                      defaultValue={
                        "Describe the condition to jump to this node"
                      }
                    />
                  )}
                  <div className="mt-4">
                    <p className="mb-2 font-bold">LLM</p>
                    <p className="text-sm text-muted-foreground">
                      Choose a different LLM for this node.
                    </p>
                    <Switch
                      checked={llm}
                      onCheckedChange={setLlm}
                      className={"mt-2 cursor-pointer"}
                    />
                    {llm && (
                      <Select defaultValue="gpt-4o">
                        <SelectTrigger className="w-full cursor-pointer mt-3">
                          <Settings />
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Model</SelectLabel>
                            <SelectItem value="gpt-4o-mini">
                              GPT-4o Mini{" "}
                              <span className="text-xs text-muted-foreground">
                                (free)
                              </span>
                            </SelectItem>
                            <SelectItem value="gpt-4o">
                              GPT-4o{" "}
                              <span className="text-xs text-muted-foreground">
                                ($0.017/session)
                              </span>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="mt-4">
                    <Label>Fine-tuning Examples</Label>
                    <p className="text-sm text-muted-foreground">
                      Add example conversations to train your AI agent how to
                      handle specific scenarios
                    </p>
                    <DialogTrigger asChild>
                      <Button className="mt-4 cursor-pointer" variant="outline">
                        <Plus /> Add
                      </Button>
                    </DialogTrigger>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <DialogContent className="min-w-[700px]">
            <DialogHeader>
              <DialogTitle>Finetune Examples</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Card className={"w-full border-none"}>
                <CardHeader>
                  <CardTitle>Transition Example</CardTitle>
                  <CardDescription>
                    Give examples on the conversation that would trigger the
                    transition
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="w-full">
                    {/* <ReactSortable
                      list={items}
                      setList={setItems}
                      handle=".drag-handle" // Only this part is draggable
                      animation={150}
                      onEnd={handleOnEnd} // Tracks the new position after moving
                    >
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center mb-4 border p-4 rounded-md"
                        >
                          <span className="drag-handle cursor-grab me-2 p-2">
                            <Move />
                          </span>
                          <span className="me-4 text-muted-foreground">
                            {item.name}
                          </span>
                          <Textarea
                            className={"min-h-20 min-w-[400px]"}
                            placeholder="I have trouble finding the order number"
                          />
                          <Button
                            variant={"icon"}
                            className={
                              "cursor-pointer text-red-800 hover:text-red-500"
                            }
                          >
                            <Trash />
                          </Button>
                        </div>
                      ))}
                    </ReactSortable> */}
                  </div>
                </CardContent>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"outline"} className={"cursor-pointer"}>
                        <Plus />
                        Add
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className={"ms-8"}>
                      <DropdownMenuItem className={"cursor-pointer"}>
                        <Users /> User Speech
                      </DropdownMenuItem>
                      <DropdownMenuItem className={"cursor-pointer"}>
                        <Bot /> Agent Speech
                      </DropdownMenuItem>
                      <DropdownMenuItem className={"cursor-pointer"}>
                        <Grid2x2 />
                        User Speech
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="w-full">
                  <Label className={"text-md"}>Select Node</Label>
                  <p className=" text-xs text-muted-foreground mb-2">
                    Select agent should transition to which node
                  </p>
                  <Select className="w-full">
                    <SelectTrigger id="framework" className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="w-full">
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="sveltekit">SvelteKit</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className={"cursor-pointer"}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className={"cursor-pointer"} disabled>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default PressDigitEdit;
