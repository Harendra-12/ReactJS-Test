import { Button } from "@/components/ui/button";
import { generalPostFunction } from "@/globalFunctions/globalFunction";
import { cn } from "@/lib/utils";
import { PhoneOff, PhoneOutgoing, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import { toast } from "sonner";

const retellWebClient = new RetellWebClient();

const RetellCallComponent = ({ agentId, transcript, setTranscript }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const transcriptRef = useRef([]); // Holds the latest value always

  useEffect(() => {
    // Auto-start on mount
    toggleConversation();

    // Setup event listeners
    retellWebClient.on("call_started", () => {
      console.log("✅ Call started");
    });

    retellWebClient.on("call_ended", () => {
      console.log("📞 Call ended");
      setIsCalling(false);
      setIsLoading(false);
    });

    retellWebClient.on("agent_start_talking", () => {
      console.log("🗣️ Agent started talking");
    });

    retellWebClient.on("agent_stop_talking", () => {
      console.log("🔇 Agent stopped talking");
    });

    retellWebClient.on("audio", (audio) => {
      console.log("🎧 Audio chunk received:", audio);
    });

    retellWebClient.on("update", (update) => {
      if (update.transcript) {
        handleTranscript(
          update.transcript[update.transcript.length - 1].role,
          update.transcript[update.transcript.length - 1].content
        );
      }
    });

    retellWebClient.on("metadata", (metadata) => {
      console.log("ℹ️ Metadata received:", metadata);
    });

    retellWebClient.on("error", (error) => {
      console.error("❌ Error:", error);
      retellWebClient.stopCall();
      setIsCalling(false);
      setIsLoading(false);
    });
  }, []);

  const toggleConversation = async () => {
    setIsLoading(true);

    if (isCalling) {
      // Stop the call
      try {
        await retellWebClient.stopCall();
      } catch (err) {
        console.error("Failed to stop call:", err);
      } finally {
        setIsCalling(false);
        setIsLoading(false);
      }
    } else {
      // Start the call
      try {
        const token = await registerCall(agentId);
        if (token) {
          await retellWebClient.startCall({ accessToken: token });
          setIsCalling(true);
        }
      } catch (err) {
        console.error("Failed to start call:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const registerCall = async (agentId) => {
    try {
      const response = await generalPostFunction(`/call/create-web-call`, {
        agent_id: agentId,
      });
      if (response.status) {
        return response.data.access_token;
      } else {
         toast.error(response.error);
        // throw new Error("Failed to register call");
       
      }
    } catch (err) {
      console.error("Call registration failed:", err);
      return null;
    }
  };

  function handleTranscript(role, text) {
    const currentTranscript = transcriptRef.current;

    if (
      currentTranscript.length > 0 &&
      currentTranscript[currentTranscript.length - 1].role === role
    ) {
      const updatedTranscript = [...currentTranscript];
      updatedTranscript[updatedTranscript.length - 1].content = text;
      transcriptRef.current = updatedTranscript;
      setTranscript(updatedTranscript);
    } else {
      const newTranscript = [...currentTranscript, { role, content: text }];
      transcriptRef.current = newTranscript;
      setTranscript(newTranscript);
    }
  }

  return (
    <Button
      onClick={toggleConversation}
      variant="outline"
      disabled={isLoading}
      className={cn(
        isCalling ? "text-red-800 hover:text-red-600" : "text-green-800 hover:text-green-600",
        "flex items-center justify-center w-full rounded-md cursor-pointer"
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          {isCalling ? "Stopping..." : "Starting..."}
        </>
      ) : isCalling ? (
        <>
          <PhoneOff className="mr-2 h-4 w-4" /> Stop
        </>
      ) : (
        <>
          <PhoneOutgoing className="mr-2 h-4 w-4" /> Start
        </>
      )}
    </Button>
  );
};

export default RetellCallComponent;
