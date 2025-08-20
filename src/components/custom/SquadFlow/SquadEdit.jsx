import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { Textarea } from "@/components/ui/textarea";
import { ChevronsUpDown, XIcon } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const SquadEdit = () => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-[350px] max-h-[500px] overflow-y-auto px-2">
      <div className="flex justify-end">
        <Button
          variant={"ghost"}
          size={"icon"}
          className="cursor-pointer hover:bg-red-100 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: "SET_SQUAD_CONFIG_BAR", payload: false });
          }}
        >
          <XIcon className="hover:text-red-600" />
        </Button>
      </div>
      <div>
        <h2 className="text-lg font-bold">Test-assistant Assistant Settings</h2>
        <p className="text-xs text-muted-foreground">
          Here you can configure how your assistant works within your Squad.
        </p>
      </div>

      {/* edit options */}
      <div className="mt-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="destination-settings">
            <AccordionTrigger className={"cursor-pointer"}>
              Destination Settings
            </AccordionTrigger>
            <AccordionContent>
              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="w-full space-y-2 border rounded-md"
              >
                <CollapsibleTrigger asChild className="w-full ">
                  <Button variant="outline" className={"cursor-pointer"}>
                    <div className="flex items-center justify-between w-full">
                      Morgan
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                  <div className=" font-mono flex flex-col gap-2 mt-2">
                    <Label htmlFor="message">Message</Label>
                    <Input
                      id="message"
                      placeholder="Message to say before tranferring the call"
                    />
                  </div>
                  <div className=" font-mono flex flex-col gap-2 mt-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Hand off user when name has been recived..."
                    />
                  </div>
                  <Button className={"cursor-pointer w-full mt-4"} disabled>
                    Save
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="model-settings">
            <AccordionTrigger className={"cursor-pointer"}>
              Model Settings
            </AccordionTrigger>
            <AccordionContent>
              <div className="w-full">
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <Label htmlFor="model-preview" className={"mb-2"}>
                      Model Preview
                    </Label>
                    <Select>
                      <SelectTrigger
                        id="model-preview"
                        className="w-full cursor-pointer"
                      >
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fruits</SelectLabel>
                          <SelectItem
                            value="apple"
                            className={"cursor-pointer"}
                          >
                            Apple
                          </SelectItem>
                          <SelectItem
                            value="banana"
                            className={"cursor-pointer"}
                          >
                            Banana
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="model" className={"mb-2"}>
                      Model
                    </Label>
                    <Select>
                      <SelectTrigger
                        id="model"
                        className="w-full cursor-pointer"
                      >
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fruits</SelectLabel>
                          <SelectItem
                            value="apple"
                            className={"cursor-pointer"}
                          >
                            Apple
                          </SelectItem>
                          <SelectItem
                            value="banana"
                            className={"cursor-pointer"}
                          >
                            Banana
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="first-message" className={"mb-2"}>
                    First Message
                  </Label>
                  <Input id="first-message" placeholder="Enter first message" />
                </div>
                <div className="mt-4">
                  <Label htmlFor="system-prompt" className={"mb-2"}>
                    System Prompt
                  </Label>
                  <Textarea
                    id="system-prompt"
                    placeholder="Enter system prompt"
                  />
                </div>
                <div className="mt-4">
                  <Label htmlFor="system-prompt" className={"mb-2"}>
                    Knowledge Base
                  </Label>
                  <Select>
                    <SelectTrigger
                      id="system-prompt"
                      className="w-full cursor-pointer"
                    >
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="apple" className={"cursor-pointer"}>
                          Apple
                        </SelectItem>
                        <SelectItem value="banana" className={"cursor-pointer"}>
                          Banana
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Button className={"cursor-pointer w-full mt-4"} disabled>
                  Save
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="voice-settings">
            <AccordionTrigger className={"cursor-pointer"}>
              Voice Settings
            </AccordionTrigger>
            <AccordionContent>
              <div className="w-full">
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <Label htmlFor="proviider" className={"mb-2"}>
                      Provider
                    </Label>
                    <Select>
                      <SelectTrigger
                        id="proviider"
                        className="w-full cursor-pointer"
                      >
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fruits</SelectLabel>
                          <SelectItem
                            value="apple"
                            className={"cursor-pointer"}
                          >
                            Apple
                          </SelectItem>
                          <SelectItem
                            value="banana"
                            className={"cursor-pointer"}
                          >
                            Banana
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="voiceId" className={"mb-2"}>
                      Voice Id
                    </Label>
                    <Select>
                      <SelectTrigger
                        id="voiceId"
                        className="w-full cursor-pointer"
                      >
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fruits</SelectLabel>
                          <SelectItem
                            value="apple"
                            className={"cursor-pointer"}
                          >
                            Apple
                          </SelectItem>
                          <SelectItem
                            value="banana"
                            className={"cursor-pointer"}
                          >
                            Banana
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className={"cursor-pointer w-full mt-4"} disabled>
                  Save
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SquadEdit;
