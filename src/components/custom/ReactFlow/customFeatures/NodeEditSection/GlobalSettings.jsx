import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  AlignHorizontalDistributeCenter,
  ArrowUpRight,
  Ban,
  Binary,
  Book,
  Bot,
  Box,
  CalendarPlus,
  CalendarSearch,
  ChartLine,
  Check,
  Grid,
  Headphones,
  Info,
  List,
  Pause,
  Pencil,
  PhoneIncoming,
  PhoneOff,
  PhoneOutgoing,
  Play,
  Plus,
  Settings,
  Shapes,
  ShieldCheck,
  Speech,
  SquarePen,
  Text,
  Trash2,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  generalGetFunction,
  generalPatchFunction,
  generalPostFunction,
} from "@/globalFunctions/globalFunction";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const GlobalSettings = ({
  defaultName,
  setDefaultName,
  beginMessage,
  generalPrompt,
  newAgent,
  saveClicked,
  agentData,
  llmData,
  setBeginMessage,
  setGeneralPrompt,
  allWorkSpaces,
  setAgentId,
  setLoading,
}) => {
  // Initializing all the states for agent creation
  const [llm_id, setLlmId] = useState(null);
  const [voice_id, setVoiceId] = useState("11labs-Lily");
  const [voice_model, setVoiceModel] = useState("elevenlabs"); //The voice model to use for the agent. Default to eleven_turbo_v2.
  const [fallback_voice_ids, setFallbackVoiceIds] = useState(null);
  const [voice_temperature, setVoiceTemperature] = useState(1); //Controls how stable the voice is. Value ranging from [0,2]
  const [voice_speed, setVoiceSpeed] = useState(1); //Controls speed of voice. Value ranging from [0.5,2]
  const [volume, setVolume] = useState(1); //If set, will control the volume of the agent. Value ranging from [0,2]
  const [responsiveness, setResponsiveness] = useState(1); //Controls how responsive is the agent. Value ranging from [0,1]
  const [interruption_sensitivity, setInterruptionSensitivity] = useState(1); //Controls how sensitive the agent is to user interruptions. Value ranging from [0,1]
  const [enable_backchannel, setEnableBackchannel] = useState(false); //Controls whether the agent would backchannel (agent interjects the speaker with phrases like "yeah", "uh-huh" to signify interest and engagement)
  const [backchannel_frequency, setBackchannelFrequency] = useState(0); //Controls how often the agent would backchannel. Value ranging from [0,1]
  const [backchannel_words, setBackchannelWords] = useState(null);
  const [reminder_trigger_ms, setReminderTriggerMs] = useState(10000); //If set (in milliseconds), will trigger a reminder to the agent to speak if the user has been silent for the specified duration after some agent speech
  const [reminder_max_count, setReminderMaxCount] = useState(1); //If set, controls how many times agent would remind user when user is unresponsive
  const [ambient_sound, setAmbientSounds] = useState(null); //If set, will add ambient environment sound to the call to make experience more realistic Currently supports the following options: coffee-shop, convention-hall,summer-outdoor, mountain-outdoor, static-noise, call-center
  const [ambient_sound_volume, setAmbientSoundVolume] = useState(1); //If set, will control the volume of the ambient sound. Value ranging from [0,2]
  // const [language, setLanguage] = useState("en-US"); //Specifies what language (and dialect) the speech recognition will operate in
  const [language, setLanguage] = useState("en"); //Specifies what language (and dialect) the speech recognition will operate in
  const [webhook_url, setWebhookUrl] = useState(null); //The webhook for agent to listen to call events.
  const [boosted_keywords, setBoostedKeywords] = useState(null); //Provide a customized list of keywords to bias the transcriber model, so that these words are more likely to get transcribed. Commonly used for names, brands, street, etc.
  const [enable_transcription_formatting, setEnableTranscriptionFormatting] =
    useState(false); //If set to true, will format transcription to number, date, email, etc. If set to false, will return transcripts in raw words
  const [opt_out_sensitive_data_storage, setOptOutSensitiveDataStorage] =
    useState(false); //Whether this agent opts out of sensitive data storage like transcript, recording, logging, inbound/outbound phone numbers, etc.
  const [opt_in_signed_url, setOptInSignedUrl] = useState(false); //Whether this agent opts in for signed URLs for public logs and recordings. When enabled, the generated URLs will include security signatures that restrict access and automatically expire after 24 hours.
  const [pronunciation_dictionary, setPronunciationDictionary] = useState(null); //A list of words / phrases and their pronunciation to be used to guide the audio synthesize for consistent pronunciation. Currently only supported for English & 11labs voices. Set to null to remove pronunciation dictionary from this agent.
  const [normalize_for_speech, setNormalizeForSpeech] = useState(false); //If set to true, will normalize the some part of text (number, currency, date, etc) to spoken to its spoken form for more consistent speech synthesis (sometimes the voice synthesize system itself might read these wrong with the raw text)
  const [end_call_after_silence_ms, setEndCallAfterSilenceMs] =
    useState(600000); //If users stay silent for a period after agent speech, end the call. The minimum value allowed is 10,000 ms (10 s). By default, this is set to 600000 (10 min).
  const [max_call_duration_ms, setMaxCallDurationMs] = useState(7200000); //Maximum allowed length for the call, will force end the call if reached. The minimum value allowed is 60,000 ms (1 min), and maximum value allowed is 7,200,000 (2 hours). By default, this is set to 3,600,000 (1 hour).
  const [enable_voicemail_detection, setEnableVoicemailDetection] =
    useState(false); //If set to true, will detect voicemail and pause the call if detected
  const [voicemail_message, setVoicemailMessage] = useState(""); //The message to be played when the call enters a voicemail. Note that this feature is only available for phone calls. If you want to hangup after hitting voicemail, set this to empty string
  const [voicemail_detection_timeout_ms, setVoicemailDetectionTimeoutMs] =
    useState(30000); //Configures when to stop running voicemail detection, as it becomes unlikely to hit voicemail after a couple minutes, and keep running it will only have negative impact
  const [post_call_analysis_data, setPostCallAnalysisData] = useState([]); //Post call analysis data to extract from the call. This data will augment the pre-defined variables extracted in the call analysis. This will be available after the call ends.
  const [post_call_analysis_model, setPostCallAnalysisModel] =
    useState("gpt-4o-mini"); //The model to use for post call analysis. Currently only supports gpt-4o-mini and gpt-4o. Default to gpt-4o-mini.
  const [begin_message_delay_ms, setBeginMessageDelayMs] = useState(0); //If set, will delay the first message by the specified amount of milliseconds, so that it gives user more time to prepare to take the call
  const [ring_duration_ms, setRingDurationMs] = useState(30000); //If set, the phone ringing will last for the specified amount of milliseconds. This applies for both outbound call ringtime, and call transfer ringtime
  const [stt_mode, setSttModel] = useState("fast"); //If set, determines whether speech to text should focus on latency or accuracy. Default to fast mode.
  const [allow_user_dtmf, setAllowUserDtmf] = useState(true); //If set to true, DTMF input will be accepted and processed. If false, any DTMF input will be ignored. Default to true.
  const [digit_limit, setDigitLimit] = useState(10); //The maximum number of digits allowed in the user's DTMF (Dual-Tone Multi-Frequency) input per turn. Once this limit is reached, the input is considered complete and a response will be generated immediately.
  const [termination_keys, setTerminationKeys] = useState("#"); //A single key that signals the end of DTMF input. Acceptable values include any digit (0–9), the pound/hash symbol (#), or the asterisk (*).
  const [timeout_ms, setTimeoutMs] = useState(15000); //The time (in milliseconds) to wait for user DTMF input before timing out. The timer resets with each digit received.
  const [denoising_mode, setDenoisingMode] = useState("noise-cancellation"); //If set, determines what denoising mode to use. Default to noise-cancellation..
  const [postCallName, setPostCallName] = useState("");
  const [postCallDescription, setPostCallDescription] = useState("");
  const [postCallExample, setPostCallExample] = useState("");
  const [allKnowledgeBases, setAllKnowledgeBases] = useState([]);
  const [allVoices, setAllVoices] = useState([]);
  const [postCallDataEdit, setPostCallDataEdit] = useState(null);
  const [model_high_priority, setModelHighPriority] = useState(false);
  const [model_temperature, setModelTemperature] = useState(0);
  const [model, setModel] = useState("gpt-4o");
  const [llmModels, setLlmModels] = useState([]);
  const [llmKnowlwdgeBaseIds, setLlmKnowlwdgeBaseIds] = useState([]);

  // LLm model Functions payload added to the agent
  const [general_tools, setGeneralTools] = useState([]);
  const [type, setType] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState("");
  const [transfer_destination, setTransferDestination] = useState({});
  const [transferType, setTransferType] = useState("predefined");
  const [transferNumber, setTransferNumber] = useState();
  const [transferPrompt, setTransferPrompt] = useState("");
  const [transfer_options, setTransferOptions] = useState({});
  const [transferOptionType, setTransferOptionType] = useState();
  const [show_transferee_as_caller, setShowTransfereeAsCaller] =
    useState(false);
  const [public_handoff_option, setPublicHandoffOption] = useState({});
  const [publicHandoffType, setPublicHandoffOptionType] = useState("prompt");
  const [publicHandOffPrompt, setPublicHandOffPrompt] = useState("");
  const [publicHandOffMessage, setPublicHandOffMessage] = useState("");
  const [cal_api_key, setCalApiKey] = useState();
  const [event_type_id, setEventTypeId] = useState();
  const [timezone, setTimezone] = useState();
  const [delay_ms, setDelayMs] = useState();
  const [url, setUrl] = useState();
  const [speak_during_execution, setSpeakDuringExecution] = useState(true);
  const [speak_after_execution, setSpeakAfterExecution] = useState(true);
  const [parameters, setParameters] = useState();
  const [execution_message_description, setExecutionMessageDescription] =
    useState();
  const [customTimeoutMs, setCustomTimeoutMs] = useState(120000);
  const [parameterType, setParameterType] = useState();
  const [parameterProperties, setParameterProperties] = useState({});
  const [parameterRequired, setParameterRequired] = useState([]);
  const [propertiesKey, setPropertiesKey] = useState();
  // const allWorkSpaces = useSelector((state) => state.app.allWorkspaces);

  // useEffect
  useEffect(() => {
    if (allWorkSpaces?.id) {
      getData();
    }
  }, [allWorkSpaces]);
  async function getData() {
    // const apiData = await generalGetFunction("/knowledgebase/all");
    // const voicesData = await generalGetFunction("/voice/all");
    const voicesData = await generalGetFunction("/all-voices");
    // const llmModelsData = await generalGetFunction("/llm/all");
    const llmModelsData = await generalGetFunction(`/pbx-llms`);
    const apiData = await generalGetFunction(
      // `/workspaces/${allWorkSpaces.id}/knowledge-bases`
      `/workspaces/${allWorkSpaces.id}/list-knowledge-bases`
    );
    if (apiData.status) {
      // setAllKnowledgeBases(apiData.knowledgeBaseResponses);
      setAllKnowledgeBases(apiData.data);
    }
    if (voicesData.status) {
      console.log("voicesData: ", voicesData.data);
      setAllVoices(
        voicesData.data.filter((item) => item.provider === "elevenlabs")
      );
    }

    if (llmModelsData.status) {
      setLlmModels(llmModelsData.data);
    }
  }

  useEffect(() => {
    if (agentData && !newAgent) {
      setLlmId(agentData.response_engine.llm_id);
      setVoiceId(agentData.voice_id);
      setDefaultName(agentData.agent_name);
      setVoiceModel(agentData.voice_model);
      setFallbackVoiceIds(agentData.fallback_voice_ids);
      setVoiceTemperature(agentData.voice_temperature);
      setVoiceSpeed(agentData.voice_speed);
      setVolume(agentData.volume);
      setResponsiveness(agentData.responsiveness);
      setInterruptionSensitivity(agentData.interruption_sensitivity);
      setEnableBackchannel(agentData.enable_backchannel);
      setBackchannelFrequency(agentData.backchannel_frequency);
      setBackchannelWords(agentData.backchannel_words);
      setReminderTriggerMs(agentData.reminder_trigger_ms);
      setEnableVoicemailDetection(agentData.enable_voicemail_detection);
      setVoicemailMessage(agentData.voicemail_message);
      setVoicemailDetectionTimeoutMs(agentData.voicemail_detection_timeout_ms);
      setPostCallAnalysisData(agentData.post_call_analysis_data);
      setPostCallAnalysisModel(agentData.post_call_analysis_model);
      setBeginMessageDelayMs(agentData.begin_message_delay_ms);
      setRingDurationMs(agentData.ring_duration_ms);
      setSttModel(agentData.stt_mode);
      setAllowUserDtmf(agentData.allow_user_dtmf);
      setDigitLimit(agentData.user_dtmf_options?.digit_limit);
      setTerminationKeys(agentData.user_dtmf_options?.termination_keys);
      setTimeoutMs(agentData.user_dtmf_options?.timeout_ms);
      setDenoisingMode(agentData.denoising_mode);
      setLanguage(agentData.language);
      setWebhookUrl(agentData.webhook_url);
      setBoostedKeywords(agentData.boosted_keywords);
      setEnableTranscriptionFormatting(
        agentData.enable_transcription_formatting
      );
      setOptOutSensitiveDataStorage(agentData.opt_out_sensitive_data_storage);
      setOptInSignedUrl(agentData.opt_in_signed_url);
      setPronunciationDictionary(agentData.pronunciation_dictionary);
      setNormalizeForSpeech(agentData.normalize_for_speech);
      setEndCallAfterSilenceMs(agentData.end_call_after_silence_ms);
      setMaxCallDurationMs(agentData.max_call_duration_ms);
      setAmbientSounds(agentData.ambient_sound);
      setAmbientSoundVolume(agentData.ambient_sound_volume);
      // Setting llm data
      setModel(llmData.model);
      setModelTemperature(llmData.model_temperature);
      setModelHighPriority(llmData.model_high_priority);
      setGeneralPrompt(llmData.general_prompt);
      setBeginMessage(llmData.begin_message);
      setLlmKnowlwdgeBaseIds(llmData.knowledge_base_ids || []);
      setGeneralTools(llmData.general_tools || []);
    }
  }, [agentData, newAgent]);

  async function handleSave() {
    setLoading(true);
    console.log("newAgent:", newAgent);
    if (newAgent === true) {
      const llmParsedData = {
        workspace_id: allWorkSpaces.id,
        model: model,
        model_temperature: model_temperature,
        model_high_priority: model_high_priority,
        general_prompt: generalPrompt,
        begin_message: beginMessage,
        knowledge_base_ids: llmKnowlwdgeBaseIds,
        general_tools: general_tools.length > 0 ? general_tools : null,
      };
      console.log("llmParsedData", llmParsedData);
      // const llmData = await generalPostFunction("/llm/store", llmParsedData);
      const llmData = await generalPostFunction("/pbx-llms", llmParsedData);
      if (llmData.status) {
        const agentParsedData = {
          workspace_id: allWorkSpaces.id,
          // response_engine: { type: "retell-llm", llm_id: llmData.llm_id },
          response_engine: { type: "pbx-llm", llm_id: llmData.llm_id },
          voice_id: voice_id,
          agent_name: defaultName,
          voice_model: voice_model,
          fallback_voice_ids: fallback_voice_ids,
          voice_temperature: voice_temperature,
          voice_speed: voice_speed,
          volume: volume,
          responsiveness: responsiveness,
          interruption_sensitivity: interruption_sensitivity,
          enable_backchannel: enable_backchannel,
          backchannel_frequency: backchannel_frequency,
          backchannel_words: backchannel_words,
          reminder_trigger_ms: reminder_trigger_ms,
          reminder_max_count: reminder_max_count,
          ambient_sound: ambient_sound,
          ambient_sound_volume: ambient_sound_volume,
          language: language,
          webhook_url: webhook_url,
          boosted_keywords: boosted_keywords,
          enable_transcription_formatting: enable_transcription_formatting,
          opt_out_sensitive_data_storage: opt_out_sensitive_data_storage,
          opt_in_signed_url: opt_in_signed_url,
          pronunciation_dictionary: pronunciation_dictionary,
          normalize_for_speech: normalize_for_speech,
          end_call_after_silence_ms: end_call_after_silence_ms,
          max_call_duration_ms: max_call_duration_ms,
          enable_voicemail_detection: enable_voicemail_detection,
          voicemail_message: voicemail_message,
          voicemail_detection_timeout_ms: voicemail_detection_timeout_ms,
          post_call_analysis_data: post_call_analysis_data,
          post_call_analysis_model: post_call_analysis_model,
          begin_message_delay_ms: begin_message_delay_ms,
          ring_duration_ms: ring_duration_ms,
          stt_mode: stt_mode,
          allow_user_dtmf: allow_user_dtmf,
          user_dtmf_options: {
            digit_limit: digit_limit,
            termination_keys: termination_keys,
            timeout_ms: timeout_ms,
          },
          denoising_mode: denoising_mode,
        };
        // const apiData = await generalPostFunction(
        //   "/agent/store",
        //   agentParsedData
        // );
        const apiData = await generalPostFunction("/agents", agentParsedData);
        if (apiData.status) {
          console.log(apiData);
          setLoading(false);
          setAgentId(apiData.data.agent_id);
          toast.success("Agent created successfully!");
        } else {
          toast.error(apiData.error);
          setLoading(false);
        }
      } else {
        toast.error(llmData.error);
        setLoading(false);
      }
    } else {
      const llmParsedData = {
        workspace_id: allWorkSpaces.id,
        model: model,
        model_temperature: model_temperature,
        model_high_priority: model_high_priority,
        general_prompt: generalPrompt,
        begin_message: beginMessage,
        knowledge_base_ids: llmKnowlwdgeBaseIds,
        general_tools: general_tools.length > 0 ? general_tools : null,
      };
      const llmData = await generalPatchFunction(
        // `/llm/update-llm/${llm_id}`,
        `/pbx-llms/update-llm/${llm_id}`,
        llmParsedData
      );
      if (llmData.status) {
        // console.log(llmData);
        const agentParsedData = {
          workspace_id: allWorkSpaces.id,
          // response_engine: { type: "retell-llm", llm_id: llm_id },
          response_engine: { type: "pbx-llm", llm_id: llm_id },
          voice_id: voice_id,
          agent_name: defaultName,
          voice_model: voice_model,
          fallback_voice_ids: fallback_voice_ids,
          voice_temperature: voice_temperature,
          voice_speed: voice_speed,
          volume: volume,
          responsiveness: responsiveness,
          interruption_sensitivity: interruption_sensitivity,
          enable_backchannel: enable_backchannel,
          backchannel_frequency: backchannel_frequency,
          backchannel_words: backchannel_words,
          reminder_trigger_ms: reminder_trigger_ms,
          reminder_max_count: reminder_max_count,
          ambient_sound: ambient_sound,
          ambient_sound_volume: ambient_sound_volume,
          language: language,
          webhook_url: webhook_url,
          boosted_keywords: boosted_keywords,
          enable_transcription_formatting: enable_transcription_formatting,
          opt_out_sensitive_data_storage: opt_out_sensitive_data_storage,
          opt_in_signed_url: opt_in_signed_url,
          pronunciation_dictionary: pronunciation_dictionary,
          normalize_for_speech: normalize_for_speech,
          end_call_after_silence_ms: end_call_after_silence_ms,
          max_call_duration_ms: max_call_duration_ms,
          enable_voicemail_detection: enable_voicemail_detection,
          voicemail_message: voicemail_message,
          voicemail_detection_timeout_ms: voicemail_detection_timeout_ms,
          post_call_analysis_data: post_call_analysis_data,
          post_call_analysis_model: post_call_analysis_model,
          begin_message_delay_ms: begin_message_delay_ms,
          ring_duration_ms: ring_duration_ms,
          stt_mode: stt_mode,
          allow_user_dtmf: allow_user_dtmf,
          user_dtmf_options: {
            digit_limit: digit_limit,
            termination_keys: termination_keys,
            timeout_ms: timeout_ms,
          },
          denoising_mode: denoising_mode,
        };
        const apiData = await generalPatchFunction(
          // `/agent/update-agent/${agentData.agent_id}`,
          `/agent/update-agent/${agentData.agent_id}`,
          agentParsedData
        );
        if (apiData.status) {
          setLoading(false);
          toast.success("Agent updated successfully!");
        } else {
          toast.error(apiData.error);
          setLoading(false);
        }
      } else {
        toast.error(llmData.error);
        setLoading(false);
      }
    }
  }

  console.log("saveClicked: ", saveClicked);
  useEffect(() => {
    if (saveClicked > 0) {
      console.log("inside saveClicked: ", saveClicked);
      handleSave();
    }
  }, [saveClicked]);
  const [formData, setFormData] = useState({
    // name: dialogType === "end_call" ? "end_call" : "",
    name: "",
    description: "",
  });
  const [callTransfer, setCallTransfer] = useState("cold_transfer");
  const [displayNumber, setDisplayNumber] = useState("retell-agents");
  // const [speakDuringExecution, setSpeakDuringExecution] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [openTrigger, setOpenTrigger] = useState(null);
  const [editableKey, setEditableKey] = useState(null);
  const [jsonError, setJsonError] = useState(null); // just for error feedback
  console.log("General Tools: ", general_tools);

  return (
    <>
      <div className="w-full">
        {/* {loading && <Loading />} */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="functions">
            <AccordionTrigger>
              <div className="flex items-center gap-3 font-bold text-sm cursor-pointer">
                <Shapes className="w-5 h-5" />
                Functions
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {/* <Dialog> */}
              <div className="w-full">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Enable your agent with capabilities such as calendar
                    bookings, call termination, etc.
                  </p>
                  {general_tools.length > 0 &&
                    general_tools.map((item, key) => {
                      return (
                        <div className="flex items-center gap-2 w-full flex-col my-2">
                          <div className="flex items-center justify-between bg-zinc-800 px-2 py-1 rounded-md w-full">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <PhoneOutgoing className="w-4 h-4" />
                              <p>{item.type}</p>
                            </div>
                            <div>
                              <Button
                                variant={"ghost"}
                                size="icon"
                                className={
                                  "cursor-pointer text-green-800 hover:text-green-600"
                                }
                                onClick={() => {
                                  setOpenTrigger(item.type);
                                  setEditableKey(key);
                                  if (item.type === "end_call") {
                                    setType("end_call");
                                    setName(item.name);
                                    setDescription(item.description);
                                  } else if (item.type === "transfer_call") {
                                    setType("transfer_call");
                                    setName(item.name);
                                    setDescription(item.description);
                                    if (
                                      item.transfer_destination.type ===
                                      "inferred"
                                    ) {
                                      setTransferType("inferred");
                                      setTransferPrompt(
                                        item.transfer_destination.prompt
                                      );
                                    } else {
                                      setTransferType("predefined");
                                      setTransferNumber(
                                        item.transfer_destination.number
                                      );
                                    }
                                    if (
                                      item.transfer_option.type ===
                                      "cold_transfer"
                                    ) {
                                      setTransferOptionType("cold_transfer");
                                      setShowTransfereeAsCaller(
                                        item.transfer_option
                                          .show_transferee_as_caller
                                      );
                                    } else {
                                      setTransferOptionType("warm_transfer");
                                      if (
                                        item.transfer_option
                                          .public_handoff_option.type ===
                                        "prompt"
                                      ) {
                                        setPublicHandoffOptionType("prompt");
                                        setPublicHandOffPrompt(
                                          item.transfer_option
                                            .public_handoff_option.prompt
                                        );
                                      } else {
                                        setPublicHandoffOptionType(
                                          "static_message"
                                        );
                                        setPublicHandOffMessage(
                                          item.transfer_option
                                            .public_handoff_option.message
                                        );
                                      }
                                    }
                                  } else if (
                                    item.type === "check_availability_cal"
                                  ) {
                                    setType("check_availability_cal");
                                    setName(item.name);
                                    setDescription(item.description);
                                    setCalApiKey(item.cal_api_key);
                                    setEventTypeId(Number(item.event_type_id));
                                    setTimezone(item.timezone);
                                  } else if (
                                    item.type === "book_appointment_cal"
                                  ) {
                                    setType("book_appointment_cal");
                                    setName(item.name);
                                    setDescription(item.description);
                                    setCalApiKey(item.cal_api_key);
                                    setEventTypeId(Number(item.event_type_id));
                                    setTimezone(item.timezone);
                                  } else if (item.type === "press_digit") {
                                    setType("press_digit");
                                    setName(item.name);
                                    setDescription(item.description);
                                    setDelayMs(item.delay_ms);
                                  } else if (item.type === "custom") {
                                    setType("custom");
                                    setName(item.name);
                                    setDescription(item.description);
                                    setUrl(item.url);
                                    setSpeakDuringExecution(
                                      item.speak_during_execution
                                    );
                                    setSpeakAfterExecution(
                                      item.speak_after_execution
                                    );
                                    setParameters(
                                      JSON.stringify(item.parameters) || {}
                                    );
                                    setExecutionMessageDescription(
                                      item.execution_message_description
                                    );
                                    setCustomTimeoutMs(item.custom_timeout_ms);
                                  }
                                }}
                              >
                                <SquarePen />
                              </Button>
                              <Button
                                variant={"ghost"}
                                size="icon"
                                className={
                                  "cursor-pointer text-red-800 hover:text-red-600"
                                }
                                onClick={() => {
                                  setGeneralTools((prev) =>
                                    prev.filter((tool, index) => key !== index)
                                  );
                                }}
                              >
                                <Trash2 />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  <DropdownMenu
                    {...(openTrigger != null ? { open: openTrigger } : {})}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={"cursor-pointer"}
                        onClick={() => {
                          setOpenTrigger("test");
                          setEditableKey(null);
                        }}
                      >
                        <Plus /> Add
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className={"max-w-70"} align="start">
                      <DropdownMenuLabel>Select a type</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Dialog
                            {...(openTrigger != null
                              ? { open: openTrigger === "end_call" }
                              : {})}
                          >
                            <DialogTrigger
                              onClick={() => {
                                setType("end_call");
                                setName(null);
                                setDescription("");
                                setEditableKey(null);
                              }}
                              asChild
                            >
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="flex items-center gap-2"
                              >
                                <PhoneIncoming /> End Call
                              </span>
                            </DialogTrigger>
                            <DialogContent
                              className="sm:max-w-[500px]"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <DialogHeader>
                                <DialogTitle
                                  className={"flex items-center gap-2"}
                                >
                                  <PhoneOff /> End call
                                </DialogTitle>
                              </DialogHeader>
                              {/* <FunctionItem dialogType={"end_call"} /> */}
                              <ScrollArea className="max-h-[80vh]">
                                <div className="grid gap-4">
                                  <div className="grid gap-3">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                      id="name"
                                      name="name"
                                      value={name}
                                      onChange={(e) => setName(e.target.value)}
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label htmlFor="description">
                                      Description{" "}
                                      <span className="text-muted-foreground text-xs">
                                        (Optional)
                                      </span>
                                    </Label>
                                    <Textarea
                                      className={"min-h-[150px]"}
                                      id="description"
                                      name="description"
                                      placeholder="Enter a description"
                                      value={description}
                                      onChange={(e) =>
                                        setDescription(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </ScrollArea>
                              <DialogFooter>
                                <DialogClose
                                  onClick={() => setOpenTrigger(null)}
                                  asChild
                                >
                                  <Button
                                    variant="outline"
                                    className={"cursor-pointer"}
                                  >
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <DialogClose
                                  onClick={() => setOpenTrigger(null)}
                                  asChild
                                >
                                  <Button
                                    type="submit"
                                    className={"cursor-pointer"}
                                    onClick={() => {
                                      setOpenTrigger(null);
                                      console.log(editableKey);
                                      if (name) {
                                        setGeneralTools((prev) => {
                                          if (
                                            editableKey !== null &&
                                            editableKey !== undefined
                                          ) {
                                            // Update existing item
                                            return prev.map((tool, index) =>
                                              index === editableKey
                                                ? { ...tool, name, description }
                                                : tool
                                            );
                                          } else {
                                            // Add new item
                                            return [
                                              ...prev,
                                              {
                                                type: "end_call",
                                                name,
                                                description,
                                              },
                                            ];
                                          }
                                        });
                                      }
                                    }}
                                  >
                                    Save changes
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Dialog
                            {...(openTrigger != null
                              ? { open: openTrigger === "transfer_call" }
                              : {})}
                          >
                            <DialogTrigger
                              asChild
                              onClick={() => {
                                setType("transfer_call");
                                setName(null);
                                setDescription("");
                                setTransferType("predefined");
                                setTransferNumber("");
                                setTransferPrompt("");
                                setCallTransfer("cold_transfer");
                                setShowTransfereeAsCaller(false);
                                setPublicHandoffOptionType(null);
                                setPublicHandOffPrompt("");
                                setPublicHandOffMessage("");
                                setEditableKey(null);
                              }}
                            >
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="flex items-center gap-2"
                              >
                                <PhoneIncoming /> Call Transfer
                              </span>
                            </DialogTrigger>
                            <DialogContent
                              className="sm:max-w-[750px]"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              setOpenTrigger={setOpenTrigger}
                            >
                              <DialogHeader>
                                <DialogTitle
                                  className={"flex items-center gap-2"}
                                >
                                  <PhoneIncoming /> Call Transfer
                                </DialogTitle>
                              </DialogHeader>
                              {/* <FunctionItem dialogType={"call-transfer"} /> */}
                              <ScrollArea className="max-h-[80vh]">
                                <div className="grid gap-4">
                                  <div className="grid gap-3">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                      id="name"
                                      name="name"
                                      value={name}
                                      onChange={(e) => setName(e.target.value)}
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label htmlFor="description">
                                      Description{" "}
                                      <span className="text-muted-foreground text-xs">
                                        (Optional)
                                      </span>
                                    </Label>
                                    <Textarea
                                      className={"min-h-[100px]"}
                                      id="description"
                                      name="description"
                                      placeholder="Enter a description"
                                      value={description}
                                      onChange={(e) =>
                                        setDescription(e.target.value)
                                      }
                                    />
                                  </div>

                                  <div className="grid gap-3">
                                    <Label>Transfer to</Label>
                                    <Tabs
                                      defaultValue={transferType}
                                      onValueChange={setTransferType}
                                    >
                                      <TabsList>
                                        <TabsTrigger value="predefined">
                                          Static Number
                                        </TabsTrigger>
                                        <TabsTrigger value="inferred">
                                          Dynamic Routing
                                        </TabsTrigger>
                                      </TabsList>
                                      <TabsContent value="predefined">
                                        <Input
                                          placeholder="+1xxxxxxxxxx"
                                          className={"w-full"}
                                          value={transferNumber}
                                          onChange={(e) =>
                                            setTransferNumber(e.target.value)
                                          }
                                        />
                                        <p className="text-xs text-muted-foreground">
                                          Enter a static phone number or dynamic
                                          variable.
                                        </p>
                                      </TabsContent>
                                      <TabsContent value="inferred">
                                        <Textarea
                                          placeholder="Enter prompt to infer the destinaton number."
                                          className={"w-full min-h-[100px]"}
                                          value={transferPrompt}
                                          onChange={(e) =>
                                            setTransferPrompt(e.target.value)
                                          }
                                        />
                                        <p className="text-xs text-muted-foreground">
                                          Use a prompt to handle dynamic call
                                          transfer routing.
                                        </p>
                                      </TabsContent>
                                    </Tabs>
                                  </div>
                                  <div className="grid gap-3">
                                    <Label>Type</Label>
                                    <RadioGroup
                                      value={callTransfer}
                                      onValueChange={setCallTransfer}
                                      className={"flex flex-col w-full"}
                                    >
                                      <div className="flex items-center justify-between text-xl space-x-2 border rounded-md p-4 ">
                                        <Label
                                          htmlFor="cold_transfer"
                                          className={"flex items-center"}
                                        >
                                          Cold Transfer
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Info className="w-4 h-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>
                                                AI transfers the call to the
                                                next agent without a debrief.
                                              </p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </Label>
                                        <RadioGroupItem
                                          value="cold_transfer"
                                          id="cold_transfer"
                                          className={"cursor-pointer"}
                                        />
                                      </div>
                                      <div className="flex items-center justify-between text-xl space-x-2 border rounded-md p-4 ">
                                        <Label
                                          htmlFor="warm_transfer"
                                          className={"flex items-center"}
                                        >
                                          Warm Transfer
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Info className="w-4 h-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>
                                                AI provides a debrief to the
                                                next agent after transferring
                                                the call.
                                              </p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </Label>
                                        <RadioGroupItem
                                          value="warm_transfer"
                                          id="warm_transfer"
                                          className={"cursor-pointer"}
                                        />
                                      </div>
                                    </RadioGroup>
                                  </div>

                                  {callTransfer === "cold_transfer" && (
                                    <div className="grid gap-3">
                                      <Label>Displayed Phone Number</Label>
                                      {/* <RadioGroup
                                      value={show_transferee_as_caller}
                                      onValueChange={setShowTransfereeAsCaller}
                                      className={"flex flex-col w-full"}
                                    >
                                      <div className="flex items-center justify-between text-xl space-x-2 border rounded-md p-4 ">
                                        <Label
                                          htmlFor="transfeer-number"
                                          className={"flex items-center"}
                                        >
                                          Transferee's Number
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Info className="w-4 h-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>
                                                Original Caller or Callee. If
                                                you are using custom telephony,
                                                enable SIP REFER and PSTN
                                                transfer, and set SIP REFER to
                                                show transferee's number.
                                              </p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </Label>
                                        <RadioGroupItem
                                          value="transfeer-number"
                                          id="transfeer-number"
                                          className={"cursor-pointer"}
                                        />
                                      </div>
                                    </RadioGroup> */}
                                      <div className="mt-4">
                                        <p>Show transferee's number</p>
                                        <Switch
                                          checked={show_transferee_as_caller}
                                          onCheckedChange={
                                            setShowTransfereeAsCaller
                                          }
                                          className={"mt-2 cursor-pointer"}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {callTransfer === "warm_transfer" && (
                                    <div className="grid gap-3">
                                      <Label>Handoff message</Label>
                                      <Tabs
                                        value={publicHandoffType}
                                        onValueChange={
                                          setPublicHandoffOptionType
                                        }
                                      >
                                        <TabsList>
                                          <TabsTrigger value="prompt">
                                            Prompt
                                          </TabsTrigger>
                                          <TabsTrigger value="static_message">
                                            Static Sentence
                                          </TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="prompt">
                                          <Textarea
                                            placeholder="Say hello to the agent and summarize the user problem to him"
                                            className={"min-h-[100px]"}
                                            value={publicHandOffPrompt}
                                            onChange={(e) =>
                                              setPublicHandOffPrompt(
                                                e.target.value
                                              )
                                            }
                                          />
                                        </TabsContent>
                                        <TabsContent value="static_message">
                                          <Textarea
                                            placeholder="Enter static message"
                                            className={"w-full min-h-[100px]"}
                                            value={publicHandOffMessage}
                                            onChange={(e) =>
                                              setPublicHandOffMessage(
                                                e.target.value
                                              )
                                            }
                                          />
                                        </TabsContent>
                                      </Tabs>
                                    </div>
                                  )}
                                </div>
                              </ScrollArea>
                              <DialogFooter>
                                <DialogClose
                                  onClick={() => {
                                    setOpenTrigger(null);
                                  }}
                                  asChild
                                >
                                  <Button
                                    variant="outline"
                                    className={"cursor-pointer"}
                                  >
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button
                                    type="submit"
                                    className={"cursor-pointer"}
                                    onClick={() => {
                                      setOpenTrigger(null);
                                      if (name) {
                                        setGeneralTools((prev) => {
                                          const newTool = {
                                            type: "transfer_call",
                                            name: name,
                                            description: description,
                                            transfer_destination:
                                              transferType === "predefined"
                                                ? {
                                                    type: "predefined",
                                                    number: transferNumber,
                                                  }
                                                : {
                                                    type: "inferred",
                                                    prompt: transferPrompt,
                                                  },
                                            transfer_option:
                                              transferOptionType ===
                                              "cold_transfer"
                                                ? {
                                                    type: "cold_transfer",
                                                    show_transferee_as_caller:
                                                      show_transferee_as_caller,
                                                  }
                                                : {
                                                    type: "warm_transfer",
                                                    public_handoff_option:
                                                      publicHandoffType ===
                                                      "prompt"
                                                        ? {
                                                            type: "prompt",
                                                            prompt:
                                                              publicHandOffPrompt,
                                                          }
                                                        : {
                                                            type: "static_message",
                                                            message:
                                                              publicHandOffMessage,
                                                          },
                                                  },
                                          };

                                          if (
                                            editableKey !== null &&
                                            editableKey !== undefined
                                          ) {
                                            // Update existing item
                                            return prev.map((tool, index) =>
                                              index === editableKey
                                                ? { ...tool, ...newTool }
                                                : tool
                                            );
                                          } else {
                                            // Add new item
                                            return [...prev, newTool];
                                          }
                                        });
                                      }
                                    }}
                                  >
                                    Save changes
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Dialog
                            {...(openTrigger != null
                              ? {
                                  open:
                                    openTrigger === "check_availability_cal",
                                }
                              : {})}
                          >
                            <DialogTrigger
                              asChild
                              onClick={() => {
                                setType("check_availability_cal");
                                setName("");
                                setDescription("");
                                setCalApiKey("");
                                setEventTypeId();
                                setTimezone("");
                                setEditableKey(null);
                              }}
                            >
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="flex items-center gap-2"
                              >
                                <CalendarSearch />
                                Check Calendar Availability (Cal.com)
                              </span>
                            </DialogTrigger>
                            <DialogContent
                              className="sm:max-w-[500px]"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <DialogHeader>
                                <DialogTitle
                                  className={"flex items-center gap-2"}
                                >
                                  <CalendarSearch />
                                  Check Calendar Availability (Cal.com)
                                </DialogTitle>
                              </DialogHeader>
                              {/* <FunctionItem dialogType={"check-calender"} /> */}
                              <ScrollArea className="max-h-[80vh]">
                                <div className="grid gap-4">
                                  <div className="grid gap-3">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                      id="name"
                                      name="name"
                                      value={name}
                                      onChange={(e) => setName(e.target.value)}
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label htmlFor="description">
                                      Description{" "}
                                      <span className="text-muted-foreground text-xs">
                                        (Optional)
                                      </span>
                                    </Label>
                                    <Textarea
                                      className={"min-h-[100px]"}
                                      id="description"
                                      name="description"
                                      placeholder="Enter a description"
                                      value={description}
                                      onChange={(e) =>
                                        setDescription(e.target.value)
                                      }
                                      // onChange={handleInputChange}
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label htmlFor="api-key">
                                      API Key (Cal.com)
                                    </Label>
                                    <Input
                                      id="api-key"
                                      name="api-key"
                                      value={cal_api_key}
                                      onChange={(e) =>
                                        setCalApiKey(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label htmlFor="event-type-id">
                                      Event Type ID (Cal.com)
                                    </Label>
                                    <Input
                                      id="event-type-id"
                                      type={"number"}
                                      name="event-type-id"
                                      value={event_type_id}
                                      onChange={(e) =>
                                        setEventTypeId(Number(e.target.value))
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label htmlFor="timezone">
                                      Timezone{" "}
                                      <span className="text-muted-foreground text-xs">
                                        (Optional)
                                      </span>
                                    </Label>
                                    <Input
                                      id="timezone"
                                      name="timezone"
                                      value={timezone}
                                      onChange={(e) =>
                                        setTimezone(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </ScrollArea>
                              <DialogFooter>
                                <DialogClose
                                  onClick={() => setOpenTrigger(null)}
                                  asChild
                                >
                                  <Button
                                    variant="outline"
                                    className={"cursor-pointer"}
                                  >
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <DialogClose
                                  onClick={() => setOpenTrigger(null)}
                                  asChild
                                >
                                  <Button
                                    type="submit"
                                    className={"cursor-pointer"}
                                    onClick={() => {
                                      if (name) {
                                        setGeneralTools((prev) => {
                                          const newTool = {
                                            type: "check_availability_cal",
                                            name,
                                            description,
                                            cal_api_key,
                                            event_type_id,
                                            timezone,
                                          };

                                          if (
                                            editableKey !== null &&
                                            editableKey !== undefined
                                          ) {
                                            // Update existing item
                                            return prev.map((tool, index) =>
                                              index === editableKey
                                                ? { ...tool, ...newTool }
                                                : tool
                                            );
                                          } else {
                                            // Add new item
                                            return [...prev, newTool];
                                          }
                                        });
                                      }
                                    }}
                                  >
                                    Save changes
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Dialog
                            {...(openTrigger != null
                              ? { open: openTrigger === "book_appointment_cal" }
                              : {})}
                          >
                            <DialogTrigger
                              asChild
                              onClick={() => {
                                setType("book_appointment_cal ");
                                setName("");
                                setDescription("");
                                setCalApiKey("");
                                setEventTypeId();
                                setTimezone("");
                                setEditableKey(null);
                              }}
                            >
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="flex items-center gap-2"
                              >
                                <CalendarPlus />
                                Book on the Calendar (Cal.com)
                              </span>
                            </DialogTrigger>
                            <DialogContent
                              className="sm:max-w-[500px]"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <DialogHeader>
                                <DialogTitle
                                  className={"flex items-center gap-2"}
                                >
                                  <CalendarPlus />
                                  Book on the Calendar (Cal.com)
                                </DialogTitle>
                              </DialogHeader>
                              {/* <FunctionItem dialogType={"book-calender"} /> */}
                              <ScrollArea className="max-h-[80vh]">
                                <div className="grid gap-4">
                                  <div className="grid gap-3">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                      id="name"
                                      name="name"
                                      value={name}
                                      onChange={(e) => setName(e.target.value)}
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label htmlFor="description">
                                      Description{" "}
                                      <span className="text-muted-foreground text-xs">
                                        (Optional)
                                      </span>
                                    </Label>
                                    <Textarea
                                      className={"min-h-[100px]"}
                                      id="description"
                                      name="description"
                                      placeholder="Enter a description"
                                      value={description}
                                      onChange={(e) =>
                                        setDescription(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label htmlFor="api-key">
                                      API Key (Cal.com)
                                    </Label>
                                    <Input
                                      id="api-key"
                                      name="api-key"
                                      value={cal_api_key}
                                      onChange={(e) =>
                                        setCalApiKey(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label htmlFor="event-type-id">
                                      Event Type ID (Cal.com)
                                    </Label>
                                    <Input
                                      id="event-type-id"
                                      name="event-type-id"
                                      type={"number"}
                                      value={event_type_id}
                                      onChange={(e) =>
                                        setEventTypeId(Number(e.target.value))
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label htmlFor="timezone">
                                      Timezone{" "}
                                      <span className="text-muted-foreground text-xs">
                                        (Optional)
                                      </span>
                                    </Label>
                                    <Input
                                      id="timezone"
                                      name="timezone"
                                      value={timezone}
                                      onChange={(e) =>
                                        setTimezone(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </ScrollArea>
                              <DialogFooter>
                                <DialogClose
                                  onClick={() => setOpenTrigger(null)}
                                  asChild
                                >
                                  <Button
                                    variant="outline"
                                    className={"cursor-pointer"}
                                  >
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <DialogClose
                                  onClick={() => setOpenTrigger(null)}
                                  asChild
                                >
                                  <Button
                                    type="submit"
                                    className={"cursor-pointer"}
                                    onClick={() => {
                                      if (name) {
                                        setGeneralTools((prev) => {
                                          const newTool = {
                                            type: "book_appointment_cal",
                                            name,
                                            description,
                                            cal_api_key,
                                            event_type_id,
                                            timezone,
                                          };

                                          if (
                                            editableKey !== null &&
                                            editableKey !== undefined
                                          ) {
                                            // Update existing item
                                            return prev.map((tool, index) =>
                                              index === editableKey
                                                ? { ...tool, ...newTool }
                                                : tool
                                            );
                                          } else {
                                            // Add new item
                                            return [...prev, newTool];
                                          }
                                        });
                                      }
                                    }}
                                  >
                                    Save changes
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Dialog
                            {...(openTrigger != null
                              ? { open: openTrigger === "press_digit" }
                              : {})}
                          >
                            <DialogTrigger
                              asChild
                              onClick={() => {
                                setType("press_digit");
                                setName("");
                                setDescription("");
                                setDelayMs(1000);
                                setEditableKey(null);
                              }}
                            >
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="flex items-center gap-2"
                              >
                                <Grid />
                                Press Digits (IVR Navigation)
                              </span>
                            </DialogTrigger>
                            <DialogContent
                              className="sm:max-w-[500px]"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <DialogHeader>
                                <DialogTitle
                                  className={"flex items-center gap-2"}
                                >
                                  <Grid />
                                  Press Digits (IVR Navigation)
                                </DialogTitle>
                              </DialogHeader>
                              {/* <FunctionItem dialogType={"press-digits"} /> */}
                              <ScrollArea className="max-h-[80vh]">
                                <div className="grid gap-4">
                                  <div className="grid gap-3">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                      id="name"
                                      name="name"
                                      value={name}
                                      onChange={(e) => setName(e.target.value)}
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label htmlFor="description">
                                      Description{" "}
                                      <span className="text-muted-foreground text-xs">
                                        (Optional)
                                      </span>
                                    </Label>
                                    <Textarea
                                      className={"min-h-[100px]"}
                                      id="description"
                                      name="description"
                                      placeholder="Enter a description"
                                      value={description}
                                      onChange={(e) =>
                                        setDescription(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label htmlFor="paush-detection">
                                      Description{" "}
                                      <span className="text-muted-foreground text-xs">
                                        (Optional)
                                      </span>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="w-4 h-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>
                                            Adds extra wait time after pauses to
                                            prevent pressing too early. Ensures
                                            digits are pressed only after the
                                            IVR fully finishes. Default: 1000ms
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </Label>
                                    <div className=" flex items-center gap-3">
                                      <Input
                                        id="paush-detection"
                                        name="paush-detection"
                                        type={"number"}
                                        value={delay_ms}
                                        onChange={(e) =>
                                          setDelayMs(e.target.value)
                                        }
                                        className={"w-3/4"}
                                      />
                                      <span>miliseconds</span>
                                    </div>
                                  </div>
                                </div>
                              </ScrollArea>
                              <DialogFooter>
                                <DialogClose
                                  onClick={() => setOpenTrigger(null)}
                                  asChild
                                >
                                  <Button
                                    variant="outline"
                                    className={"cursor-pointer"}
                                  >
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <DialogClose
                                  onClick={() => setOpenTrigger(null)}
                                  asChild
                                >
                                  <Button
                                    type="submit"
                                    className={"cursor-pointer"}
                                    onClick={(e) => {
                                      if (name) {
                                        setGeneralTools((prev) => {
                                          const newTool = {
                                            type: "press_digit",
                                            name,
                                            description,
                                            delay_ms,
                                          };

                                          if (
                                            editableKey !== null &&
                                            editableKey !== undefined
                                          ) {
                                            // Update existing item
                                            return prev.map((tool, index) =>
                                              index === editableKey
                                                ? { ...tool, ...newTool }
                                                : tool
                                            );
                                          } else {
                                            // Add new item
                                            return [...prev, newTool];
                                          }
                                        });
                                      }
                                    }}
                                  >
                                    Save changes
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>
                          <Dialog>
                            <DialogTrigger asChild>
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="flex items-center gap-2"
                              >
                                <MessageCircleMore />
                                Send SMS
                              </span>
                            </DialogTrigger>
                            <DialogContent
                              className="sm:max-w-[500px]"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <DialogHeader>
                                <DialogTitle
                                  className={"flex items-center gap-2"}
                                >
                                  <MessageCircleMore />
                                  Send SMS
                                </DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4">
                                <div className="grid gap-3">
                                  <Label htmlFor="name">Name</Label>
                                  <Input
                                    id="name"
                                    name="name"
                                    defaultValue={"send_sms"}
                                  />
                                </div>
                                <div className="grid gap-3">
                                  <Label htmlFor="description">
                                    Description{" "}
                                    <span className="text-muted-foreground text-xs">
                                      (Optional)
                                    </span>
                                  </Label>
                                  <Textarea
                                    className={"min-h-[100px]"}
                                    id="description"
                                    name="description"
                                    placeholder="Enter a description"
                                  />
                                </div>
                                <div className="grid gap-3">
                                  <Label>SMS content</Label>
                                  <Tabs defaultValue="prompt">
                                    <TabsList>
                                      <TabsTrigger value="prompt">
                                        Prompt
                                      </TabsTrigger>
                                      <TabsTrigger value="static-sentence">
                                        Static Sentence
                                      </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="prompt">
                                      <Textarea
                                        placeholder="Say hello to the agent and summarize the user problem to him"
                                        className={"min-h-[100px]"}
                                      />
                                    </TabsContent>
                                    <TabsContent value="static-sentence">
                                      <Textarea
                                        placeholder="Enter static message"
                                        className={"w-full min-h-[100px]"}
                                      />
                                    </TabsContent>
                                  </Tabs>
                                </div>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button
                                    variant="outline"
                                    className={"cursor-pointer"}
                                  >
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <Button
                                  type="submit"
                                  className={"cursor-pointer"}
                                  disabled
                                >
                                  Save changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuItem> */}
                        <Separator />
                        <DropdownMenuItem>
                          <Dialog
                            {...(openTrigger != null
                              ? { open: openTrigger === "custom" }
                              : {})}
                          >
                            <DialogTrigger
                              asChild
                              onClick={() => {
                                setType("custom");
                                setName("");
                                setDescription("");
                                setUrl("");
                                setTimeoutMs(1000);
                                setParameters();
                                setEditableKey(null);
                              }}
                            >
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="flex items-center gap-2"
                              >
                                <AlignHorizontalDistributeCenter />
                                Custom Function
                              </span>
                            </DialogTrigger>
                            <DialogContent
                              className="sm:max-w-[750px] border"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <DialogHeader>
                                <DialogTitle
                                  className={"flex items-center gap-2"}
                                >
                                  <AlignHorizontalDistributeCenter />
                                  Custom Function
                                </DialogTitle>
                              </DialogHeader>
                              {/* <FunctionItem dialogType={"custom-function"} /> */}
                              <ScrollArea className="max-h-[80vh]">
                                <div className="grid gap-4">
                                  <div className="grid gap-3">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                      id="name"
                                      name="name"
                                      value={name}
                                      onChange={(e) => setName(e.target.value)}
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label htmlFor="description">
                                      Description{" "}
                                    </Label>
                                    <Textarea
                                      className={"min-h-[100px]"}
                                      id="description"
                                      name="description"
                                      placeholder="Enter a description"
                                      value={description}
                                      onChange={(e) =>
                                        setDescription(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label htmlFor="your-url">Your URL</Label>
                                    <Input
                                      id="your-url"
                                      name="your-url"
                                      placeholder="Enter the url of the custom function"
                                      value={url}
                                      onChange={(e) => setUrl(e.target.value)}
                                    />
                                  </div>
                                  <div className=" flex items-center gap-3">
                                    <Input
                                      id="paush-detection"
                                      name="paush-detection"
                                      type={"number"}
                                      placeholder="Enter a description"
                                      value={timeout_ms}
                                      onChange={(e) =>
                                        setTimeoutMs(e.target.value)
                                      }
                                      className={"w-3/4"}
                                    />
                                    <span>miliseconds</span>
                                  </div>
                                  <div className="grid gap-3">
                                    <Label>Parameters (Optional)</Label>
                                    <p className="text-sm text-muted-foreground">
                                      JSON schema that defines the format in
                                      which the LLM will return. Please refer to
                                      the docs.
                                    </p>
                                    <Textarea
                                      className={"min-h-[150px]"}
                                      id="description"
                                      name="description"
                                      placeholder="Enter JSON schema here..."
                                      value={parameters}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setParameters(value);

                                        try {
                                          JSON.parse(value); // Just validate it
                                          console.log(JSON.parse(value));
                                          setJsonError(null);
                                        } catch (err) {
                                          setJsonError("Invalid JSON");
                                        }
                                      }}
                                    />
                                    {jsonError && (
                                      <p className="text-red-500 text-sm mt-1">
                                        {jsonError}
                                      </p>
                                    )}
                                  </div>
                                  {/* <div className="grid grid-cols-3 gap-3 w-2/5">
                                  <Button
                                    size={"sm"}
                                    className={"cursor-pointer w-20"}
                                  >
                                    Example 1
                                  </Button>
                                  <Button
                                    size={"sm"}
                                    className={"cursor-pointer w-20"}
                                  >
                                    Example 2
                                  </Button>
                                  <Button
                                    size={"sm"}
                                    className={"cursor-pointer w-20"}
                                  >
                                    Example 3
                                  </Button>
                                </div> */}
                                  {/* <div className="grid gap-3">
                                  <Button className={"cursor-pointer w-full"}>
                                    Format JSON
                                  </Button>
                                </div> */}
                                  <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-start gap-3">
                                      <Checkbox
                                        id="terms-2"
                                        defaultChecked={speak_during_execution}
                                        onClick={() =>
                                          setSpeakDuringExecution(
                                            !speak_during_execution
                                          )
                                        }
                                      />
                                      <div className="grid gap-2">
                                        <Label htmlFor="terms-2">
                                          Speak During Execution
                                        </Label>
                                        <p className="text-muted-foreground text-sm">
                                          If the function takes over 2 seconds,
                                          the agent can say something like: "Let
                                          me check that for you."
                                        </p>
                                      </div>
                                    </div>
                                    {speak_during_execution && (
                                      <Input
                                        placeholder="Enter the execution message description"
                                        value={execution_message_description}
                                        onChange={(e) =>
                                          setExecutionMessageDescription(
                                            e.target.value
                                          )
                                        }
                                      />
                                    )}
                                  </div>
                                  <div className="grid gap-3">
                                    <div className="flex items-start gap-3">
                                      <Checkbox
                                        id="terms-2"
                                        checked={speak_after_execution}
                                        onClick={() =>
                                          setSpeakAfterExecution(
                                            !speak_after_execution
                                          )
                                        }
                                      />
                                      <div className="grid gap-2">
                                        <Label htmlFor="terms-2">
                                          Speak After Execution
                                        </Label>
                                        <p className="text-muted-foreground text-sm">
                                          Unselect if you want to run the
                                          function silently, such as uploading
                                          the call result to the server
                                          silently.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </ScrollArea>
                              <DialogFooter>
                                <DialogClose
                                  onClick={() => setOpenTrigger(null)}
                                  asChild
                                >
                                  <Button
                                    variant="outline"
                                    className={"cursor-pointer"}
                                  >
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <DialogClose
                                  onClick={() => setOpenTrigger(null)}
                                  asChild
                                >
                                  <Button
                                    type="submit"
                                    className={"cursor-pointer"}
                                    onClick={() => {
                                      if (name) {
                                        setGeneralTools((prev) => {
                                          const newTool = {
                                            type: "custom",
                                            name,
                                            description,
                                            url,
                                            timeout_ms,
                                            speak_during_execution,
                                            execution_message_description,
                                            speak_after_execution,
                                            parameters: !jsonError
                                              ? JSON.parse(parameters)
                                              : {},
                                          };

                                          if (
                                            editableKey !== null &&
                                            editableKey !== undefined
                                          ) {
                                            // Update existing item
                                            return prev.map((tool, index) =>
                                              index === editableKey
                                                ? { ...tool, ...newTool }
                                                : tool
                                            );
                                          } else {
                                            // Add new item
                                            return [...prev, newTool];
                                          }
                                        });
                                      }
                                    }}
                                  >
                                    Save changes
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {/* </Dialog> */}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="agent-settings">
            <AccordionTrigger>
              <div className="flex items-center gap-3 font-bold text-sm cursor-pointer">
                <Bot className="w-5 h-5" />
                Agent Settings
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="w-full">
                {/* voice and language  */}
                <div>
                  <p className="mb-2">Voice & Language</p>
                  <div className="text-sm text-muted-foreground flex items-center justify-between">
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Language</SelectLabel>
                          {countryData.map((country) => (
                            <SelectItem
                              key={country.locale}
                              value={country.locale}
                            >
                              <Avatar>
                                <AvatarImage
                                  src={`https://flagsapi.com/${country.country_code}/flat/64.png`}
                                  alt={`${country.language} - ${country.country}`}
                                />
                              </Avatar>
                              {`${country.language} - ${country.country}`}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={
                              "!border-r-0 max-w-[180px] min-w-[100px] cursor-pointer"
                            }
                          >
                            {voice_id
                              ? allVoices.find(
                                  (voice) => voice.voice_id === voice_id
                                )?.voice_name
                              : "Please select a voice"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="min-w-2/3">
                          <DialogHeader>
                            <DialogTitle>Select Voice</DialogTitle>
                          </DialogHeader>
                          <SelectVoice
                            allVoices={allVoices}
                            setVoiceId={setVoiceId}
                          />
                        </DialogContent>
                      </Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button
                            // variant="outline"
                            size={"icon"}
                            asChild
                            className={"cursor-pointer"}
                          >
                            <Settings className="w-7 h-7" />
                          </Button>
                          <DropdownMenuContent className="w-fit">
                            <DropdownMenuLabel>Voice Model</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                              value={voice_model}
                              onValueChange={setVoiceModel}
                            >
                              {/* <DropdownMenuRadioItem
                                className="cursor-pointer"
                                value="auto"
                              >
                                <div className="flex flex-col">
                                  <p>Auto(Elevenlabs Turbo V2)</p>
                                  <p className="text-xs text-muted-foreground">
                                    English only, fast, high quality
                                  </p>
                                </div>
                              </DropdownMenuRadioItem> */}
                              {/* <Separator /> */}
                              <DropdownMenuRadioItem
                                className="cursor-pointer"
                                value="elevenlabs"
                              >
                                <div className="flex flex-col">
                                  <p>Elevenlabs</p>
                                  <p className="text-xs text-muted-foreground">
                                    English only, fast, high quality
                                  </p>
                                </div>
                              </DropdownMenuRadioItem>
                              {/* <DropdownMenuRadioItem
                                className="cursor-pointer"
                                value="eleven_turbo_v2"
                              >
                                <div className="flex flex-col">
                                  <p>Elevenlabs Turbo V2</p>
                                  <p className="text-xs text-muted-foreground">
                                    English only, fast, high quality
                                  </p>
                                </div>
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem
                                className="cursor-pointer"
                                value="eleven_flash_v2"
                              >
                                <div className="flex flex-col">
                                  <p>Elevenlabs Flash V2</p>
                                  <p className="text-xs text-muted-foreground">
                                    English only, fastest, medium quality
                                  </p>
                                </div>
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem
                                className="cursor-pointer"
                                value="eleven_turbo_v2_5"
                              >
                                <div className="flex flex-col">
                                  <p>Elevenlabs Turbo V2.5</p>
                                  <p className="text-xs text-muted-foreground">
                                    Multilingual, fast, high quality
                                  </p>
                                </div>
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem
                                className="cursor-pointer"
                                value="eleven_flash_v2_5"
                              >
                                <div className="flex flex-col">
                                  <p>Elevenlabs Flash V2.5</p>
                                  <p className="text-xs text-muted-foreground">
                                    Multilingual, fastest, medium quality
                                  </p>
                                </div>
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem
                                className="cursor-pointer"
                                value="eleven_multilingual_v2"
                              >
                                <div className="flex flex-col">
                                  <p>Elevenlabs Multilingual v2</p>
                                  <p className="text-xs text-muted-foreground">
                                    Multilingual, slow, highest quality
                                  </p>
                                </div>
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem
                                className="cursor-pointer"
                                value="Play3.0-mini"
                              >
                                <div className="flex flex-col">
                                  <p>Play3.0-mini</p>
                                  <p className="text-xs text-muted-foreground">
                                    Play3.0-mini
                                  </p>
                                </div>
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem
                                className="cursor-pointer"
                                value="PlayDialog"
                              >
                                <div className="flex flex-col">
                                  <p>PlayDialog</p>
                                  <p className="text-xs text-muted-foreground">
                                    PlayDialog
                                  </p>
                                </div>
                              </DropdownMenuRadioItem> */}
                            </DropdownMenuRadioGroup>
                            <DropdownMenuSeparator />
                            <div className="px-2 mb-2">
                              <p>Voice Speed</p>
                              <div className="flex items-center justify-between">
                                <Slider
                                  defaultValue={voice_speed}
                                  max={2}
                                  step={0.1}
                                  min={0.5}
                                  className={cn("w-[80%]", "cursor-pointer")}
                                  onValueChange={(value) => {
                                    setVoiceSpeed(value);
                                  }}
                                  //   {...props}
                                />{" "}
                                {voice_speed}
                              </div>
                            </div>
                            <div className="px-2 mb-2">
                              <p>Voice Temperature</p>
                              <div className="flex items-center justify-between">
                                <Slider
                                  defaultValue={voice_temperature}
                                  max={2}
                                  step={0.1}
                                  min={0}
                                  className={cn("w-[80%]", "cursor-pointer")}
                                  onValueChange={(value) => {
                                    setVoiceTemperature(value);
                                  }}
                                  //   {...props}
                                />{" "}
                                {voice_temperature}
                              </div>
                            </div>
                            <div className="px-2 mb-2">
                              <p>Voice Volume</p>
                              <div className="flex items-center justify-between">
                                <Slider
                                  defaultValue={volume}
                                  max={2}
                                  step={0.1}
                                  className={cn("w-[80%]", "cursor-pointer")}
                                  onValueChange={(value) => {
                                    setVolume(value);
                                  }}
                                  //   {...props}
                                />{" "}
                                {volume}
                              </div>
                            </div>
                            {/* <div className="mt-4 flex items-center justify-center">
                              <Button className="w-full cursor-pointer">
                                Save
                              </Button>
                            </div> */}
                          </DropdownMenuContent>
                        </DropdownMenuTrigger>
                      </DropdownMenu>
                    </div>
                  </div>
                  <p className="my-2">LLM Settings</p>
                  <div className="flex">
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger className="w-[180px] cursor-pointer">
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                        <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                        <SelectItem value="gpt-4.1">gpt-4.1</SelectItem>
                        <SelectItem value="gpt-4.1-mini">
                          gpt-4.1-mini
                        </SelectItem>
                        <SelectItem value="gpt-4.1-nano">
                          gpt-4.1-nano
                        </SelectItem>
                        <SelectItem value="claude-3.7-sonnet">
                          claude-3.7-sonnet
                        </SelectItem>
                        <SelectItem value="claude-3.5-haiku">
                          claude-3.5-haiku
                        </SelectItem>
                        <SelectItem value="gemini-2.0-flash">
                          gemini-2.0-flash
                        </SelectItem>
                        <SelectItem value="gemini-2.0-flash-lite">
                          gemini-2.0-flash-lite
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button
                          variant={"outline"}
                          className={"cursor-pointer"}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className={"w-[350px] p-3"}>
                        <div>
                          <p className="text-xl">LLM Temperature</p>
                          <p className="text-xs text-muted-foreground">
                            Lower value yields better function call results.
                          </p>
                          <div className="flex items-center justify-between">
                            <Slider
                              defaultValue={model_temperature}
                              max={1}
                              step={0.1}
                              className={cn("w-[80%]", "cursor-pointer")}
                              onValueChange={(value) => {
                                setModelTemperature(value);
                              }}
                              //   {...props}
                            />{" "}
                            {model_temperature}
                          </div>
                        </div>
                        {/* <div className="mt-4">
                <p className="text-xl">Structured Output</p>
                <p className="text-xs text-muted-foreground">
                  Always generate responses that adhere to your supplied JSON
                  Schema. This will make functions longer to save or update.
                </p>
                <div class="flex items-center justify-between">
                  <Switch className={"cursor-pointer mt-4"} />
                </div>
              </div> */}
                        <div className="mt-4">
                          <p className="text-xl">High Priority</p>
                          <p className="text-xs text-muted-foreground">
                            Use more dedicated resource pool to ensure lower and
                            more consistent latency. This feature incurs a
                            higher cost.
                          </p>
                          <div class="flex items-center justify-between">
                            <Switch
                              checked={model_high_priority}
                              onCheckedChange={setModelHighPriority}
                              className={"cursor-pointer mt-4"}
                            />
                          </div>
                        </div>
                        {/* <Separator className={"my-4"} />
              <Button className={"w-full"} disabled>
                Save
              </Button> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="knowsedge-base">
            <AccordionTrigger>
              <div className="flex items-center gap-3 font-bold text-sm cursor-pointer">
                <Book className="w-5 h-5" />
                Knowledge Base
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <p className="text-sm font-normal mb-2">
                  {" "}
                  Add knowledge base to provide context to the agent.
                </p>
                <div className=" flex flex-col gap-2">
                  {llmKnowlwdgeBaseIds.map((item, index) => {
                    return (
                      <div
                        className="flex items-center justify-between py-2 px-2 rounded-md gap-2 bg-zinc-800"
                        key={index}
                      >
                        <div className="flex items-center gap-2">
                          <Book className="size-4 text-muted-foreground4" />{" "}
                          <p>
                            {
                              allKnowledgeBases.filter(
                                (item2) => item2.knowledge_base_id === item
                              )?.[0]?.knowledge_base_name
                            }
                          </p>
                        </div>
                        <Trash2
                          onClick={() => {
                            setLlmKnowlwdgeBaseIds((prev) =>
                              prev.filter((item2) => item2 !== item)
                            );
                          }}
                          className=" h-4 w-4 cursor-pointer text-red-800 hover:text-red-600"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className=" mt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"outline"} className={"cursor-pointer"}>
                        <Plus /> Add
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      {allKnowledgeBases
                        .filter(
                          (item) =>
                            !llmKnowlwdgeBaseIds.includes(
                              item.knowledge_base_id
                            )
                        )
                        .map((item, index) => {
                          return (
                            <DropdownMenuItem
                              key={index}
                              className={"cursor-pointer"}
                              onClick={() => {
                                setLlmKnowlwdgeBaseIds((prev) => [
                                  ...prev,
                                  item.knowledge_base_id,
                                ]);
                              }}
                            >
                              {" "}
                              {item.knowledge_base_name}
                            </DropdownMenuItem>
                          );
                        })}
                      <Separator className={"my-2"} />
                      <Link
                        to="/knowledge-base"
                        target="_blank"
                        className="flex items-center justify-center gap-2"
                      >
                        <ArrowUpRight className="h-5 w-5" /> Create New
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="speech-settings">
            <AccordionTrigger>
              <div className="flex items-center gap-3 font-bold text-sm cursor-pointer">
                <Speech className="w-5 h-5" />
                Speech Settings
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="w-full font-normal px-3">
                <div>
                  <p className="mb-2">Background Sound</p>
                  <div className="flex items-center gap-3">
                    <Select
                      value={ambient_sound}
                      onValueChange={setAmbientSounds}
                    >
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Select a background sound" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={null}>None</SelectItem>
                          <SelectItem value="coffee-shop">
                            Coffee Shop
                          </SelectItem>
                          <SelectItem value="forest-birds">
                            Forest Birds
                          </SelectItem>
                          <SelectItem value="convention-hall">
                            Convention Hall
                          </SelectItem>
                          <SelectItem value="summer-outdoor">
                            Summer Outdoor
                          </SelectItem>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="mountain-outdoor">
                            Mountain Outdoor
                          </SelectItem>
                          <SelectItem value="static-noise">
                            Static Noise
                          </SelectItem>
                          <SelectItem value="call-center">
                            Call Center
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button
                          variant={"icon"}
                          size={"icon"}
                          className="w-5 h-5 cursor-pointer"
                          asChild
                        >
                          <Settings />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className={cn("w-56", "me-6")}>
                        <div className="px-2 mb-2">
                          <p>Volume</p>
                          <div className="flex items-center justify-between">
                            <Slider
                              defaultValue={ambient_sound_volume}
                              max={2}
                              step={0.1}
                              className={cn("w-[80%]", "cursor-pointer")}
                              onValueChange={(value) => {
                                setAmbientSoundVolume(value);
                              }}
                              //   {...props}
                            />{" "}
                            {ambient_sound_volume}
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="mb-2 font-bold">Responsiveness</p>
                  <p className="text-sm text-muted-foreground">
                    Controls how responsive is the agent.
                  </p>
                  <div className="flex items-center justify-between">
                    <Slider
                      defaultValue={responsiveness}
                      max={1}
                      step={0.1}
                      className={cn("w-[80%]", "cursor-pointer")}
                      onValueChange={(value) => {
                        setResponsiveness(value);
                      }}
                    />{" "}
                    {responsiveness}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="mb-2 font-bold">Interruption Sensitivity</p>
                  <p className="text-sm text-muted-foreground">
                    Controls how sensitive the agent is to user interruptions.
                  </p>
                  <div className="flex items-center justify-between">
                    <Slider
                      defaultValue={interruption_sensitivity}
                      max={1}
                      step={0.1}
                      className={cn("w-[80%]", "cursor-pointer")}
                      onValueChange={(value) => {
                        setInterruptionSensitivity(value);
                      }}
                      //   {...props}
                    />{" "}
                    {interruption_sensitivity}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="mb-2 font-bold">Enable Backchanneling</p>
                  <p className="text-sm text-muted-foreground">
                    Enables the agent to use affirmations like 'yeah' or
                    'uh-huh' during conversations, indicating active listening
                    and engagement.
                  </p>
                  <Switch
                    checked={enable_backchannel}
                    onCheckedChange={setEnableBackchannel}
                    className={"mt-2 cursor-pointer"}
                  />
                </div>
                <div className="mt-4">
                  <p className="mb-2 font-bold">Transcription Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Balance between speed and accuracy.
                  </p>
                  <RadioGroup
                    defaultValue="optimized-accuracy"
                    className="mt-2"
                    value={stt_mode}
                    onValueChange={setSttModel}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="fast"
                        id="r1"
                        className={"cursor-pointer border border-white"}
                      />
                      <p htmlFor="r1">Optimize for speed</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="accurate"
                        id="r2"
                        className={"cursor-pointer border border-white"}
                      />
                      <p htmlFor="r2">Optimize for accuracy</p>
                    </div>
                  </RadioGroup>
                </div>
                <div className="mt-4">
                  <p className="mb-2 font-bold">Boosted Keywords</p>
                  <p className="text-sm text-muted-foreground">
                    Provide a customized list of keywords to expand our models'
                    vocabulary.
                  </p>
                  <Input
                    className={"mt-2"}
                    placeholder="Split by comma. Ex: hello, hi"
                    value={boosted_keywords}
                    onChange={(e) => setBoostedKeywords(e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <p className="mb-2 font-bold">Enable Speech Normalization</p>
                  <p className="text-sm text-muted-foreground">
                    It converts text elements like numbers, currency, and dates
                    into human-like spoken forms. (Learn more)
                  </p>
                  <Switch
                    checked={normalize_for_speech}
                    onCheckedChange={setNormalizeForSpeech}
                    className={"mt-2 cursor-pointer"}
                  />
                </div>
                <div className="mt-4">
                  <p className="mb-2 font-bold">Enable Transcript Formatting</p>
                  <p className="text-sm text-muted-foreground">
                    Prevent agent errors like phone numbers being formatted as
                    timestamps.
                  </p>
                  <Switch
                    checked={enable_transcription_formatting}
                    onCheckedChange={setEnableTranscriptionFormatting}
                    className={"mt-2 cursor-pointer"}
                  />
                </div>
                <div className="mt-4">
                  <p className="mb-2 font-bold">Reminder Message Frequency</p>
                  <p className="text-sm text-muted-foreground">
                    Control how often AI will send a reminder message.
                  </p>
                  <div className="flex items-center mt-2">
                    <Input
                      className={"w-18 mx-2"}
                      value={reminder_trigger_ms}
                      onChange={(e) => setReminderTriggerMs(e.target.value)}
                    />
                    milliseconds{" "}
                  </div>
                </div>
                {/* <div className="mt-4">
                  <p className="mb-2 font-bold">Pronunciation</p>
                  <p className="text-sm text-muted-foreground">
                    Guide the model to pronunce a word, name, or phrase in a
                    specific way. (Learn more)
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className={"cursor-pointer mt-2"}
                      >
                        <Plus /> Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Pronunciation</DialogTitle>
                      </DialogHeader>
                      <div className="">
                        <div className="flex gap-2 flex-col w-full">
                          <Label htmlFor="word">Word</Label>
                          <Input type="text" id="word" placeholder="word" />
                        </div>
                        <div className="flex gap-2 flex-col w-full mt-4">
                          <Label htmlFor="pronunciation">Pronunciation</Label>
                          <Select>
                            <SelectTrigger
                              className="w-full"
                              id="pronunciation"
                            >
                              <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Fruits</SelectLabel>
                                <SelectItem value="apple">Apple</SelectItem>
                                <SelectItem value="banana">Banana</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2 flex-col w-full  mt-4">
                          <Label htmlFor="phoneme">Phoneme</Label>
                          <Input
                            type="text"
                            id="phoneme"
                            placeholder="Phoneme"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose>
                          <Button
                            variant="outline"
                            className={"cursor-pointer"}
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          className={"cursor-pointer"}
                          disabled
                        >
                          Save changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div> */}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="call-settings">
            <AccordionTrigger>
              <div className="flex items-center gap-3 font-bold text-sm cursor-pointer">
                <Headphones className="w-5 h-5" />
                Call Settings
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="w-full font-normal">
                <div className="mt-2">
                  <p className="mb-2 font-bold">Voicemail Detection</p>
                  <p className="text-sm text-muted-foreground">
                    Hang up or leave a voicemail if a voicemail is detected.
                  </p>
                  <Switch
                    checked={enable_voicemail_detection}
                    onCheckedChange={setEnableVoicemailDetection}
                    className={"mt-2 cursor-pointer"}
                  />
                </div>
                <div className="mt-4">
                  <p className="mb-2 font-bold">End Call on Silence</p>
                  <p className="text-sm text-muted-foreground">
                    Call will automatically terminated if there is silence.
                  </p>
                  <div className="flex items-center mt-2">
                    <Input
                      className={"w-22 mx-2"}
                      value={end_call_after_silence_ms}
                      onChange={(e) => setEndCallAfterSilenceMs(e.target.value)}
                    />
                    milliseconds{" "}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="mb-2 font-bold">Max call duration</p>
                  <p className="text-sm text-muted-foreground">
                    Call will automatically terminated after this duration.
                  </p>
                  <div className="flex items-center mt-2">
                    <Input
                      className={"w-22 mx-2"}
                      value={max_call_duration_ms}
                      onChange={(e) => setMaxCallDurationMs(e.target.value)}
                    />
                    milliseconds{" "}
                  </div>
                </div>
                {/* <div className="mt-4">
                  <p className="mb-2 font-bold">Pause Before Speaking</p>
                  <p className="text-sm text-muted-foreground">
                    The duration before the assistant starts speaking at the
                    beginning of the call.
                  </p>
                  <div className="flex items-center justify-between">
                    <Slider
                      defaultValue={voice_speed}
                      max={100}
                      step={1}
                      className={cn("w-[80%]", "cursor-pointer")}
                      onValueChange={(value) => {
                        setVoiceSpeed(value);
                      }}
                      //   {...props}
                    />{" "}
                    {voice_speed}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="mb-2 font-bold">Ring Duration</p>
                  <p className="text-sm text-muted-foreground">
                    The duration for which the phone will ring before the call
                    is answered or terminated.
                  </p>
                  <div className="flex items-center justify-between">
                    <Slider
                      defaultValue={voice_speed}
                      max={100}
                      step={1}
                      className={cn("w-[80%]", "cursor-pointer")}
                      onValueChange={(value) => {
                        setVoiceSpeed(value);
                      }}
                      //   {...props}
                    />{" "}
                    {voice_speed}
                  </div>
                </div> */}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="post-call-analysis">
            <AccordionTrigger>
              <div className="flex items-center gap-3 font-bold text-sm cursor-pointer">
                <ChartLine className="w-5 h-5" />
                Post-Call Analysis
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Dialog>
                <div className="w-full font-normal">
                  <div className="mt-2">
                    <p className="mb-2 font-bold">Post Call Data Retrieval</p>
                    <p className="text-sm text-muted-foreground">
                      Define the information that you need to extract from the
                      call.
                    </p>
                    {post_call_analysis_data?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="mt-2 flex items-center justify-between bg-zinc-800 p-2 rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <Text className="w-5 h-5 inline-block" />
                            <p className=" text-muted-foreground">
                              {item.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <DialogTrigger>
                              <Button
                                variant={"outline"}
                                size={"icon"}
                                className={"cursor-pointer"}
                                onClick={() => {
                                  setPostCallName(item.name);
                                  setPostCallDescription(item.description);
                                  setPostCallExample(item.example);
                                  setPostCallDataEdit(index);
                                }}
                              >
                                <Pencil />
                              </Button>
                            </DialogTrigger>
                            <Button
                              variant={"outline"}
                              size={"icon"}
                              className={
                                "cursor-pointer text-red-800 hover:text-red-600"
                              }
                              onClick={() => {
                                setPostCallAnalysisData((prev) =>
                                  prev.filter((data) => data.name !== item.name)
                                );
                              }}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </div>
                      );
                    })}

                    <div className="mt-2 flex items-center justify-evenly gap-3">
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            onClick={() => {
                              setPostCallDataEdit(null);
                            }}
                            className="cursor-pointer border w-[100px] flex items-center gap-2 rounded-md py-2 px-3 bg-zinc-900"
                          >
                            <Plus /> Add
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className={"w-full"}>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <DialogTrigger className="flex items-center gap-2 cursor-pointer">
                                <Text /> Text
                              </DialogTrigger>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <DialogTrigger className="flex items-center gap-2 cursor-pointer">
                                <List /> Selector
                              </DialogTrigger>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <DialogTrigger className="flex items-center gap-2 cursor-pointer">
                                <Ban /> Boolean
                              </DialogTrigger>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <DialogTrigger className="flex items-center gap-2 cursor-pointer">
                                <Binary /> Number
                              </DialogTrigger>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div>
                        <Select
                          onValueChange={setPostCallAnalysisModel}
                          value={post_call_analysis_model}
                          defaultValue="gpt-4o"
                        >
                          <SelectTrigger className="w-[150px] cursor-pointer">
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
                      </div>
                    </div>
                  </div>

                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className={"flex items-center gap-2"}>
                        <Text />
                        Text
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className={"max-h-[80vh]"}>
                      <div className="py-4">
                        <div className="items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            className="col-span-3 my-4"
                            placeholder="John Smith"
                            value={postCallName}
                            onChange={(e) => setPostCallName(e.target.value)}
                          />
                        </div>
                        <div className="items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            className="col-span-3 my-4 min-h-24"
                            placeholder="Enter a description"
                            value={postCallDescription}
                            onChange={(e) =>
                              setPostCallDescription(e.target.value)
                            }
                          />
                        </div>
                        <div className="items-center gap-4 flex">
                          <div className="flex flex-col w-full ">
                            <Label htmlFor="example" className="text-right">
                              Format Example (Optional)
                            </Label>
                            <Input
                              id="example"
                              className="w-full mt-4"
                              placeholder="Option value"
                              value={postCallExample}
                              onChange={(e) =>
                                setPostCallExample(e.target.value)
                              }
                            />
                          </div>
                          <Button
                            variant={"outline"}
                            size={"icon"}
                            className={
                              "mt-8 cursor-pointer text-red-800 hover:text-red-600"
                            }
                            onClick={() => {
                              setPostCallExample("");
                            }}
                          >
                            <Trash2 className="" />
                          </Button>
                        </div>
                        {/* <Button
                        variant="outline"
                        className={"mt-4 cursor-pointer"}
                      >
                        <Plus />
                        Add
                      </Button> */}
                      </div>
                    </ScrollArea>
                    <DialogFooter>
                      <DialogClose>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setPostCallName("");
                            setPostCallDescription("");
                            setPostCallExample("");
                            setPostCallDataEdit(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={() => {
                          if (postCallDataEdit === null) {
                            setPostCallAnalysisData((prev) => [
                              ...prev,
                              {
                                type: "string",
                                name: postCallName,
                                description: postCallDescription,
                                example: postCallExample,
                              },
                            ]);
                            setPostCallName("");
                            setPostCallDescription("");
                            setPostCallExample("");
                          } else {
                            setPostCallAnalysisData((prev) => [
                              ...prev.filter(
                                (data, index) => index !== postCallDataEdit
                              ),
                              {
                                type: "string",
                                name: postCallName,
                                description: postCallDescription,
                                example: postCallExample,
                              },
                            ]);
                            setPostCallName("");
                            setPostCallDescription("");
                            setPostCallExample("");
                            setPostCallDataEdit(null);
                          }
                        }}
                      >
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </div>
              </Dialog>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="security-fallback">
            <AccordionTrigger>
              <div className="flex items-center gap-3 font-bold text-sm cursor-pointer">
                <ShieldCheck className="w-5 h-5" />
                Security & Fallback Settings
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="w-full font-normal px-3">
                <div className="mt-4">
                  <p className="mb-2 font-bold">
                    Opt Out Sensitive Data Storage
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Control whether Retell should store sensitive data. (Learn
                    more)
                  </p>
                  <Switch
                    checked={opt_out_sensitive_data_storage}
                    onCheckedChange={setOptOutSensitiveDataStorage}
                    className={"mt-2 cursor-pointer"}
                  />
                </div>
                <div className="mt-4">
                  <p className="mb-2 font-bold">Opt In Secure URLs</p>
                  <p className="text-sm text-muted-foreground">
                    Add security signatures to URLs. The URLs expire after 24
                    hours.
                  </p>
                  <Switch
                    checked={opt_in_signed_url}
                    onCheckedChange={setOptInSignedUrl}
                    className={"mt-2 cursor-pointer"}
                  />
                </div>
                <div className="mt-4">
                  <p className="mb-2 font-bold">Fallback Voice ID</p>
                  <p className="text-sm text-muted-foreground">
                    If the current voice provider fails, assign a fallback voice
                    to continue the call.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={" max-w-[180px] cursor-pointer mt-3"}
                      >
                        <Plus /> Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="min-w-2/3">
                      <DialogHeader>
                        <DialogTitle>Select Voice</DialogTitle>
                      </DialogHeader>
                      <SelectVoice allVoices={allVoices} />
                    </DialogContent>
                  </Dialog>
                </div>
                {/* <div className="mt-4">
                  <p className="mb-2 font-bold">Default Dynamic Variables</p>
                  <p className="text-sm text-muted-foreground">
                    Set fallback values for dynamic variables across all
                    endpoints if they are not provided.
                  </p>
                  <Button
                    variant={"outline"}
                    className={" max-w-[180px] cursor-pointer mt-3"}
                  >
                    <Settings /> Set Up
                  </Button>
                </div> */}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="webhook-settings">
            <AccordionTrigger>
              <div className="flex items-center gap-3 font-bold text-sm cursor-pointer">
                <Box className="w-5 h-5" />
                Webhook Settings
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="w-full font-normal">
                <div className="mt-4">
                  <Label className="mb-2 font-bold" htmlFor="inbound-call">
                    Inbound Call Webhook URL
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    The webhook has been migrated to phone level webhook. (Learn
                    more).
                  </p>
                  <Input
                    id="inbound-call"
                    className={"mt-2"}
                    value={webhook_url}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                </div>
                {/* <div className="mt-4">
                  <Label className="mb-2 font-bold" htmlFor="agent-level">
                    Agent Level Webhook URL
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Webhook URL to receive events from Retell. (Learn more)
                  </p>
                  <Input id="agent-level" className={"mt-2"} />
                </div> */}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default GlobalSettings;

const countryData = [
  {
    language: "English (US)",
    country: "United States",
    country_code: "US",
    // locale: "en-US",
    locale: "en",
  },
  {
    language: "English (IN)",
    country: "India",
    country_code: "IN",
    locale: "en-IN",
  },
  {
    language: "English (GB)",
    country: "United Kingdom",
    country_code: "GB",
    locale: "en-GB",
  },
  {
    language: "English (AU)",
    country: "Australia",
    country_code: "AU",
    locale: "en-AU",
  },
  {
    language: "English (NZ)",
    country: "New Zealand",
    country_code: "NZ",
    locale: "en-NZ",
  },
  {
    language: "German",
    country: "Germany",
    country_code: "DE",
    locale: "de-DE",
  },
  {
    language: "Spanish",
    country: "Spain",
    country_code: "ES",
    locale: "es-ES",
  },
  {
    language: "Spanish (LatAm)",
    country: "Latin America",
    country_code: "419",
    locale: "es-419",
  },
  { language: "Hindi", country: "India", country_code: "IN", locale: "hi-IN" },
  {
    language: "French",
    country: "France",
    country_code: "FR",
    locale: "fr-FR",
  },
  {
    language: "French (Canada)",
    country: "Canada",
    country_code: "CA",
    locale: "fr-CA",
  },
  {
    language: "Japanese",
    country: "Japan",
    country_code: "JP",
    locale: "ja-JP",
  },
  {
    language: "Portuguese",
    country: "Portugal",
    country_code: "PT",
    locale: "pt-PT",
  },
  {
    language: "Portuguese (Brazil)",
    country: "Brazil",
    country_code: "BR",
    locale: "pt-BR",
  },
  {
    language: "Chinese (Mandarin)",
    country: "China",
    country_code: "CN",
    locale: "zh-CN",
  },
  {
    language: "Russian",
    country: "Russia",
    country_code: "RU",
    locale: "ru-RU",
  },
  {
    language: "Italian",
    country: "Italy",
    country_code: "IT",
    locale: "it-IT",
  },
  {
    language: "Korean",
    country: "South Korea",
    country_code: "KR",
    locale: "ko-KR",
  },
  {
    language: "Dutch",
    country: "Netherlands",
    country_code: "NL",
    locale: "nl-NL",
  },
  {
    language: "Dutch (Belgium)",
    country: "Belgium",
    country_code: "BE",
    locale: "nl-BE",
  },
  {
    language: "Polish",
    country: "Poland",
    country_code: "PL",
    locale: "pl-PL",
  },
  {
    language: "Turkish",
    country: "Turkey",
    country_code: "TR",
    locale: "tr-TR",
  },
  {
    language: "Vietnamese",
    country: "Vietnam",
    country_code: "VN",
    locale: "vi-VN",
  },
  {
    language: "Romanian",
    country: "Romania",
    country_code: "RO",
    locale: "ro-RO",
  },
  {
    language: "Bulgarian",
    country: "Bulgaria",
    country_code: "BG",
    locale: "bg-BG",
  },
  {
    language: "Catalan",
    country: "Spain (Catalonia)",
    country_code: "ES",
    locale: "ca-ES",
  },
  {
    language: "Thai",
    country: "Thailand",
    country_code: "TH",
    locale: "th-TH",
  },
  {
    language: "Danish",
    country: "Denmark",
    country_code: "DK",
    locale: "da-DK",
  },
  {
    language: "Finnish",
    country: "Finland",
    country_code: "FI",
    locale: "fi-FI",
  },
  { language: "Greek", country: "Greece", country_code: "GR", locale: "el-GR" },
  {
    language: "Hungarian",
    country: "Hungary",
    country_code: "HU",
    locale: "hu-HU",
  },
  {
    language: "Indonesian",
    country: "Indonesia",
    country_code: "ID",
    locale: "id-ID",
  },
  {
    language: "Norwegian",
    country: "Norway",
    country_code: "NO",
    locale: "no-NO",
  },
  {
    language: "Slovak",
    country: "Slovakia",
    country_code: "SK",
    locale: "sk-SK",
  },
  {
    language: "Swedish",
    country: "Sweden",
    country_code: "SE",
    locale: "sv-SE",
  },
  {
    language: "Malay",
    country: "Malaysia",
    country_code: "MY",
    locale: "ms-MY",
  },
  {
    language: "Multi-language",
    country: "Multiple",
    country_code: "MULTI",
    locale: "multi",
  },
];

// select voice modal content
const SelectVoice = ({ allVoices, setVoiceId }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null); // index of playing item
  const audioRef = useRef(null); // single audio element for reuse
  const [filterModels, setFilterModels] = useState(allVoices);
  const [genderFilter, setGenderFilter] = useState("all");
  const [AccentFilter, setAccentFilter] = useState("all");
  const [model, setModel] = useState("");

  useEffect(() => {
    if (genderFilter !== "all" || AccentFilter !== "all") {
      setFilterModels(
        allVoices.filter((voice) => {
          if (genderFilter === "all") {
            return voice.accent === AccentFilter;
          } else if (AccentFilter === "all") {
            return voice.gender === genderFilter;
          } else {
            return (
              voice.accent === AccentFilter && voice.gender === genderFilter
            );
          }
        })
      );
    } else {
      setFilterModels(allVoices);
    }
  }, [genderFilter, AccentFilter]);
  console.log("Filtered Models: ", genderFilter, AccentFilter);
  const handlePlayPause = (item, index) => {
    // If already playing this item, pause it
    if (currentlyPlaying === index) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
    } else {
      // Pause existing audio if any
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Create a new audio element
      const audio = new Audio(item.preview_audio_url);
      audioRef.current = audio;

      // Play the new audio
      audio.play();
      setCurrentlyPlaying(index);

      // When audio ends, reset state
      audio.onended = () => {
        setCurrentlyPlaying(null);
      };
    }
  };
  return (
    <>
      <ScrollArea className="h-[500px] w-full rounded-md">
        <div className="w-full  ">
          <Tabs defaultValue="elevelabs" className="w-full">
            <TabsList className="grid w-[400px] grid-cols-3">
              <TabsTrigger value="elevelabs" className={"cursor-pointer"}>
                Elevenlabs
              </TabsTrigger>
              {/* <TabsTrigger value="playht" className={"cursor-pointer"}>
              PlayHT
            </TabsTrigger>
            <TabsTrigger value="openai" className={"cursor-pointer"}>
              OpenAI
            </TabsTrigger> */}
            </TabsList>
            <TabsContent value="elevelabs">
              <div className="flex w-full flex-row justify-start gap-4">
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger className="w-[180px] cursor-pointer">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Gender</SelectLabel>
                      <SelectItem value="all">All Gender</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select value={AccentFilter} onValueChange={setAccentFilter}>
                  <SelectTrigger className="w-[180px] cursor-pointer">
                    <SelectValue placeholder="All Accent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Accent List</SelectLabel>
                      <SelectItem value="all">All Accent</SelectItem>
                      <SelectItem value="American">American</SelectItem>
                      <SelectItem value="British">British</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {/* <Select>
                  <SelectTrigger className="w-[180px] cursor-pointer">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>All Types</SelectLabel>
                      <SelectItem value="apple">Types List</SelectItem>
                      <SelectItem value="banana">Retell Presets</SelectItem>
                      <SelectItem value="blueberry">
                        Provider Presets
                      </SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Input className="w-[400px]" placeholder="Search voice..." /> */}
              </div>
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>Voice</TableHead>
                      <TableHead>Accent</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead></TableHead>
                      {/* <TableHead className="text-right">Amount</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterModels.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Button
                            variant="ghost"
                            className="cursor-pointer hover:text-blue-700"
                            size="icon"
                            onClick={() => handlePlayPause(item, index)}
                          >
                            {currentlyPlaying === index ? <Pause /> : <Play />}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex gap-2 items-center">
                            <Avatar>
                              <AvatarImage
                                src={item.avatar_url}
                                alt="@shadcn"
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            {item.voice_name}
                          </div>
                        </TableCell>
                        <TableCell>{item.accent}</TableCell>
                        <TableCell>{item.age}</TableCell>
                        <TableCell>{item.gender}</TableCell>
                        <TableCell>{item.provider}</TableCell>{" "}
                        <TableCell className="text-right">
                          <DialogClose asChild>
                            <Button
                              variant={"link"}
                              className={
                                "cursor-pointer text-green-800 hover:text-green-600"
                              }
                              onClick={() => setVoiceId(item.voice_id)}
                            >
                              <Check /> Use this voice
                            </Button>
                          </DialogClose>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            {/* <TabsContent value="playht">
            <h2>pass</h2>
          </TabsContent>
          <TabsContent value="openai">
            <h2>pass</h2>
          </TabsContent> */}
          </Tabs>
        </div>
      </ScrollArea>
    </>
  );
};
