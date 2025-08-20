import React from "react";
import { Card, CardTitle } from "../ui/card";
import { IdCard, Mail, MailSearch, User, UserPlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
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

const Members = () => {
  return (
    <>
      <Dialog>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Members</h1>
              <p className="text-gray-600">
                You can manage your team members here.
              </p>
            </div>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="cursor-pointer !bg-green-900 hover:!bg-green-700"
              >
                <UserPlus className="w-5 h-5 font-bold" />
              </Button>
            </DialogTrigger>
          </div>
          <div className="flex justify-center items-center">
            <Card className="w-full md:w-2/3 p-3">
              <Table className="">
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex text-muted-foreground items-center">
                        <Mail className="mr-2" />
                        Email
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex text-muted-foreground items-center">
                        <User className="mr-2" /> Name
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex text-muted-foreground items-center">
                        <IdCard className="mr-2" /> ID{" "}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>user1@gmail.com</TableCell>
                    <TableCell>First User</TableCell>
                    <TableCell>Admin</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>user2@gmail.com</TableCell>
                    <TableCell>Second User</TableCell>
                    <TableCell>User</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Dialog content  */}
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <div className="flex flex-col text-center items-center justify-center">
                <MailSearch className="w-15 h-15 text-muted-foreground" />
                <h1 className="text-2xl font-bold mt-2">Invite New Members</h1>
                <p className="text-gray-600 text-sm pt-2">
                  Add people to your organization and collaborate with them.
                </p>
              </div>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value="Pedro Duarte"
                  className="mt-2"
                />
              </div>
              <div className="">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value="user@mail.com"
                  className="mt-2"
                />
              </div>
              <div className="">
                <Label htmlFor="role" className="text-right mb-2">
                  Role
                </Label>
                <Select>
                  <SelectTrigger className="w-full" id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>User role</SelectLabel>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="cursor-pointer !bg-green-800 hover:!bg-green-700 w-full md:w-2/3 text-white"
                disabled
              >
                Invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default Members;
