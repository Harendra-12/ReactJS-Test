import React from "react";
import { Button } from "../ui/button";
import { Plus, SquareUser, Trash2, Workflow } from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
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
import SquadFlow from "../custom/SquadFlow/SquadFlow";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";

const Squads = () => {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full">
        <div>
          <h1 className="text-2xl font-bold">Squads</h1>
          <p className="text-gray-600">You can manage your Squads here.</p>
        </div>
        <div className="h-full flex flex-col md:flex-row items-center justify-between gap-2">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20}>
              {/* Squades list */}
              <div className="bg-white dark:bg-neutral-900 rounded-md shadow-md p-4 flex-1 h-full">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="font-bold text-2xl">Available Squads</h1>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="cursor-pointer">
                        New
                        <Plus />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>
                          <div className="flex flex-col items-center gap-2">
                            <SquareUser className="w-10 h-10" />
                            <h1 className="font-bold">Build your Squad</h1>
                            <p className="text-xs text-muted-foreground">
                              Enter the details for the new squad member.
                            </p>
                          </div>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-6">
                        <Label htmlFor="member" className={"mb-3"}>
                          Add Your First Member
                        </Label>
                        <Select>
                          <SelectTrigger
                            className="w-full cursor-pointer"
                            id="member"
                          >
                            <SelectValue placeholder="Add Member" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="text-assistant-1"
                              className={"cursor-pointer"}
                            >
                              Test assistant 1
                            </SelectItem>
                            <SelectItem
                              value="text-assistant-2"
                              className={"cursor-pointer"}
                            >
                              Test assistant 2
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            variant={"outline"}
                            className={"cursor-pointer"}
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button className={"cursor-pointer"} disabled>
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <Separator className="my-2 bg-zinc-500" />
                <div className="flex flex-col justify-center gap-2">
                  <div className="flex items-center justify-between p-2 border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Workflow className="w-5 h-5 text-muted-foreground" />
                      Calling squad
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center gap-2">
                      <Badge>2</Badge>
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        className={
                          "text-red-900 hover:text-red-600 cursor-pointer"
                        }
                      >
                        <Trash2 />
                      </Button>
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Workflow className="w-5 h-5 text-muted-foreground" />
                      Social media squad
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center gap-2">
                      <Badge>1</Badge>
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        className={
                          "text-red-900 hover:text-red-600 cursor-pointer"
                        }
                      >
                        <Trash2 />
                      </Button>
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Workflow className="w-5 h-5 text-muted-foreground" />
                      Hr team
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center gap-2">
                      <Badge>5</Badge>
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        className={
                          "text-red-900 hover:text-red-600 cursor-pointer"
                        }
                      >
                        <Trash2 />
                      </Button>
                    </span>
                  </div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80}>
              {/* Squads edit panel */}
              <div className="bg-white dark:bg-neutral-900 rounded-md shadow-md p-4 flex-1 w-full h-full">
                <SquadFlow />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </>
  );
};

export default Squads;
