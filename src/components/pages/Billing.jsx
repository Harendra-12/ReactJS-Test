import React, { useState } from "react";
import { Button } from "../ui/button";
import { CalendarIcon, ExternalLink, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { addDays, format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";

const billingHistory = [
  {
    id: 1,
    title: "Invoice #12345",
    amount: "$100.00",
    paymentStatus: "Paid",
    details: "Payment received",
  },
  {
    id: 2,
    title: "Invoice #12346",
    amount: "$200.00",
    paymentStatus: "Pending",
    details: "Payment pending",
  },
];

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 10 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "July", desktop: 201 },
  { month: "August", desktop: 108 },
  { month: "September", desktop: 145 },
  { month: "October", desktop: 106 },
  { month: "November", desktop: 129 },
  { month: "December", desktop: 149 },
];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};

const Billing = () => {
  const [currentTab, setCurrentTab] = useState("billing-history");
  const [date, setDate] = useState({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Billing</h1>
            <p className="text-gray-600">
              You can manage your billing information here.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="cursor-pointer">
              <ExternalLink className="h-4 w-4" />
              Change Payment Methods
            </Button>
            <Button className="cursor-pointer">
              <ExternalLink className="h-4 w-4" />
              Manage Billing Info
            </Button>
          </div>
        </div>

        <div>
          <div>
            <div className="flex gap-5 border-b border-stroke-sub-300">
              <div
                className={`cursor-pointer pb-2 ${
                  currentTab === "billing-history"
                    ? "border-b-3 border-information-base"
                    : ""
                }`}
              >
                <div
                  className="text-center text-sm font-medium leading-tight text-text-strong-950"
                  onClick={() => setCurrentTab("billing-history")}
                >
                  Billing History
                </div>
              </div>
              <div
                className={`cursor-pointer pb-2 ${
                  currentTab === "usage"
                    ? "border-b-3 border-information-base"
                    : ""
                }`}
              >
                <div
                  className="text-center text-sm font-medium leading-tight text-text-sub-600"
                  onClick={() => setCurrentTab("usage")}
                >
                  Usage
                </div>
              </div>
              <div
                className={`cursor-pointer pb-2 ${
                  currentTab === "limits"
                    ? "border-b-3 border-information-base"
                    : ""
                }`}
              >
                <div
                  className="text-center text-sm font-medium leading-tight text-text-sub-600"
                  onClick={() => setCurrentTab("limits")}
                >
                  Limits
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Table content  */}
        {currentTab === "billing-history" && (
          <div>
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Payment Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map((billing) => (
                  <TableRow key={billing.id}>
                    <TableCell>{billing.title}</TableCell>
                    <TableCell>{billing.amount}</TableCell>
                    <TableCell>{billing.details}</TableCell>
                    <TableCell>{billing.paymentStatus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {currentTab === "usage" && (
          <div className="text-center text-sm font-medium leading-tight text-text-sub-600">
            {/* Date picker  */}
            <div className={cn("grid gap-2", "mb-2")}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left font-normal cursor-pointer",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
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
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-full flex gap-4 mb-4">
              <div className="w-1/3 h-[100px] border rounded-2xl flex items-start p-4 flex-col">
                <p className="text-sm text-muted-foreground pb-2">Cost</p>
                <h1 className="text-2xl">$2.00</h1>
              </div>
              <div className="w-1/3 h-[100px] border rounded-2xl flex items-start p-4 flex-col">
                <p className="text-sm text-muted-foreground pb-2">
                  Call Minutes
                </p>
                <h1 className="text-2xl">0 mins</h1>
              </div>
              <div className="w-1/3 h-[100px] border rounded-2xl flex items-start p-4 flex-col">
                <p className="text-sm text-muted-foreground pb-2">
                  Average Cost Per Minute
                </p>
                <h1 className="text-2xl">$0.00</h1>
              </div>
            </div>
            {/* Chart section  */}
            <div className="flex gap-4">
              <Card className="w-1/2">
                <CardHeader>
                  <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar
                        dataKey="desktop"
                        //   fill="var(--color-desktop)"
                        fill="#3b82f680"
                        radius={8}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                {/* <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                  Trending up by 5.2% this month{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Showing total visitors for the last 6 months
                </div>
              </CardFooter> */}
              </Card>
              <Card className="w-1/2">
                <CardHeader>
                  <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar
                        dataKey="desktop"
                        //   fill="var(--color-desktop)"
                        fill="#3b82f680"
                        radius={8}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                {/* <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                  Trending up by 5.2% this month{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Showing total visitors for the last 6 months
                </div>
              </CardFooter> */}
              </Card>
            </div>
          </div>
        )}
        {currentTab === "limits" && (
          <div className=" text-sm font-medium leading-tight text-text-sub-600">
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm text-muted-foreground">
                  Concurrent Calls Limit
                </p>
                <h3 className="font-semibold">20</h3>
              </div>
              <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm text-muted-foreground">LLM Token Limit</p>
                <h3 className="font-semibold">8192</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Billing;
