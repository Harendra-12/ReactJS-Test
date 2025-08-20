import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AccordionItem } from "@radix-ui/react-accordion";
import { Box, PhoneOutgoing, Settings } from "lucide-react";
import React, { useState } from "react";

const CallTransfarEdit = () => {
  const [callTransferType, setCallTransferType] = useState("cold-transfer");
  const [globalNode, setGlobalNode] = useState(false);
  const [llm, setLlm] = useState(false);

  return (
    <>
      <div className="w-full">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center gap-3 font-bold text-sm cursor-pointer">
                <PhoneOutgoing className="w-5 h-5" />
                Call Transfer Settings
              </div>
            </AccordionTrigger>
            <Separator />
            <AccordionContent>
              <div className="mt-3 px-4 font-normal">
                <Tabs defaultValue="static-number" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-zinc-700">
                    <TabsTrigger
                      value="static-number"
                      className={"cursor-pointer"}
                    >
                      Static Number
                    </TabsTrigger>
                    <TabsTrigger
                      value="dynamic-routing"
                      className={"cursor-pointer"}
                    >
                      Dynamic Routing
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="static-number" className={"w-full"}>
                    <Card className={"bg-slate-700"}>
                      <CardContent className="px-2">
                        <div className="">
                          <Label htmlFor="number">Number</Label>
                          <Input
                            id="number"
                            type="text"
                            placeholder="Enter a number"
                            className={"my-2"}
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter a static phone number or dynamic variable.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="dynamic-routing">
                    <Card className={"bg-slate-700"}>
                      <CardContent className="px-2">
                        <div className="">
                          <Label htmlFor="dynamic-routing">
                            Dynamic routing
                          </Label>
                          <Textarea
                            id="dynamic-routing"
                            type="text"
                            placeholder="Enter a dynamic routing prompt"
                            className={"my-2 h-[100px]"}
                          />
                          <p className="text-xs text-muted-foreground">
                            Use a prompt to handle dynamic call transfer
                            routing.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                <div>
                  <Label className={"mt-4 mb-2"}>Type</Label>
                  <RadioGroup
                    defaultValue="cold-transfer"
                    onValueChange={setCallTransferType}
                  >
                    <Label
                      htmlFor="cold-transfer"
                      className="flex items-center justify-between px-2 py-4 border rounded-md cursor-pointer font-normal text-muted-foreground"
                    >
                      <p>Cold Transfer</p>
                      <RadioGroupItem
                        value="cold-transfer"
                        id="cold-transfer"
                        className={"border-white"}
                      />
                    </Label>
                    <Label
                      htmlFor="warm-transfer"
                      className="flex items-center justify-between px-2 py-4 border rounded-md cursor-pointer font-normal text-muted-foreground"
                    >
                      <p>Warm Transfer</p>
                      <RadioGroupItem
                        value="warm-transfer"
                        id="warm-transfer"
                        className={"border-white"}
                      />
                    </Label>
                  </RadioGroup>
                </div>
                {callTransferType && callTransferType === "cold-transfer" && (
                  <div>
                    <Label className={"mt-4 mb-2"}>
                      Displayed Phone Number
                    </Label>
                    <RadioGroup defaultValue="retell-agents-number">
                      <Label
                        htmlFor="retell-agents-number"
                        className="flex items-center justify-between px-2 py-4 border rounded-md cursor-pointer font-normal text-muted-foreground"
                      >
                        <p>Retell Agent's Number</p>
                        <RadioGroupItem
                          value="retell-agents-number"
                          id="retell-agents-number"
                          className={"border-white"}
                        />
                      </Label>
                      <Label
                        htmlFor="transferees-number"
                        className="flex items-center justify-between px-2 py-4 border rounded-md cursor-pointer font-normal text-muted-foreground"
                      >
                        <p>Transferee's Number</p>
                        <RadioGroupItem
                          value="transferees-number"
                          id="transferees-number"
                          className={"border-white"}
                        />
                      </Label>
                    </RadioGroup>
                  </div>
                )}
                {callTransferType && callTransferType === "warm-transfer" && (
                  <div>
                    <Label className={"mt-4 mb-2"}>Handoff message</Label>
                    <Tabs defaultValue="prompt" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-zinc-700">
                        <TabsTrigger
                          value="prompt"
                          className={"cursor-pointer"}
                        >
                          Prompt
                        </TabsTrigger>
                        <TabsTrigger
                          value="static-sentence"
                          className={"cursor-pointer"}
                        >
                          Static Sentence
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="prompt" className={"w-full"}>
                        <div className="">
                          <Textarea
                            className={"my-2 h-[100px]"}
                            placeholder="Say hello to the agent and summarize the user problem to him."
                          />
                        </div>
                      </TabsContent>
                      <TabsContent value="static-sentence">
                        <div className="">
                          <Textarea
                            id="static-sentence"
                            type="text"
                            placeholder="Enter a static sentence"
                            className={"my-2 h-[100px]"}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
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
                    defaultValue={"Describe the condition to jump to this node"}
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
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default CallTransfarEdit;
