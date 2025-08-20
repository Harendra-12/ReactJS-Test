"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  Info,
  LogOut,
  Plus,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const currentUserData = useSelector((state) => state.app.userData);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={currentUserData?.avatar}
                    alt={currentUserData?.full_name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {currentUserData?.full_name
                      ?.split("")
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {currentUserData?.username}
                  </span>
                  <span className="truncate text-xs">
                    {currentUserData?.email}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={currentUserData?.avatar}
                      alt={currentUserData?.full_name}
                    />
                    <AvatarFallback className="rounded-lg">
                      {currentUserData?.full_name
                        ?.split("")
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {currentUserData?.full_name}
                    </span>
                    <span className="truncate text-xs">
                      {currentUserData?.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem className="gap-2 p-2">
                <Link to="/members" className="flex gap-2">
                  <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                    <Plus className="size-4" />
                  </div>
                  <div className="text-muted-foreground font-medium">
                    Add new member
                  </div>
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuItem asChild>
                <DialogTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="flex items-center gap-2 w-full text-left text-md cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </DialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent
            className={"sm:max-w-[400px] w-full"}
            onClick={(e) => e.stopPropagation()}
          >
            <DialogTitle className="text-lg font-semibold mb-4">
              Log out
            </DialogTitle>
            <DialogDescription className="text-sm">
              <Info className="inline mr-2 text-red-800 h-6 w-6" />
              Are you sure you want to log out?
            </DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                className="cursor-pointer"
                type="submit"
                onClick={(e) => {
                  e.stopPropagation();
                  localStorage.removeItem("token");
                  window.location.reload();
                  navigate("/sign-in");
                }}
              >
                Log out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
