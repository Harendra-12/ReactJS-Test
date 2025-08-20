import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  Bot,
  Box,
  Grid2x2,
  MessagesSquare,
  Move,
  Plus,
  Trash,
  Users,
} from "lucide-react";
import React, { useState } from "react";
// import { ReactSortable } from "react-sortablejs";

const ConversationEdit = () => {
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

  return (
    <>
      <Dialog>
        <div className="w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-3 font-bold text-sm cursor-pointer">
                  <MessagesSquare className="w-5 h-5" />
                  Conversation Settings
                </div>
              </AccordionTrigger>
              <Separator />
              <AccordionContent>
                <div className="mt-3 px-4">
                  <div className="flex flex-col mt-6">
                    <Label htmlFor="slip-response" className="">
                      Skip Response
                    </Label>
                    <p className=" text-muted-foreground text-xs ">
                      Jump to next node without waiting for user response
                    </p>
                    <Switch
                      id="slip-response"
                      className="cursor-pointer mt-2"
                    />
                  </div>
                  <div className="flex flex-col mt-6">
                    <Label htmlFor="global-node" className="">
                      Global Node
                    </Label>
                    <p className=" text-muted-foreground text-xs ">
                      Allow other nodes jump to this node without edges
                    </p>
                    <Switch id="global-node" className="cursor-pointer mt-2" />
                  </div>
                  <div className="flex flex-col mt-6">
                    <Label htmlFor="block-interrupions" className="">
                      Block Interruptions
                    </Label>
                    <p className=" text-muted-foreground text-xs ">
                      Users cannot interrupt while AI is speaking
                    </p>
                    <Switch
                      id="block-interrupions"
                      className="cursor-pointer mt-2"
                    />
                  </div>
                  <div className="flex flex-col mt-6">
                    <Label htmlFor="llm" className="">
                      LLM
                    </Label>
                    <p className=" text-muted-foreground text-xs ">
                      Choose a different LLM for this node
                    </p>
                    <Switch id="llm" className="cursor-pointer mt-2" />
                  </div>
                  <div className="flex flex-col mt-6">
                    <Label>Fine-tuning Examples</Label>
                    <p className=" text-muted-foreground text-xs ">
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
              <Tabs defaultValue="fture-conversation" className="">
                <TabsList className="grid w-full grid-cols-2 bg-zinc-700">
                  <TabsTrigger
                    value="fture-conversation"
                    className={"cursor-pointer"}
                  >
                    Finetune a conversation
                  </TabsTrigger>
                  <TabsTrigger
                    value="ftune-transition"
                    className={"cursor-pointer"}
                  >
                    Finetune the Transition
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="fture-conversation">
                  <Card className={"w-full border-none"}>
                    <CardHeader>
                      <CardTitle>Conversation Example</CardTitle>
                      <CardDescription>
                        Give examples on what agent would say on the
                        conversation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="w-full">
                        {/* <ReactSortable
                          list={items}
                          setList={setItems}
                          handle=".drag-handle" 
                          animation={150}
                          onEnd={handleOnEnd} 
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
                    <CardFooter className={"p-0"}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={"cursor-pointer"}
                          >
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
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="ftune-transition">
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
                    {/* <div className={"p-0 "}> */}
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={"cursor-pointer"}
                          >
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
                    {/* </div> */}
                  </Card>
                </TabsContent>
              </Tabs>
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

export default ConversationEdit;
