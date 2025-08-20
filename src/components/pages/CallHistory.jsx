import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  ArrowUpFromLine,
  CalendarDays,
  CalendarIcon,
  Dot,
  Download,
  Headphones,
  History,
  Info,
  Lightbulb,
  Loader2,
  Phone,
  Plus,
  Settings,
  SquareCheck,
  Text,
  Trash,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { addDays, format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import {
  generalDeleteFunction,
  generalGetFunction,
} from "@/globalFunctions/globalFunction";
import Loading from "../commonComponents/Loading";
// import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
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
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { DialogFooter, DialogHeader } from "../ui/dialog";

const CallHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Set default range: from 5 days ago to today
  const today = new Date();
  const defaultRange = {
    from: subDays(today, 5),
    to: today,
  };
  const [date, setDate] = useState(defaultRange);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState(null);
  const [refreshData, setRefreshData] = useState(0);
  const allWorkspacesData = useSelector((state) => state.allWorkspaces);
  const [allWorkSpaces, setAllWorkSpaces] = useState([]);

  useEffect(() => {
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
    async function getData() {
      // const apiData = await generalGetFunction("/call/all");
      const apiData = await generalGetFunction(
        `/list-calls/${allWorkSpaces?.id}`
      );
      if (apiData.status) {
        setCalls(apiData.data);
        setLoading(false);
        setDeleteLoading(false);
        setShowDeleteDialog(false);
      } else {
        setLoading(false);
      }
    }
    if (allWorkSpaces?.id) {
      getData();
    }
  }, [refreshData, allWorkSpaces]);

  const allWorkspacea = async () => {
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
  };

  function formatTimestampToDateTime(timestamp) {
    const date = new Date(timestamp);

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  function formatDurationToTime(durationMs) {
    const totalSeconds = Math.floor(durationMs / 1000);

    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  const filteredCalls = calls?.filter((call) => {
    if (!date?.from || !date?.to || !call?.start_timestamp) return false;

    const callDate = new Date(call.start_timestamp);

    const from = new Date(date.from);
    from.setHours(0, 0, 0, 0);

    const to = new Date(date.to);
    to.setHours(23, 59, 59, 999);

    return callDate >= from && callDate <= to;
  });

  const exportToCSV = () => {
    if (!filteredCalls || filteredCalls.length === 0) {
      return alert("No data available to export.");
    }

    // Dynamically get all unique keys from all objects
    const allKeys = Array.from(
      new Set(filteredCalls.flatMap((call) => Object.keys(call)))
    );

    // CSV headers
    const headers = allKeys;

    // Rows
    const rows = filteredCalls.map((call) =>
      allKeys.map((key) => {
        const value = call[key];

        // Format timestamp if it's the start_timestamp
        if (key === "start_timestamp") {
          return formatTimestampToDateTime(value);
        }

        return value !== undefined && value !== null ? value : "";
      })
    );

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "filtered_calls.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  async function handleDeleteKnowledgeBase() {
    setDeleteLoading(true);
    const apiData = await generalDeleteFunction(
      // `/call/delete/${selectedCall?.call_id}`
      `/delete-call/${selectedCall?.call_id}`
    );
    if (apiData.status) {
      setRefreshData(refreshData + 1);
    } else {
      toast.error(apiData.error || "Failed to delete call history.");
      setShowDeleteDialog(false);
      setDeleteLoading(false);
    }
  }

  if (loading) return <Loading />;
  // {loading && <Loading />}
  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">Call History</h1>
        <p className="text-gray-600">
          This is where you can view the call history.
        </p>
        {/* Add your call history table or component here */}
        <div className="flex justify-between items-center">
          {/* Button group */}
          <div className="flex gap-2 mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-[300px] justify-start text-left font-normal cursor-pointer",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  disabled={(day) => day > today} // disable future dates
                />
              </PopoverContent>
            </Popover>
            {/* <Button variant="outline" className="cursor-pointer">
              <CalendarDays /> Date Range
            </Button> */}
            {/* <Button variant="outline" className="cursor-pointer">
              <Plus /> Filter
            </Button>
            <Button variant="outline" className="cursor-pointer">
              <Settings /> Customize Fields
            </Button> */}
          </div>
          <div>
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="cursor-pointer"
            >
              <ArrowUpFromLine /> Export
            </Button>
          </div>
        </div>

        {/* Call history table */}
        <Sheet>
          <div className="overflow-x-auto w-full">
            <Table>
              <TableCaption>
                {filteredCalls.length === 0
                  ? "No calls found!"
                  : "A list of your recent calls."}
              </TableCaption>
              <TableHeader className="bg-zinc-800">
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Session ID</TableHead>
                  <TableHead>Disconnect Reason</TableHead>
                  <TableHead>Session Status</TableHead>
                  <TableHead>User Sentiment</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  {/* <TableHead>Call Success</TableHead>
                  <TableHead>Latency</TableHead> */}
                  {/* <TableHead>Question 1</TableHead>
                  <TableHead>Question 2</TableHead>
                  <TableHead>Question 3</TableHead>
                  <TableHead>Question 4</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalls?.map((call, index) => (
                  <TableRow
                    onClick={() => setSelectedCall(call)}
                    key={index}
                    className="cursor-pointer"
                  >
                    <TableCell className="p-0">
                      <SheetTrigger className="w-full cursor-pointer">
                        <div className="grid grid-cols-10 w-full">
                          <div className="p-4">
                            {formatTimestampToDateTime(call?.start_timestamp)}
                          </div>
                        </div>
                      </SheetTrigger>
                    </TableCell>
                    <TableCell className="p-0">
                      <SheetTrigger className="w-full cursor-pointer">
                        <div className="grid grid-cols-10 w-full">
                          <div className="p-4">
                            {formatDurationToTime(call?.duration_ms)}
                          </div>
                        </div>
                      </SheetTrigger>
                    </TableCell>
                    <TableCell className="p-0">
                      <SheetTrigger className="w-full cursor-pointer">
                        <div className="grid grid-cols-10 w-full">
                          <div className="p-4">{call?.call_type}</div>
                        </div>
                      </SheetTrigger>
                    </TableCell>
                    <TableCell className="p-0">
                      <SheetTrigger className="w-full cursor-pointer">
                        <div className="grid grid-cols-10 w-full">
                          <div className="p-4">
                            {call?.call_cost?.combined_cost && "$"}
                            {call?.call_cost?.combined_cost}
                          </div>
                        </div>
                      </SheetTrigger>
                    </TableCell>
                    <TableCell className="p-0">
                      <SheetTrigger className="w-full cursor-pointer">
                        <div className="grid grid-cols-10 w-full">
                          <div className="p-4">{call?.call_id}</div>
                        </div>
                      </SheetTrigger>
                    </TableCell>
                    <TableCell className="p-0">
                      <SheetTrigger className="w-full cursor-pointer">
                        <div className="grid grid-cols-10 w-full">
                          <div className="p-4">
                            {call?.disconnection_reason?.split("_").join(" ")}
                          </div>
                        </div>
                      </SheetTrigger>
                    </TableCell>
                    <TableCell className="p-0">
                      <SheetTrigger className="w-full cursor-pointer">
                        <div className="grid grid-cols-10 w-full">
                          <div className="p-4">{call?.call_status}</div>
                        </div>
                      </SheetTrigger>
                    </TableCell>
                    <TableCell className="p-0">
                      <SheetTrigger className="w-full cursor-pointer">
                        <div className="grid grid-cols-10 w-full">
                          <div className="p-4">
                            {call?.call_analysis?.user_sentiment}
                          </div>
                        </div>
                      </SheetTrigger>
                    </TableCell>
                    <TableCell className="p-0">
                      <SheetTrigger className="w-full cursor-pointer">
                        <div className="grid grid-cols-10 w-full">
                          <div className="p-4">{call?.from_number}</div>
                        </div>
                      </SheetTrigger>
                    </TableCell>
                    <TableCell className="p-0">
                      <SheetTrigger className="w-full cursor-pointer">
                        <div className="grid grid-cols-10 w-full">
                          <div className="p-4">{call?.to_number}</div>
                        </div>
                      </SheetTrigger>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <SheetContent
            onCloseAutoFocus={(e) => e.preventDefault()}
            className="min-w-fit max-w-3/4 h-full overflow-y-auto px-3"
          >
            <SheetHeader>
              <SheetTitle>Call history</SheetTitle>
              <SheetDescription>
                See all the details of this call history.
              </SheetDescription>
            </SheetHeader>
            <div className="flex justify-between items-center">
              <p className="text-sm">
                {formatTimestampToDateTime(selectedCall?.start_timestamp)}{" "}
                {selectedCall?.call_type}
              </p>
              <Trash
                onClick={() => setShowDeleteDialog(true)}
                className="cursor-pointer h-4 w-4"
              />
            </div>
            <p className="text-xs">
              Agent:{" "}
              <span className="hover:underline cursor-pointer">
                {selectedCall?.agent_id}
              </span>
            </p>
            <p className="text-xs">
              Duration: {formatDurationToTime(selectedCall?.duration_ms)}
            </p>
            <p className="text-xs">
              Cost: ${selectedCall?.call_cost?.combined_cost}
            </p>
            <div className="flex items-center mt-2">
              <audio controls className="w-[300px] h-10">
                <source src={selectedCall?.recording_url} />
                Your browser does not support the audio element.
              </audio>
              {/* <Button
                variant="outline"
                className="cursor-pointer ms-4"
                size="icon"
              >
                <Download />
              </Button> */}
            </div>
            <Separator />
            <p>Conversation Analysis</p>
            <p className="text-sm text-muted-foreground">Preset</p>
            <div class=" inline-flex items-start justify-start gap-2">
              <div class="mt-2 inline-flex w-[280px] flex-col items-start justify-start gap-2">
                {/* <div class=" inline-flex items-center justify-start gap-2">
                  <div class="relative h-5 w-5 text-gray-500">
                    <SquareCheck className="h-4 w-4" />
                  </div>
                  <div class="text-sm font-normal leading-tight text-text-strong-950">
                    Call Successful
                  </div>
                </div> */}
                <div class=" inline-flex items-center justify-start gap-2">
                  <div class="relative h-5 w-5 text-gray-500">
                    <Headphones className="h-4 w-4" />
                  </div>
                  <div class="text-sm font-normal leading-tight text-text-strong-950">
                    Call Status
                  </div>
                </div>
                <div class=" inline-flex items-center justify-start gap-2">
                  <div class="relative h-5 w-5 text-gray-500">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div class="text-sm font-normal leading-tight text-text-strong-950">
                    User Sentiment
                  </div>
                </div>
                <div class=" inline-flex items-center justify-start gap-2">
                  <div class="relative h-5 w-5 text-gray-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div class="text-sm font-normal leading-tight text-text-strong-950">
                    Disconnection Reason
                  </div>
                </div>
              </div>
              <div class="mt-2 inline-flex w-[280px] flex-col items-start justify-start gap-2">
                {/* <div class="inline-flex items-center justify-start gap-2">
                  <Dot className="h-6 w-6 text-red-500" />
                  <div class="text-sm font-normal leading-tight text-text-sub-600">
                    {selectedCall?.call_status}
                  </div>
                </div> */}
                <div class=" inline-flex items-center justify-start gap-2">
                  <Dot className="h-6 w-6 text-white" />
                  <div class="text-sm font-normal leading-tight text-text-sub-600">
                    {selectedCall?.call_status}
                  </div>
                </div>
                <div class=" inline-flex items-center justify-start gap-2">
                  <Dot className="h-6 w-6 text-blue-500" />
                  <div class="text-sm font-normal leading-tight text-text-sub-600">
                    {selectedCall?.call_analysis?.user_sentiment}
                  </div>
                </div>
                <div class=" inline-flex items-center justify-start gap-2">
                  <Dot className="h-6 w-6 text-green-500" />
                  <div class="text-sm font-normal leading-tight text-text-sub-600">
                    {selectedCall?.disconnection_reason?.split("_").join(" ")}
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div class="border-b border-stroke-sub-300-line p-4">
              <div class="text-sm font-medium leading-normal text-text-strong-950 mb-2">
                Summary
              </div>
              <div class="text-sm font-normal leading-tight text-text-strong-950 w-[500px]">
                {selectedCall?.call_analysis?.call_summary}
              </div>
            </div>
            <Separator className="my-4" />
            <div class="mt-2 inline-flex w-[550px] flex-col items-start justify-start gap-2">
              <div class="grid gap-4">
                <div class="space-y-1">
                  <div class="pt-5 text-xs font-normal text-gray-500">
                    Custom
                  </div>
                  {selectedCall?.transcript_object?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        class="flex h-auto items-start justify-start gap-2 w-full"
                      >
                        <div class="flex flex-col items-start justify-start gap-2 ">
                          <div class="flex items-center justify-start gap-2">
                            {/* <div class="relative h-5 w-5">
                              <Text className="h-5 w-5 text-muted-foreground" />
                            </div> */}
                            <div class="text-sm font-normal leading-tight text-text-strong-950">
                              {item.role}:
                            </div>
                          </div>
                        </div>
                        <div class="flex  flex-col items-start justify-start gap-2 w-full ">
                          <div class="flex items-center justify-start gap-2 w-full">
                            <div class="text-sm font-normal  leading-tight text-text-sub-600">
                              {item.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* <Separator /> */}

            {/* <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter> */}
          </SheetContent>
        </Sheet>
      </div>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Info className="w-6 h-6 text-red-700 mr-2" />
              Delete Call History
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this call history? This action
              cannot be reversed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="mr-2 cursor-pointer"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              onClick={handleDeleteKnowledgeBase}
              disabled={deleteLoading}
            >
              {deleteLoading && <Loader2 className="animate-spin mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CallHistory;
