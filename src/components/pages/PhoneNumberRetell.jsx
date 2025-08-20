import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Copy,
  CopyIcon,
  Dot,
  Info,
  Loader2,
  PencilLine,
  Phone,
  Plus,
  Trash,
} from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import {
  generalDeleteFunction,
  generalGetFunction,
  generalPostFunction,
  generalPutFunction,
} from "@/globalFunctions/globalFunction";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Loading from "../commonComponents/Loading";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PhoneNumberRetell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allWorkspacesData = useSelector((state) => state.allWorkspaces);

  const [defaultName, setDefaultName] = useState(Date.now().toString());
  const [isEdit, setIsEdit] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);
  const [numberProvider, setNumberProvider] = useState("twilio");
  const [inboundCallAgent, setInboundCallAgent] = useState();
  const [outboundCallAgent, setOutboundCallAgent] = useState();
  const [areaCode, setAreaCode] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [selectedNumber, setSelectedNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [availableNumbers, setAvailableNumbers] = useState([]);
  const [allWorkSpaces, setAllWorkSpaces] = useState([]);
  const [loadingCount, setLoadingCount] = useState(0);

  const incrementLoading = () => setLoadingCount((count) => count + 1);
  const decrementLoading = () =>
    setLoadingCount((count) => Math.max(count - 1, 0));

  const isLoading = loadingCount > 0;

  useEffect(() => {
    fetchAvailableNumbers();
    if (
      allWorkspacesData?.length === 0 ||
      allWorkspacesData === null ||
      allWorkspacesData === undefined
    ) {
      allWorkspacea();
    } else {
      setAllWorkSpaces(allWorkspacesData[0]);
    }
  }, []);

  useEffect(() => {
    if (allWorkSpaces?.id) {
      fetchAvailableAgents();
    }
  }, [allWorkSpaces]);

  const allWorkspacea = async () => {
    incrementLoading(); // Start loading
    try {
      const apiData = await generalGetFunction("/workspaces");
      if (apiData.status) {
        setAllWorkSpaces(apiData.data[0]);
        dispatch({
          type: "SET_ALL_WORKSPACES",
          payload: apiData.data[0],
        });
      } else {
        localStorage.clear("token");
        navigate("/sign-in");
        console.error("Failed to fetch workspaces");
      }
    } catch (error) {
      console.error("An error occurred while fetching workspaces:", error);
    } finally {
      decrementLoading(); // Stop loading
    }
  };

  const fetchAvailableAgents = async () => {
    incrementLoading(); // Start loading
    try {
      const res = await generalGetFunction(`/all-agents/${allWorkSpaces.id}`);
      if (res.status) {
        setAvailableAgents(res.data);
        // setInboundCallAgent(res.data[0]?.agent_id);
        // setOutboundCallAgent(res.data[0]?.agent_id);
      } else {
        console.error("Failed to fetch available LLMs");
      }
    } catch (error) {
      console.error("An error occurred while fetching available LLMs:", error);
    } finally {
      decrementLoading(); // Stop loading
    }
  };
  const fetchAvailableNumbers = async () => {
    // const res = await generalGetFunction("/phonenumber/all");
    incrementLoading(); // Start loading
    try {
      const res = await generalGetFunction("/list-phone-numbers");
      if (res.status) {
        setAvailableNumbers(res.data);
        if (res.data[0]) {
          const firstNumber = res.data[0];
          setSelectedNumber(firstNumber.phone_number);
          setDefaultName(
            firstNumber.nickname || firstNumber.phone_number || ""
          );
          setAreaCode(firstNumber.area_code || "");
          setWebhookUrl(firstNumber.inbound_webhook_url || "");
          setInboundCallAgent(firstNumber.inbound_agent_id || "");
          setOutboundCallAgent(firstNumber.outbound_agent_id || "");
          setNumberProvider(firstNumber.number_provider || "twilio");
        }
      } else {
        console.error("Failed to fetch available phone numbers");
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching available phone numbers:",
        error
      );
    } finally {
      decrementLoading(); // Stop loading
    }
  };

  const selectedAgent = (agentId) => {
    return availableAgents.find((agent) => agent.agent_id === agentId);
  };
  const handleCreateNumber = async () => {
    const inboundAgent = selectedAgent(inboundCallAgent);
    const outboundAgent = selectedAgent(outboundCallAgent);

    // Convert area code to integer or null if empty/invalid
    const parsedAreaCode = areaCode ? parseInt(areaCode, 10) : null;
    if (areaCode && isNaN(parsedAreaCode)) {
      toast.error("Area code must be a valid number");
      return;
    }

    const payload = {
      inbound_agent_id: inboundAgent ? inboundAgent.agent_id : null,
      inbound_agent_name: inboundAgent ? inboundAgent.agent_name : null,
      inbound_agent_version: inboundAgent ? inboundAgent.version : null,
      outbound_agent_id: outboundAgent ? outboundAgent.agent_id : null,
      area_code: parsedAreaCode,
      nickname: defaultName ? defaultName : null,
      inbound_webhook_url: webhookUrl ? webhookUrl : null,
      number_provider: numberProvider ? numberProvider : "twilio",
    };

    setLoading(true);
    // const res = await generalPostFunction("/phonenumber/store", payload);
    const res = await generalPostFunction("/purchase-phone-number", payload);
    // const res=0
    if (res?.status) {
      setAvailableNumbers([...availableNumbers, res.data]);
      setDefaultName(res?.data?.nickname || res?.data?.phone_number || "");
      setAreaCode("");
      setWebhookUrl("");
      setInboundCallAgent("");
      setOutboundCallAgent("");
      setNumberProvider("twilio");
      setShowUrlField(false);
      fetchAvailableAgents();
      fetchAvailableNumbers();
      toast.success("Phone number created successfully!");
    } else {
      console.error("Faild to create phone number: ", res);
      setLoading(false);
      toast.error("Failed to create phone number. Please try again.");
    }

    setLoading(false);
  };
  const handleUpdateNumber = async (updatedData = {}) => {
    if (!selectedNumber) {
      toast.error("Please select a phone number to update.");
      return;
    }

    const inboundAgent = selectedAgent(
      updatedData.inboundCallAgent || inboundCallAgent
    );
    const outboundAgent = selectedAgent(
      updatedData.outboundCallAgent || outboundCallAgent
    );

    // Prepare the payload with all required fields
    const newAreaCode = updatedData.areaCode || areaCode;
    const parsedAreaCode = newAreaCode ? parseInt(newAreaCode, 10) : null;
    if (newAreaCode && isNaN(parsedAreaCode)) {
      toast.error("Area code must be a valid number");
      return;
    }

    const payload = {
      phone_number: selectedNumber,
      inbound_agent_id: inboundAgent ? inboundAgent.agent_id : null,
      outbound_agent_id: outboundAgent ? outboundAgent.agent_id : null,
      // inbound_agent_version: inboundAgent ? inboundAgent.version : null,
      // outbound_agent_version: outboundAgent ? outboundAgent.version : null,
      // area_code: parsedAreaCode,
      nickname: updatedData.defaultName || defaultName || null,
      // inbound_webhook_url: updatedData.webhookUrl || webhookUrl || null,
      // number_provider: updatedData.numberProvider || numberProvider || "twilio",
    };

    console.log("update numbr payload: ", payload);
    setLoading(true);
    try {
      const res = await generalPutFunction(
        // `/phonenumber/update/${selectedNumber}`,
        `/update-phone-number/${selectedNumber}`,
        payload
      );
      if (res.status) {
        await Promise.all([fetchAvailableAgents(), fetchAvailableNumbers()]);
        toast.success("Phone number updated successfully!");
      } else {
        console.error("Failed to update phone number: ", res);
        toast.error("Failed to update phone number. Please try again.");
      }
    } catch (error) {
      console.error("Error updating phone number:", error);
      toast.error("Failed to update phone number. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNumber = async () => {
    if (!selectedNumber) {
      toast.error("Please select a phone number to delete.");
      return;
    }
    setLoading(true);
    const res = await generalDeleteFunction(
      // `/phonenumber/delete/${selectedNumber}`
      `/delete-phone-number/${selectedNumber}`
    );
    if (res.status) {
      setAvailableNumbers(
        availableNumbers.filter((num) => num.phone_number !== selectedNumber)
      );
      setSelectedNumber("");
      setDefaultName("");
      setAreaCode("");
      setWebhookUrl("");
      setInboundCallAgent("");
      setOutboundCallAgent("");
      setNumberProvider("twilio");
      setShowUrlField(false);
      fetchAvailableAgents();
      toast.success("Phone number deleted successfully!");
    } else {
      console.error("Failed to delete phone number: ", res);
      toast.error("Failed to delete phone number. Please try again.");
    }
    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }
  {
    if (isLoading) return <Loading />;
  }
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full">
        <div>
          <h1 className="text-2xl font-bold">Phone Retell</h1>
          <p className="text-gray-600">
            You can manage your retell phone numbers here.
          </p>
        </div>

        <div className="h-full flex flex-col md:flex-row items-center justify-between gap-2">
          {/* All the available numbers  */}
          <div className="bg-white dark:bg-zinc-900 rounded-md shadow-md p-4 flex-1 max-w-sm h-full">
            <div className="flex items-center justify-between mb-2">
              <h1 className="font-bold text-2xl">Available Numbers</h1>
              <Dialog asChild>
                <DialogTrigger asChild>
                  <Button size="icon" className="cursor-pointer">
                    <Plus />
                  </Button>
                </DialogTrigger>
                <DialogContent className={"sm:maz-w-[400px] w-full"}>
                  <div className="w-full">
                    <DialogTitle className="text-lg font-semibold mb-4">
                      Buy Phone Number
                    </DialogTitle>
                    <div className="flex flex-col gap-4">
                      {/* <RadioGroup
                        value={numberProvider}
                        onValueChange={setNumberProvider}
                        className={"flex w-full"}
                      >
                        <div className="flex items-center justify-between text-xl space-x-2 border rounded-md p-4 w-1/2">
                          <Label htmlFor="r1">Twilio</Label>
                          <RadioGroupItem
                            value="twilio"
                            id="r1"
                            className={"cursor-pointer"}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xl space-x-2 border rounded-md p-4 w-1/2">
                          <Label htmlFor="r2">Telnyx</Label>
                          <RadioGroupItem
                            value="telnyx"
                            id="r2"
                            className={"cursor-pointer"}
                            disabled
                          />
                        </div>
                      </RadioGroup> */}
                      <div className="grid w-full max-w-fullitems-center gap-1.5">
                        <Label htmlFor="area-code">Area Code (Optional)</Label>{" "}
                        <Input
                          type="text"
                          id="area-code"
                          placeholder="e.g. 650"
                          value={areaCode}
                          onChange={(e) => {
                            // Only allow numbers
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setAreaCode(value);
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2 bg-zinc-800 p-3 rounded-md text-muted-foreground">
                        <Info className="text-xs text-zinc-500" size={16} />
                        <p>This number incurs a monthly fee of $2.00</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="cursor-pointer">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      className="cursor-pointer"
                      type="submit"
                      disabled={numberProvider === "" || loading}
                      onClick={handleCreateNumber}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />{" "}
                          Saving...
                        </>
                      ) : (
                        <>Save changes</>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Separator className="my-2 bg-zinc-500" />
            <div className="flex flex-col gap-2">
              {availableNumbers.length === 0 ? (
                <div className="flex items-center justify-center p-2 border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 ">
                  <span>No numbers available</span>
                </div>
              ) : (
                availableNumbers.map((number, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-2 border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer",
                      {
                        "bg-zinc-100 dark:bg-zinc-700":
                          number?.phone_number === selectedNumber,
                      }
                    )}
                    onClick={() => {
                      // Update all state values when selecting a number
                      setSelectedNumber(number?.phone_number);
                      setDefaultName(
                        number?.nickname || number?.phone_number || ""
                      );
                      setAreaCode(number?.area_code || "");
                      setWebhookUrl(number?.inbound_webhook_url || "");
                      setInboundCallAgent(number?.inbound_agent_id || "");
                      setOutboundCallAgent(number?.outbound_agent_id || "");
                      setNumberProvider(number?.number_provider || "twilio");
                      setShowUrlField(!!number?.inbound_webhook_url);
                    }}
                  >
                    <span>{number?.phone_number}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Show all the numbers details and edit panels */}
          <div className="bg-white dark:bg-zinc-900 rounded-md shadow-md p-4 flex-1 w-full h-full flex">
            {selectedNumber ? (
              <div className="w-full h-full p-2 ">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex gap-2 items-center">
                      {" "}
                      {isEdit ? (
                        <Input
                          className={"w-[300px]"}
                          value={defaultName}
                          onChange={(e) => setDefaultName(e.target.value)}
                          onBlur={() => {
                            setIsEdit(false);
                            handleUpdateNumber({ defaultName });
                          }}
                        />
                      ) : (
                        <h1 className="text-xl">{defaultName}</h1>
                      )}
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        className={"cursor-pointer"}
                        onClick={() => setIsEdit(!isEdit)}
                      >
                        <PencilLine />
                      </Button>
                    </div>
                    <div className="text-muted-foreground flex items-center text-xs mt-2">
                      <p className="flex gap-2">
                        ID: {selectedNumber}{" "}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Copy
                                className="h-4 w-4 cursor-pointer"
                                onClick={() => {
                                  navigator.clipboard.writeText(selectedNumber);
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>Copy to clipboard</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </p>
                      {/* <Dot />
                      <p className="flex gap-2 capitalize">
                        Provider: {numberProvider}
                      </p> */}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* <Button className="cursor-pointer" disabled>
                      <Phone /> Make an outbound call
                    </Button> */}
                    <Dialog asChild>
                      <DialogTrigger asChild>
                        <Button
                          className="cursor-pointer text-red-800 hover:text-red-600"
                          variant="outline"
                          size={"icon"}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={"sm:max-w-[400px] w-full"}>
                        <DialogTitle className="text-lg font-semibold mb-4">
                          Delete Number
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                          <Info className="inline mr-2 text-red-800 h-6 w-6" />
                          Are you sure you want to delete this number?
                        </DialogDescription>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button
                              variant="outline"
                              className="cursor-pointer"
                            >
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            className="cursor-pointer"
                            type="submit"
                            onClick={handleDeleteNumber}
                            disabled={loading}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <Separator className="my-2 bg-zinc-500" />
                <div className="flex flex-col gap-4 max-w-2/4 w-full">
                  <div>
                    <Label className={"mb-2 "}>Inbound call agent</Label>{" "}
                    <Select
                      value={inboundCallAgent}
                      onValueChange={(value) => {
                        setInboundCallAgent(value);
                        handleUpdateNumber({ inboundCallAgent: value });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a agent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Agents</SelectLabel>
                          <SelectItem value={"null"}>
                            None (disabled inboung)
                          </SelectItem>
                          {availableAgents.map((agent) => (
                            <SelectItem
                              key={agent?.agent_id}
                              value={agent?.agent_id}
                            >
                              {agent?.agent_name} - Version: {agent?.version}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <Checkbox
                      onClick={() => {
                        setShowUrlField(!showUrlField);
                      }}
                      id="terms"
                      className={"cursor-pointer"}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Add an inbound webhook. (Learn more).
                    </label>
                  </div>
                  {showUrlField && (
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="url-field">Enter url</Label>{" "}
                      <Input
                        type="text"
                        id="url-field"
                        placeholder="Enter url"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        onBlur={() => {
                          handleUpdateNumber({ webhookUrl });
                        }}
                      />
                    </div>
                  )} */}
                  <div>
                    <Label className={"mb-2 "}>Outbound call agent</Label>{" "}
                    <Select
                      value={outboundCallAgent}
                      onValueChange={(value) => {
                        setOutboundCallAgent(value);
                        handleUpdateNumber({ outboundCallAgent: value });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a agent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Agents</SelectLabel>
                          <SelectItem value={"null"}>
                            None (disabled outbound)
                          </SelectItem>
                          {availableAgents.map((agent) => (
                            <SelectItem
                              key={agent?.agent_id}
                              value={agent?.agent_id}
                            >
                              {agent?.agent_name} - Version: {agent?.version}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <p className="text-gray-500">
                  Select a phone number to add details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PhoneNumberRetell;
