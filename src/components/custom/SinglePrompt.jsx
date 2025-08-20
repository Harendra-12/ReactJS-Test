import React, { useEffect, useRef, useState } from "react";
import GlobalSettings from "./ReactFlow/customFeatures/NodeEditSection/GlobalSettings";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Info, MessageCircle, Mic, Phone, PhoneOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import RetellWebCall from "./ReactFlow/customFeatures/NodeEditSection/RetellWebCall";

import RetellCallComponent from "./ReactFlow/customFeatures/NodeEditSection/RetellCallComponent";
import LivekitCallComponent from "./ReactFlow/customFeatures/NodeEditSection/LivekitCallComponent";

const SinglePrompt = ({
  defaultName,
  setDefaultName,
  newAgent,
  saveClicked,
  agentData,
  llmData,
  allWorkSpaces,
  loading,
  setLoading,
}) => {
  const [begin_message, setBeginMessage] = useState("");
  const [general_prompt, setGeneralPrompt] = useState("");
  const [testCallToken, setTestCallToken] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const transcriptEndRef = useRef(null);
  const [agentId, setAgentId] = useState(agentData?.agent_id);
  useEffect(() => {
    setAgentId(agentData?.agent_id);
  }, [agentData]);
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript]);
  // async function handleTestCall() {
  //   const apiData = await generalPostFunction(`/call/create-web-call`, {
  //     agent_id: agentData?.agent_id,
  //   });
  //   if (apiData.status) {
  //     setTestCallToken(apiData.data.access_token);
  //   }
  // }
  return (
    <div className="h-full w-full flex gap-3 mt-2">
      {/* prompt section */}
      <div className="w-2/4 h-full bg-neutral-900 rounded-md px-5 pt-5 flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="welcome-message">Welcome Message</Label>
          <Textarea
            id="prompt"
            className={"h-[50px]"}
            placeholder="Type the message that will be sent to the user when the agent is started."
            value={begin_message}
            onChange={(e) => setBeginMessage(e.target.value)}
          />
        </div>
        <div className="gap-2 flex flex-col">
          <Label htmlFor="prompt">General prompt</Label>
          <Textarea
            id="prompt"
            value={general_prompt}
            onChange={(e) => setGeneralPrompt(e.target.value)}
            className={"h-[400px]"}
            placeholder="Type in a universal prompt for your agent, such as it's role, conversational style, objective, etc."
          />
        </div>
      </div>
      {/* prompt config section */}
      <div className="w-1/4 h-full bg-neutral-900 rounded-md px-5 pt-2 overflow-y-auto">
        <ScrollArea className="w-full h-[750px]">
          <GlobalSettings
            defaultName={defaultName}
            setDefaultName={setDefaultName}
            generalPrompt={general_prompt}
            beginMessage={begin_message}
            newAgent={newAgent}
            saveClicked={saveClicked}
            agentData={agentData}
            setAgentId={setAgentId}
            llmData={llmData}
            setBeginMessage={setBeginMessage}
            setGeneralPrompt={setGeneralPrompt}
            allWorkSpaces={allWorkSpaces}
            loading={loading}
            setLoading={setLoading}
          />
        </ScrollArea>
      </div>
      {/* agent test section */}
      <div className="w-1/4 h-full bg-neutral-900 rounded-md flex  justify-center">
        <Tabs defaultValue="test-audio" className={"w-full h-full"}>
          <TabsList className={"w-full"}>
            <TabsTrigger value="test-audio">
              <span className=" flex items-center justify-center w-full cursor-pointer">
                <Phone />
                Test Audio
              </span>
            </TabsTrigger>
            {/* <TabsTrigger value="test-llm">
              <span className=" flex items-center justify-center w-full cursor-pointer">
                <MessageCircle />
                Test LLM
              </span>
            </TabsTrigger> */}
          </TabsList>
          <TabsContent value="test-audio">
            {testCallToken ? (
              <div className="h-full w-full flex items-start justify-center">
                {/* <RetellWebCall token={testCallToken} /> */}
                <div className="w-full items-center justify-center flex flex-col">
                  <div className="w-full h-full flex justify-center items-center">
                    <div className="w-full max-w-md p-4 rounded-lg shadow-md ">
                      <div className="flex flex-col gap-4">
                        <div className="space-y-2 flex flex-col">
                          <ScrollArea className="w-full h-[600px]">
                            {transcript.map((msg, index) => (
                              <div
                                key={index}
                                className={` flex max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 my-2 text-sm${
                                  msg.role === "agent"
                                    ? "  bg-muted"
                                    : " bg-primary text-primary-foreground ml-auto"
                                }`}
                              >
                                {msg.content}
                              </div>
                            ))}
                            <div ref={transcriptEndRef} />
                          </ScrollArea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator className={"mb-2"} />

                  {/* <RetellCallComponent
                    agentId={agentId}
                    transcript={transcript}
                    setTranscript={setTranscript}
                  /> */}
                  <LivekitCallComponent
                    agentId={agentId}
                    transcript={transcript}
                    setTranscript={setTranscript}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col item-center justify-center mx-auto">
                <div className="w-full flex items-center justify-center ">
                  <Mic className="w-10 h-10 cursor-pointer text-muted-foreground" />
                </div>
                <div className="flex flex-items-center justify-center flex-row items-center">
                  <p>Test your agent</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-white cursor-pointer ml-2" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Call transfer only works on phone calls, not web calls.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center justify-center mt-2">
                  <Button
                    variant="outline"
                    className={"w-20 cursor-pointer"}
                    onClick={() => setTestCallToken(true)}
                    disabled={!agentId}
                  >
                    Test
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="test-llm"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SinglePrompt;

// const messages = [
//   { text: "Hello!", sender: "left" },
//   { text: "Hi! How are you?", sender: "right" },
//   {
//     text: "I'm good, thanks!ASDFGSD FGH DFG HDFJFGHJFGHJK GHJK GHJKLJHUKLRTYJRTYR6YTLKHSMNK kjabnoi;adjsgweopsfg asdmlfgher5n 4rheryjhuke, nsf5h7j",
//     sender: "left",
//   },
//   {
//     text: "Glad to hear that! uighi nlksnc uigdkcn asduifc adiob adkfb sfrghmsd sfodkhimn mefsbjk aswr gbl;qem,kafpkg asdflgnkwqr gb sDLFV BWRTNJHADFOICJVSDFGH SFRGOIJV LZXD FBOKSRFGN  ",
//     sender: "right",
//   },
//   { text: "Hello!", sender: "left" },
//   { text: "Hi! How are you?", sender: "right" },
//   { text: "I'm good, thanks!", sender: "left" },
//   { text: "Glad to hear that!", sender: "right" },
//   { text: "Hello!", sender: "left" },
//   { text: "Hi! How are you?", sender: "right" },
//   { text: "I'm good, thanks!", sender: "left" },
//   { text: "Glad to hear that!", sender: "right" },
//   { text: "Hello!", sender: "left" },
//   { text: "Hi! How are you?", sender: "right" },
//   { text: "I'm good, thanks!", sender: "left" },
//   { text: "Glad to hear that!", sender: "right" },
//   { text: "Hello!", sender: "left" },
//   { text: "Hi! How are you?", sender: "right" },
//   { text: "I'm good, thanks!", sender: "left" },
//   { text: "Glad to hear that!", sender: "right" },
//   { text: "Hello!", sender: "left" },
//   { text: "Hi! How are you?", sender: "right" },
//   { text: "I'm good, thanks!", sender: "left" },
//   { text: "Glad to hear that!", sender: "right" },
//   { text: "Hello!", sender: "left" },
//   { text: "Hi! How are you?", sender: "right" },
//   { text: "I'm good, thanks!", sender: "left" },
//   { text: "Glad to hear that!", sender: "right" },
//   { text: "Hello!", sender: "left" },
//   { text: "Hi! How are you?", sender: "right" },
//   { text: "I'm good, thanks!", sender: "left" },
//   { text: "Glad to hear that!", sender: "right" },
//   { text: "Hello!", sender: "left" },
//   { text: "Hi! How are you?", sender: "right" },
//   { text: "I'm good, thanks!", sender: "left" },
//   { text: "Glad to hear that!", sender: "right" },
// ];
