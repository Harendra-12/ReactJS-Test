import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { DialogHeader } from "../ui/dialog";
import { CloudUpload, Download, Info, Trash2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import timeZone from "../../lib/timeZone.json";
import { DateTimePicker } from "../ui/date-time-picker";
import { toast } from "sonner";
import Papa from "papaparse";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";
import {
  generalGetFunction,
  generalPostFunction,
} from "@/globalFunctions/globalFunction";
import ErrorMessage from "../commonComponents/ErrorMessage";
import { useForm, Controller } from "react-hook-form";
// import templatecsv from "../../assets/template/template.csv";

const BatchCalls = () => {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full">
        <div>
          <h1 className="text-2xl font-bold">Batch Calls</h1>
          <p className="text-gray-600">You can manage your batch calls here.</p>
        </div>

        <div className="flex flex-col justify-between items-center">
          {/* Create batch calls button  */}
          <div className="flex items-center justify-end w-full">
            <Drawer>
              <DrawerTrigger asChild>
                <Button className={"cursor-pointer"}>
                  Create a batch call
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DialogHeader>
                  <DrawerTitle>Create a batch call</DrawerTitle>
                  <DrawerDescription>
                    <span className="flex items-center gap-2">
                      <Info className="size-4" /> Batch call cost $0.005 per
                      dial{" "}
                    </span>
                  </DrawerDescription>
                </DialogHeader>
                <BatchCallsConfig />
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </>
  );
};

