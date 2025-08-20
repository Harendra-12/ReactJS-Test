import React from "react";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { PencilLine, Play, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const Simulations = () => {
  const testingData = [
    {
      id: 1,
      testCase: "Test 1",
      userPrompt: "This is user prompt",
      successCriteria: "No metrics defined",
      editedBy: "04/23/2024, 13:11",
    },
    {
      id: 2,
      testCase: "Test 2",
      userPrompt: "This is user prompt",
      successCriteria: "No metrics defined",
      editedBy: "04/23/2024, 13:11",
    },
  ];

  return (
    <>
      <div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xl">Simulation Testing</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className={"cursor-pointer"}>
                <Plus />
                Test Case
              </Button>
            </DialogTrigger>
            <DialogContent className={"min-w-[800px]"}>
              <DialogTitle>Add a test case</DialogTitle>
              <TestCaseForm />
            </DialogContent>
          </Dialog>
        </div>
        <Separator className={"my-4"} />
        <div>
          <Tabs defaultValue="test-cases" className="w-full">
            <TabsList className="grid w-[400px] grid-cols-2 bg-zinc-700">
              <TabsTrigger value="test-cases" className={"cursor-pointer"}>
                Test Cases
              </TabsTrigger>
              <TabsTrigger value="batch-testing" className={"cursor-pointer"}>
                Batch Testing History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="test-cases">
              <div>
                <Table>
                  <TableHeader>
                    <TableRow className={"bg-muted/50"}>
                      <TableHead className="">Test Case</TableHead>
                      <TableHead>User Prompt</TableHead>
                      <TableHead>Success Criteria</TableHead>
                      <TableHead className="">Edited by</TableHead>
                      <TableHead className=""></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testingData.map((data) => (
                      <TableRow key={data.id}>
                        <TableCell className="font-medium">
                          {data.testCase}
                        </TableCell>
                        <TableCell>{data.userPrompt}</TableCell>
                        <TableCell>{data.successCriteria}</TableCell>
                        <TableCell className="">{data.editedBy}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={"cursor-pointer"}
                                >
                                  <PencilLine />
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className={"min-w-[800px]"}>
                                <DialogTitle>Add a test case</DialogTitle>
                                <TestCaseForm />
                              </DialogContent>
                            </Dialog>

                            <Button
                              variant={"outline"}
                              className={"cursor-pointer"}
                            >
                              <Play />
                              Play
                            </Button>
                            <Button
                              variant={"outline"}
                              className={
                                "cursor-pointer text-red-900 hover:text-red-600"
                              }
                            >
                              <Trash2 />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="batch-testing">
              <p>No testing history</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Simulations;

// test cases form for add and edit
const TestCaseForm = () => {
  return (
    <>
      <div className="w-full">
        <div className="grid w-ful items-center gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input type="text" id="name" placeholder="Enter a name" />
        </div>
        <div className="grid w-ful items-center gap-1.5 mt-4">
          <Label htmlFor="user-prompt">User Prompt</Label>
          <p className="text-sm text-muted-foreground">
            Define how user will interact with the agent
          </p>
          <Textarea
            type="text"
            id="user-prompt"
            className={"min-h-[100px]"}
            placeholder="Enter user input"
          />
        </div>
        <div className="grid w-ful items-center gap-1.5 mt-4">
          <Label htmlFor="success-criteria">Success Criteria</Label>
          <p className="text-sm text-muted-foreground">
            Define the success criteria for the test case
          </p>
          <Textarea
            type="text"
            id="success-criteria"
            className={"min-h-[100px]"}
            placeholder="Enter success criteria"
          />
        </div>
        <div className="grid w-full items-center gap-1.5 mt-4">
          <Label>Test Variables & Mocks</Label>
          <Card className={"px-3"}>
            <Tabs defaultValue="dynamic-variable" className="w-full">
              <TabsList className="grid w-[400px] grid-cols-2 bg-transparent">
                <TabsTrigger
                  value="dynamic-variable"
                  className={"!bg-transparent border-0 cursor-pointer"}
                >
                  Dynamic Variables
                </TabsTrigger>
                <TabsTrigger
                  value="custom-functions"
                  className={"!bg-transparent border-0 cursor-pointer"}
                >
                  Custom Functions Mocks
                </TabsTrigger>
              </TabsList>
              <Separator className={"my-2"} />
              <TabsContent value="dynamic-variable">
                <div>
                  <Table>
                    <TableHeader className={"bg-muted/50"}>
                      <TableRow>
                        <TableHead>Variable Name</TableHead>
                        <TableHead>Test Value</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className={"hover:bg-transparent"}>
                        <TableCell>
                          <div>
                            <Input />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Input />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Button
                              variant="outline"
                              size="icon"
                              className={
                                "cursor-pointer text-red-900 hover:text-red-600"
                              }
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className={"hover:bg-transparent"}>
                        <TableCell>
                          <div>
                            <Input />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Input />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Button
                              variant="outline"
                              size="icon"
                              className={
                                "cursor-pointer text-red-900 hover:text-red-600"
                              }
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Button className={"mt-4 cursor-pointer"} variant={"outline"}>
                    <Plus /> Add
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="custom-functions">
                <Card>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="h-7 px-2 py-4 bg-white text-black flex items-center justify-center rounded-md">
                        Function
                      </div>
                      <Select>
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select a function" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Function</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Button
                        className={
                          "cursor-pointer text-red-900 hover:text-red-600"
                        }
                        variant={"outline"}
                        size={"icon"}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                    <Textarea className={"h-[150px] w-full"} />
                  </CardContent>
                </Card>
                <Button className={"mt-4 cursor-pointer"} variant={"outline"}>
                  <Plus /> Add
                </Button>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
      <DialogFooter>
        <DialogClose>
          <Button variant={"outline"} className={"cursor-pointer"}>
            Cancel
          </Button>
          <Button className={"cursor-pointer ms-4"}>Save changes</Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
};
