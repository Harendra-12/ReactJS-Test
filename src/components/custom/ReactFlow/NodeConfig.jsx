import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { useSelector } from "react-redux";
import ConversationEdit from "./customFeatures/NodeEditSection/ConversationEdit";
import GlobalSettings from "./customFeatures/NodeEditSection/GlobalSettings";
import { ScrollArea } from "@/components/ui/scroll-area";
import CallTransfarEdit from "./customFeatures/NodeEditSection/CallTransfarEdit";
import PressDigitEdit from "./customFeatures/NodeEditSection/PressDigitEdit";

const NodeConfig = () => {
  const clickedNodeType = useSelector((state) => state.app.clickedNodeType);

  return (
    <ScrollArea className="w-[400px] h-[600px]">
      <div className="">
        <Tabs defaultValue="nodeSettings">
          <TabsList className="grid grid-cols-2 w-full gap-1 bg-slate-600 text-muted-foreground">
            <TabsTrigger
              value="nodeSettings"
              className="bg-slate-900 cursor-pointer"
            >
              {clickedNodeType && clickedNodeType === "global"
                ? "Global Settings"
                : "Node Settings"}
            </TabsTrigger>
            <TabsTrigger
              value="testFlow"
              className="bg-slate-900 cursor-pointer"
            >
              Test Flow
            </TabsTrigger>
          </TabsList>
          <Separator className="my-2" />
          <TabsContent value="nodeSettings" className={"px-3"}>
            {clickedNodeType && clickedNodeType === "global" && (
              <GlobalSettings />
            )}
            {clickedNodeType && clickedNodeType === "conversation" && (
              <ConversationEdit />
            )}
            {clickedNodeType && clickedNodeType === "callTransfer" && (
              <CallTransfarEdit />
            )}
            {clickedNodeType && clickedNodeType === "pressDigit" && (
              <PressDigitEdit />
            )}
          </TabsContent>
          <TabsContent value="testFlow">
            <h1>This is test flow</h1>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default NodeConfig;
