import Reactflow from "@/components/custom/ReactFlow/Reactflow";
import Simulations from "@/components/custom/Simulations";
import SinglePrompt from "@/components/custom/SinglePrompt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChartPie, Copy, Dot, Loader2, PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export default function ConversationsFlow() {
  console.log("Inside ");
  const location = useLocation();
  const locationState = location.state;
  const navigate = useNavigate();
  const [defaultName, setDefaultName] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const createAgentType = useSelector((state) => state.app.createAgentType);
  const [saveClicked, setSaveClicked] = useState(0);
  const [agentData, setAgentData] = useState();
  const [loading, setLoading] = useState(false);
  const [allWorkSpaces, setAllWorkSpaces] = useState([]);

  useEffect(() => {
    if (locationState.agentName) {
      setDefaultName(locationState.agentName);
      setAgentData(locationState.agentData);
      setAllWorkSpaces(locationState.allWorkSpaces || []);
    } else {
      navigate(-1);
    }
  }, []);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <div className="flex justify-between w-full">
            <div className="flex gap-2 items-center">
              {isEdit ? (
                <Input
                  className={"w-[300px]"}
                  defaultValue={defaultName}
                  onChange={(e) => setDefaultName(e.target.value)}
                  onBlur={() => setIsEdit(false)}
                />
              ) : (
                <h1 className="text-2xl font-bold">{defaultName}</h1>
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
            <Button
              onClick={() => setSaveClicked(saveClicked + 1)}
              className={"cursror-pointer"}
            >
              {locationState.unique ? (
                <>
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Saving..
                    </>
                  ) : (
                    <>Save</>
                  )}
                </>
              ) : (
                <>
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Updating..
                    </>
                  ) : (
                    <>Update</>
                  )}{" "}
                </>
              )}
            </Button>
          </div>
          {locationState.unique ? (
            ""
          ) : (
            <div className="text-muted-foreground flex items-center text-xs mt-2">
              <p className="flex gap-2">
                Agent ID: {agentData?.agent_id}
                <Copy className="h-4 w-4 cursor-pointer" />
              </p>
              <Dot />
              {/* <p className="flex gap-2">
                Conversation Flow ID: 
                <Copy className="h-4 w-4 cursor-pointer" />
              </p> */}
              {/* <Dot /> */}
              <p className="flex gap-2">
                $0.12/min
                {/* <ChartPie className="h-4 w-4 cursor-pointer" /> */}
                <Tooltip>
                  <TooltipTrigger className="cursor-pointer">
                    <ChartPie className="h-4 w-4 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="relative bg-zinc-900 text-white text-sm rounded-md p-3 shadow-lg w-64">
                    <div className="font-semibold flex justify-between mb-1">
                      <span>Cost per minute</span>
                      <span className="text-white/90">$0.12/min</span>
                    </div>
                    <div className="text-white/80 space-y-1">
                      <div className="flex justify-between">
                        <span>- Voice Engine: 11labs</span>
                        <span>$0.07/min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>- LLM: gpt-4o</span>
                        <span>$0.05/min</span>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </p>
              {/* <Dot /> */}
              {/* <p className="flex gap-2">
                2920-3250ms latency
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ChartPie className="h-4 w-4 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent
                    className={
                      "bg-zinc-900 text-white text-sm rounded-md p-3 shadow-lg w-64"
                    }
                  >
                    <div className="font-semibold flex justify-between mb-1">
                      <span>Cost per minute</span>
                      <span className="text-white/90">$0.12/min</span>
                    </div>
                    <div className="text-white/80 space-y-1">
                      <div className="flex justify-between">
                        <span>- Voice Engine: 11labs</span>
                        <span>$0.07/min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>- LLM: gpt-4o</span>
                        <span>$0.05/min</span>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </p>
              <Dot />
              <p className="flex gap-2">Auto saved at 16:06</p> */}
            </div>
          )}
        </div>
        {/* <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
          Create New Flow
        </button> */}
      </div>
      <div className="flex items-center justify-center">
        <Tabs defaultValue="create" className="w-full">
          <div className="flex items-center justify-center w-full">
            <TabsList className="grid grid-cols-2 !bg-transparent w-[400px] text-center">
              <TabsTrigger
                value="create"
                className="text-xl cursor-pointer rounded-none !bg-transparent border-0 !border-b-2 border-transparent data-[state=active]:!bg-transparent data-[state=active]:!shadow-none data-[state=active]:!border-white hover:!bg-transparent"
              >
                {locationState.unique ? "Create" : "Update"}
              </TabsTrigger>
              {/* <TabsTrigger
                value="simulation"
                className="text-xl cursor-pointer rounded-none !bg-transparent border-0 !border-b-2 border-transparent data-[state=active]:!bg-transparent data-[state=active]:!shadow-none data-[state=active]:!border-white hover:!bg-transparent"
              >
                Simulation
              </TabsTrigger> */}
            </TabsList>
          </div>
          <TabsContent value="create">
            <div className="grid gap-4 h-1/2">
              {/* Sample Flow Cards */}
              {console.log(
                "locationState.allWorkSpaces: ",
                locationState.allWorkSpaces
              )}
              {true ? (
                <SinglePrompt
                  defaultName={defaultName}
                  setDefaultName={setDefaultName}
                  newAgent={locationState.unique}
                  saveClicked={saveClicked}
                  agentData={agentData}
                  llmData={locationState.llmData}
                  allWorkSpaces={locationState.allWorkSpaces}
                  loading={loading}
                  setLoading={setLoading}
                />
              ) : (
                <Reactflow />
              )}
            </div>
          </TabsContent>
          <TabsContent value="simulation">
            <Simulations />
          </TabsContent>
        </Tabs>
      </div>

      {/* <div className="grid gap-4 min-h-200"> */}
      {/* Sample Flow Cards */}
      {/* <Reactflow />
      </div> */}
    </div>
  );
}
