import { Button } from "@/components/ui/button";
import { generalPostFunction } from "@/globalFunctions/globalFunction";
import { cn } from "@/lib/utils";
import { Loader2, PhoneOff, PhoneOutgoing } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  LiveKitRoom,
  useRoomContext,
  useTracks,
  useParticipants,
} from "@livekit/components-react";
import { Room, RoomEvent, Track } from "livekit-client";

const RemoteAudio = () => {
  // Get all remote audio tracks (no source filter)
  const tracks = useTracks();
  return (
    <>
      {tracks
        .filter(
          (track) =>
            !track.participant.isLocal &&
            track.publication.kind === "audio" &&
            track.publication.track
        )
        .map((track) => (
          <audio
            key={track.trackSid}
            ref={(el) => {
              if (el && track.publication.track) {
                track.publication.track.attach(el);
                el.muted = false; // Ensure not muted
                el.autoplay = true;
              }
            }}
            autoPlay
          />
        ))}
    </>
  );
};

const LivekitCallComponent = ({ agentId, setTranscript }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roomUrl, setRoomUrl] = useState("");
  const [token, setToken] = useState("");
  const transcriptRef = useRef([]);
  const roomRef = useRef(null);

  useEffect(() => {
    toggleConversation();
    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
      }
    };
  }, []);

  const toggleConversation = async () => {
    setIsLoading(true);
    if (isCalling) {
      try {
        if (roomRef.current) {
          roomRef.current.disconnect();
          roomRef.current = null;
        }
        setIsCalling(false);
      } catch (err) {
        console.log("Error stopping call", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        // reset the transcript when start the new call
        setTranscript([]);
        transcriptRef.current = [];
        const response = await registerCall(agentId);
        if (response) {
          setRoomUrl(response.data.call_metadata.livekit_url);
          setToken(response.data.access_token);
          setIsCalling(true);
        }
      } catch (err) {
        console.log("Error while toggle conversation", err);
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
        return response;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      console.log("Error while registering call", err);
      return null;
    }
  };

  const RoomAudioAndData = () => {
    const room = useRoomContext();
    roomRef.current = room;
    useTracks([Track.Source.Microphone]);
    useParticipants();

    useEffect(() => {
      const enableMic = async () => {
        try {
          await room.localParticipant.setMicrophoneEnabled(true);
        } catch (err) {
          console.log("Error enabling microphone", err);
        }
      };
      if (isCalling) {
        enableMic();
      }
    }, [room]);

    useEffect(() => {
      const handleData = (data, participant) => {
        const transcriptObj = data[0];
        const text = transcriptObj.text;
        const identity = participant.identity;
        let role = "user";
        if (identity && identity.startsWith("agent")) {
          role = "agent";
        }

        // Get the current transcript
        const currentTranscript = transcriptRef.current;

        // If the last message is from the same role and identity, update it
        if (
          currentTranscript.length > 0 &&
          currentTranscript[currentTranscript.length - 1].role === role &&
          currentTranscript[currentTranscript.length - 1].identity === identity
        ) {
          const updatedTranscript = [...currentTranscript];
          updatedTranscript[updatedTranscript.length - 1].content = text;
          transcriptRef.current = updatedTranscript;
          setTranscript(updatedTranscript);
        } else {
          // Otherwise, append a new message
          const newTranscript = [
            ...currentTranscript,
            { role, content: text, identity },
          ];
          transcriptRef.current = newTranscript;
          setTranscript(newTranscript);
        }
      };
      room.on(RoomEvent.TranscriptionReceived, handleData);
      return () => {
        room.off(RoomEvent.TranscriptionReceived, handleData);
      };
    }, [room]);

    return null;
  };

  return (
    <>
      {isCalling && roomUrl && token && (
        <LiveKitRoom
          serverUrl={roomUrl}
          token={token}
          connect={true}
          audio={true}
          video={false}
          onConnected={() => {}}
          onDisconnected={() => {
            setIsCalling(false);
            roomRef.current = null;
          }}
          onError={() => {
            setIsCalling(false);
            setIsLoading(false);
            roomRef.current = null;
          }}
        >
          <RoomAudioAndData />
          <RemoteAudio />
        </LiveKitRoom>
      )}
      <Button
        onClick={toggleConversation}
        variant="outline"
        disabled={isLoading}
        className={cn(
          isCalling
            ? "text-red-800 hover:text-red-600"
            : "text-green-800 hover:text-green-600",
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
    </>
  );
};

export default LivekitCallComponent;
