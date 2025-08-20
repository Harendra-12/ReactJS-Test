import {
  ChevronsUpDown,
  CopyIcon,
  Phone,
  Plus,
  Trash,
  Check,
} from "lucide-react";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "../../assets/css/custom-phone-input.css";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const assistants = [
  {
    value: "assintant-1",
    label: "Assistant 1",
  },
  {
    value: "assistantist-2",
    label: "Assistant 2",
  },
];
const squads = [
  {
    value: "squad-1",
    label: "Squad 1",
  },
  {
    value: "squad-2",
    label: "Squad 2",
  },
];
const out_assistants = [
  {
    value: "assintant-1",
    label: "Assistant 1",
  },
  {
    value: "assistantist-2",
    label: "Assistant 2",
  },
];
const out_squads = [
  {
    value: "squad-1",
    label: "Squad 1",
  },
  {
    value: "squad-2",
    label: "Squad 2",
  },
];

const PhoneNumber = () => {
  const [openassistant, setOpenAssistant] = useState(false);
  const [outOpenassistant, outSetOpenAssistant] = useState(false);
  const [openSquad, setOpenSquad] = useState(false);
  const [outOpenSquad, setOutOpenSquad] = useState(false);
  const [assistantValue, setAssistantValue] = useState("");
  const [outAssistantValue, setOutAssistantValue] = useState("");
  const [squadValue, setSquadValue] = useState("");
  const [outSquadValue, setOutSquadValue] = useState("");
  const [value, setValue] = useState("");

  return (
    <>
      <Dialog>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full">
          <div>
            <h1 className="text-2xl font-bold">Phone Numbers</h1>
            <p className="text-gray-600">
              You can manage your phone numbers here.
            </p>
          </div>
          <div className="h-full flex flex-col md:flex-row items-center justify-between gap-2">
            {/* All the available numbers  */}
            <div className="bg-white dark:bg-zinc-800 rounded-md shadow-md p-4 flex-1 max-w-sm h-full">
              <div className="flex items-center justify-between mb-2">
                <h1 className="font-bold text-2xl">Available Numbers</h1>
                <DialogTrigger asChild>
                  <Button size="icon" className="cursor-pointer">
                    <Plus />
                  </Button>
                </DialogTrigger>
              </div>
              <Separator className="my-2 bg-zinc-500" />
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-2 border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer">
                  <span>+91 1234567890</span>
                </div>
                <div className="flex items-center justify-between p-2 border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer">
                  <span>+1 1234567890</span>
                </div>
              </div>
            </div>

            {/* Show all the numbers details and edit panels */}
            <div className="bg-white dark:bg-zinc-800 rounded-md shadow-md p-4 flex-1 w-full h-full flex justify-center">
              <div className="w-[600px] border h-full p-2 rounded-md">
                <div className="flex justify-between">
                  <div>
                    <h1 className="text-2xl">+91 1234567890</h1>
                    <p className="opacity-50 text-sm mt-2">
                      This is description
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="border border-zinc-900 max-w-3xl flex items-center justify-between p-2 rounded-md gap-2 opacity-50">
                      <p className="text-sm">3434-343-343-4</p>
                      <CopyIcon className="w-3 h-3 cursor-pointer hover:text-zinc-600" />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="cursor-pointer text-red-800 hover:text-red-600 !border-zinc-900 !hover:border-zinc-400"
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
                <Separator className="my-2 bg-zinc-500" />
                <div className="grid w-full items-center gap-1.5 mt-4">
                  <Label htmlFor="phoneNumberName">Phone Number Name</Label>
                  <Input
                    type="text"
                    id="phoneNumberName"
                    placeholder="Enter a name for this number"
                    className="border-zinc-900"
                  />
                </div>

                {/* Inbound settings  */}
                <Card className="w-full mt-4 bg-zinc-900">
                  <CardHeader>
                    <CardTitle>Inbound Settings</CardTitle>
                    <Separator className="bg-zinc-500" />
                    <CardDescription className="text-xs">
                      You can assign an assistant to the phone number so that
                      whenever someone calls this phone number, the assistant
                      will automatically be assigned to the call.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid w-full items-center gap-1.5 mt-4">
                      <Label htmlFor="inboundNumber">Phone Number Name</Label>
                      <Input
                        type="number"
                        id="inboundNumber"
                        placeholder="+91 1234567890"
                        disabled
                      />
                    </div>

                    <div className="w-full mt-4">
                      <Label htmlFor="inboundAssistant" className="mb-2">
                        Select Assistant
                      </Label>
                      <Popover
                        id="inboundAssistant"
                        open={openassistant}
                        onOpenChange={setOpenAssistant}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openassistant}
                            className="w-full justify-between"
                          >
                            {assistantValue
                              ? assistants.find(
                                  (assistant) =>
                                    assistant.value === assistantValue
                                )?.label
                              : "Select assistant..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[550px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search assistant..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No assistant found.</CommandEmpty>
                              <CommandGroup>
                                {assistants.map((assistant) => (
                                  <CommandItem
                                    key={assistant.value}
                                    value={assistant.value}
                                    onSelect={(currentValue) => {
                                      setAssistantValue(
                                        currentValue === assistantValue
                                          ? ""
                                          : currentValue
                                      );
                                      setOpenAssistant(false);
                                    }}
                                  >
                                    {assistant.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        assistantValue === assistant.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="w-full mt-4">
                      <Label htmlFor="inboundSquad" className="mb-2">
                        Select Squad
                      </Label>
                      <Popover
                        id="inboundSquad"
                        open={openSquad}
                        onOpenChange={setOpenSquad}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openSquad}
                            className="w-full justify-between"
                          >
                            {squadValue
                              ? squads.find(
                                  (squad) => squad.value === squadValue
                                )?.label
                              : "Select squad..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[550px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search squad..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No squad found.</CommandEmpty>
                              <CommandGroup>
                                {squads.map((squad) => (
                                  <CommandItem
                                    key={squad.value}
                                    value={squad.value}
                                    onSelect={(currentValue) => {
                                      setSquadValue(
                                        currentValue === squadValue
                                          ? ""
                                          : currentValue
                                      );
                                      setOpenSquad(false);
                                    }}
                                  >
                                    {squad.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        squadValue === squad.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="w-full mt-4">
                      <div className="flex flex-col gap-2 text-white">
                        <label className="text-sm font-medium">
                          Fallback Destination
                        </label>
                        <p className="text-xs">
                          Set a fallback destination for inbound calls when the
                          assistant or squad is not available.
                        </p>
                        <PhoneInput
                          defaultCountry="IN"
                          placeholder="Enter phone number"
                          value={value}
                          onChange={setValue}
                          className="custom-phone-input"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Outbound settings  */}
                <Card className="w-full mt-4 bg-zinc-900">
                  <CardHeader>
                    <CardTitle>Inbound Settings</CardTitle>
                    <Separator className="bg-zinc-500" />
                    <CardDescription className="text-xs">
                      You can assign an assistant to the phone number so that
                      whenever someone calls this phone number, the assistant
                      will automatically be assigned to the call.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid w-full items-center gap-1.5 mt-4">
                      <Label htmlFor="inboundNumber">Phone Number Name</Label>
                      <Input
                        type="number"
                        id="inboundNumber"
                        placeholder="+91 1234567890"
                        disabled
                      />
                    </div>

                    <div className="w-full mt-4">
                      <Label htmlFor="inboundAssistant" className="mb-2">
                        Select Assistant
                      </Label>
                      <Popover
                        id="inboundAssistant"
                        open={outOpenassistant}
                        onOpenChange={outSetOpenAssistant}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={outOpenassistant}
                            className="w-full justify-between"
                          >
                            {outAssistantValue
                              ? out_assistants.find(
                                  (assistant) =>
                                    assistant.value === outAssistantValue
                                )?.label
                              : "Select assistant..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[550px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search assistant..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No assistant found.</CommandEmpty>
                              <CommandGroup>
                                {out_assistants.map((assistant) => (
                                  <CommandItem
                                    key={assistant.value}
                                    value={assistant.value}
                                    onSelect={(currentValue) => {
                                      setOutAssistantValue(
                                        currentValue === outAssistantValue
                                          ? ""
                                          : currentValue
                                      );
                                      outSetOpenAssistant(false);
                                    }}
                                  >
                                    {assistant.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        outAssistantValue === assistant.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="w-full mt-4">
                      <Label htmlFor="inboundSquad" className="mb-2">
                        Select Squad
                      </Label>
                      <Popover
                        id="inboundSquad"
                        open={outOpenSquad}
                        onOpenChange={setOutOpenSquad}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={outOpenSquad}
                            className="w-full justify-between"
                          >
                            {outSquadValue
                              ? out_squads.find(
                                  (squad) => squad.value === outSquadValue
                                )?.label
                              : "Select squad..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[550px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search squad..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No squad found.</CommandEmpty>
                              <CommandGroup>
                                {out_squads.map((squad) => (
                                  <CommandItem
                                    key={squad.value}
                                    value={squad.value}
                                    onSelect={(currentValue) => {
                                      setOutSquadValue(
                                        currentValue === outSquadValue
                                          ? ""
                                          : currentValue
                                      );
                                      setOutOpenSquad(false);
                                    }}
                                  >
                                    {squad.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        outSquadValue === squad.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="w-full mt-4">
                      <div className="flex flex-col gap-2 text-white">
                        <label className="text-sm font-medium">
                          Fallback Destination
                        </label>
                        <p className="text-xs">
                          Set a fallback destination for inbound calls when the
                          assistant or squad is not available.
                        </p>
                        <PhoneInput
                          defaultCountry="IN"
                          placeholder="Enter phone number"
                          value={value}
                          onChange={setValue}
                          className="custom-phone-input"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <DialogContent className="min-w-fit">
          <DialogHeader>
            <DialogTitle>Phone Number</DialogTitle>
            <DialogDescription>
              Add a new phone number to your account.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="twilio" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-zinc-700">
              <TabsTrigger value="twilio" className="cursor-pointer">
                Import Twilio
              </TabsTrigger>
              <TabsTrigger value="vonage" className="cursor-pointer">
                Import Vonage
              </TabsTrigger>
              <TabsTrigger value="telnyx" className="cursor-pointer">
                Import Telnyx
              </TabsTrigger>
              <TabsTrigger value="byosip" className="cursor-pointer">
                BYO SIP Trunk Number
              </TabsTrigger>
            </TabsList>
            {/* page for twilio  */}
            <TabsContent value="twilio">
              <div className="w-full">
                <div className="flex flex-col gap-2 text-muted-foreground mt-3">
                  <label className="text-sm font-medium">
                    Twilio Phone Number
                  </label>
                  <PhoneInput
                    defaultCountry="IN"
                    placeholder="Enter phone number"
                    value={value}
                    onChange={setValue}
                    className="custom-phone-input"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5 mt-3 text-muted-foreground">
                  <Label htmlFor="twilio-sid">Twilio Account SID</Label>
                  <Input
                    type="text"
                    id="twilio-sid"
                    placeholder="Twilio Account SID"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5 mt-3 text-muted-foreground">
                  <Label htmlFor="twilio-token">Twilio Auth Token</Label>
                  <Input
                    type="text"
                    id="twilio-token"
                    placeholder="Twilio Auth Token"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5 mt-3 text-muted-foreground">
                  <Label htmlFor="label">Label</Label>
                  <Input
                    type="text"
                    id="label"
                    placeholder="Label for phone number"
                  />
                </div>
              </div>
            </TabsContent>
            {/* page for vonage  */}
            <TabsContent value="vonage">
              <div className="w-full">
                <div className="flex flex-col gap-2 text-muted-foreground mt-3">
                  <label className="text-sm font-medium">
                    Vonage Phone Number
                  </label>
                  <PhoneInput
                    defaultCountry="IN"
                    placeholder="Enter phone number"
                    value={value}
                    onChange={setValue}
                    className="custom-phone-input"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5 mt-3 text-muted-foreground">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input type="text" id="api-key" placeholder="Enter API Key" />
                </div>
                <div className="grid w-full items-center gap-1.5 mt-3 text-muted-foreground">
                  <Label htmlFor="api-secret">API Secret</Label>
                  <Input
                    type="text"
                    id="api-secret"
                    placeholder="Enter API Secret"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5 mt-3 text-muted-foreground">
                  <Label htmlFor="label">Label</Label>
                  <Input
                    type="text"
                    id="label"
                    placeholder="Label for phone number"
                  />
                </div>
              </div>
            </TabsContent>
            {/* page for telnyx  */}
            <TabsContent value="telnyx">
              <div className="w-full">
                <div className="flex flex-col gap-2 text-muted-foreground mt-3">
                  <label className="text-sm font-medium">
                    Vonage Phone Number
                  </label>
                  <PhoneInput
                    defaultCountry="IN"
                    placeholder="Enter phone number"
                    value={value}
                    onChange={setValue}
                    className="custom-phone-input"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5 mt-3 text-muted-foreground">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input type="text" id="api-key" placeholder="Enter API Key" />
                </div>
                <div className="grid w-full items-center gap-1.5 mt-3 text-muted-foreground">
                  <Label htmlFor="label">Label</Label>
                  <Input
                    type="text"
                    id="label"
                    placeholder="Label for phone number"
                  />
                </div>
              </div>
            </TabsContent>
            {/* page for byosip  */}
            <TabsContent value="byosip">
              <div className="w-full">
                <div className="grid w-full items-center gap-1.5 mt-3 text-muted-foreground">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input
                    type="number"
                    id="phone-number"
                    placeholder="+1 1234567890"
                  />
                </div>
                <div className="items-top flex space-x-2 mt-4 text-muted-foreground">
                  <Checkbox id="terms1" className="cursor-pointer" />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Allow non-E164 phone numbers
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Check this box to disable E164 format validation and use
                      custom phone number formats.
                    </p>
                  </div>
                </div>
                <div className="grid w-full items-center gap-1.5 mt-3 text-muted-foreground">
                  <Label htmlFor="sip-trunk">SIP Trunk Credential</Label>
                  <Select>
                    <SelectTrigger className="w-full" id="sip-trunk">
                      <SelectValue placeholder="All credentials" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>All credentials</SelectLabel>
                        <SelectItem value="credential-1">
                          credential 1
                        </SelectItem>
                        <SelectItem value="credential-2">
                          credential 2
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-full items-center gap-1.5 mt-3 text-muted-foreground">
                  <Label htmlFor="label">Label</Label>
                  <Input
                    type="number"
                    id="label"
                    placeholder="Label for phone number"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button className="cursor-pointer" type="submit" disabled>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhoneNumber;