const BatchCallsConfig = () => {
  const {
    control,
    register,
    watch,
    formState: { errors, isValid },
    trigger,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      batchCallName: "",
      fromNumber: "",
      timeSchedule: "send-now",
      date: null,
      timeZoneValue: "",
    },
  });

  const [availableNumbers, setAvailableNumbers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const timeSchedule = watch("timeSchedule");

  useEffect(() => {
    fetchAvailableNumbers();
  }, []);

  useEffect(() => {
    if (timeSchedule === "schedule") {
      trigger(["date", "timeZoneValue"]);
    }
  }, [timeSchedule]);

  const fetchAvailableNumbers = async () => {
    // const res = await generalGetFunction("/phonenumber/all");
    const res = await generalGetFunction("/list-phone-numbers");
    if (res.status) {
      setAvailableNumbers(res.data);
    } else {
      console.error("Failed to fetch available phone numbers");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    if (file.type !== "text/csv") {
      toast.error("Only CSV files are allowed.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must be under 50MB.");
      return;
    }

    Papa.parse(file, {
      complete: (result) => {
        const rows = result.data;
        const headers = rows[0];
        if (
          !headers.includes("phone number") ||
          !headers.includes("dynamic variable1") ||
          !headers.includes("dynamic variable2")
        ) {
          toast.error("CSV format is incorrect.");
          return;
        }

        const formattedData = rows.slice(1).map((row) => ({
          phoneNumber: row[headers.indexOf("phone number")],
          dynamicVariable1: row[headers.indexOf("dynamic variable1")],
          dynamicVariable2: row[headers.indexOf("dynamic variable2")],
        }));

        setSelectedFile(formattedData);
        setCurrentFile(file);
      },
      error: (err) => {
        toast.error("Error parsing CSV file: " + err.message);
      },
      header: false,
    });
  };

  const onSubmit = async (data) => {
    if (!selectedFile) {
      toast.error("CSV file is required.");
      return;
    }

    const payload = {
      from_number: data.fromNumber,
      name: data.batchCallName,
      tasks: selectedFile.map((item) => {
        return {
          to_number: item.phoneNumber,
        };
      }),
      timezone: data.timeZone,
      trigger_timestamp: data.date.getTime(),
    };

    setIsLoading(true);
    const res = await generalPostFunction("/batchcall/store", payload);
    if (res.status) {
      reset();
      setIsLoading(false);
      toast.success("Batch call created successfully!");
    } else {
      setIsLoading(false);
      toast.error("Failed to create batch call!");
    }
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        trigger().then((valid) => valid && onSubmit(watch()));
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full mt-4">
        <div className="h-full flex flex-col md:flex-row items-start justify-between gap-2">
          <div className="rounded-md shadow-md p-4 flex-1 max-w-2xl h-full">
            <div className="w-full h-full flex flex-col gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="batch-call">Batch Call Name</Label>
                <Input
                  id="batch-call"
                  {...register("batchCallName", {
                    required: "Batch call name is required",
                  })}
                />
                {errors.batchCallName && (
                  <span className="text-red-500 text-sm">
                    {errors.batchCallName.message}
                  </span>
                )}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="from-number">From number</Label>
                <Controller
                  name="fromNumber"
                  control={control}
                  rules={{ required: "Please select a number" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <SelectTrigger className="w-full" id="from-number">
                        <SelectValue placeholder="Select a number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select a number</SelectLabel>
                          {availableNumbers.map((number, index) => (
                            <SelectItem key={index} value={number.phone_number}>
                              {number.phone_number_pretty}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.fromNumber && (
                  <span className="text-red-500 text-sm">
                    {errors.fromNumber.message}
                  </span>
                )}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label>Upload Recipients</Label>
                {currentFile ? (
                  <div className="w-full py-2 px-2 flex items-center justify-between rounded-md bg-zinc-800">
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-file-csv text-2xl text-red-400" />
                      <p className="text-sm text-muted-foreground">
                        {currentFile?.name}
                      </p>
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-800 hover:text-red-600"
                      onClick={() => {
                        setSelectedFile(null);
                        setCurrentFile(null);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ) : (
                  <div className="grid w-full items-center gap-1.5 py-4">
                    <Label
                      htmlFor="fileInput"
                      className="group flex flex-col items-center justify-center h-[150px] cursor-pointer border-2 border-dashed rounded-lg"
                    >
                      <CloudUpload />
                      <p>Choose a file or drag & drop it here</p>
                      <p className="text-xs">Only CSV format | Up to 50 MB</p>
                    </Label>
                    <Input
                      id="fileInput"
                      accept=".csv"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
                {!selectedFile && (
                  <span className="text-red-500 text-sm">
                    CSV file is required
                  </span>
                )}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label>When to send the calls</Label>
                <Controller
                  name="timeSchedule"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                      }}
                      className="flex w-full gap-4"
                    >
                      <div className="flex items-center text-xl space-x-2 border rounded-md p-4 w-1/2">
                        <Label htmlFor="r1">Send Now</Label>
                        <RadioGroupItem value="send-now" id="r1" />
                      </div>
                      <div className="flex items-center text-xl space-x-2 border rounded-md p-4 w-1/2">
                        <Label htmlFor="r2">Schedule</Label>
                        <RadioGroupItem value="schedule" id="r2" />
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              {timeSchedule === "schedule" && (
                <div className="grid grid-cols-2 items-center gap-1.5">
                  <div className="flex flex-col">
                    <Controller
                      name="date"
                      control={control}
                      rules={{ required: "Please select a date" }}
                      render={({ field }) => (
                        <DateTimePicker
                          {...field}
                          onChange={field.onChange}
                          minDate={tomorrow}
                        />
                      )}
                    />
                    {errors.date && (
                      <span className="text-red-500 text-sm">
                        {errors.date.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <Controller
                      name="timeZoneValue"
                      control={control}
                      rules={{ required: "Timezone is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          onValueChange={(val) => field.onChange(val)}
                        >
                          <SelectTrigger className="w-full" id="timezone">
                            <SelectValue placeholder="Select a timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Select a timezone</SelectLabel>
                              {timeZone?.map((time, index) => (
                                <SelectItem key={index} value={time.zone}>
                                  {time.zone}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.timeZoneValue && (
                      <span className="text-red-500 text-sm">
                        {errors.timeZoneValue.message}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full cursor-pointer"
                size="lg"
                disabled={!isValid || !selectedFile || isLoading}
              >
                Save
              </Button>
            </div>
          </div>

          {selectedFile && (
            <div className="bg-white dark:bg-zinc-900 rounded-md shadow-md p-4 flex-1 w-full h-full flex">
              <ScrollArea className="w-full h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>phone number</TableHead>
                      <TableHead>dynamic variable1</TableHead>
                      <TableHead>dynamic variable2</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedFile.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index}</TableCell>
                        <TableCell>{item.phoneNumber}</TableCell>
                        <TableCell>{item.dynamicVariable1}</TableCell>
                        <TableCell>{item.dynamicVariable2}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default BatchCalls;
