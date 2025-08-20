import * as React from "react";
import {
  AudioWaveform,
  Book,
  BookOpen,
  BookUser,
  Bot,
  BotMessageSquare,
  Box,
  Brackets,
  ChartPie,
  Command,
  Frame,
  GalleryVerticalEnd,
  History,
  Key,
  Link,
  Map,
  MonitorSmartphone,
  Network,
  NotepadText,
  Phone,
  PhoneCall,
  PieChart,
  Pyramid,
  ReceiptText,
  RotateCcwSquare,
  Settings2,
  SquareTerminal,
  Users,
  Waypoints,
  Workflow,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  // user: {
  //   name: "AngexPBX",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  teams: [
    {
      name: "user2@mail.com",
      logo: GalleryVerticalEnd,
      plan: "Free",
    },
    // {
    //   name: "Acme Corp.",
    //   logo: AudioWaveform,
    //   plan: "Startup",
    // },
    // {
    //   name: "Evil Corp.",
    //   logo: Command,
    //   plan: "Free",
    // },
  ],

  // This is main navigation
  navMain: [
    {
      title: "Agents",
      url: "/agents",
      icon: BotMessageSquare,
      isActive: true,
      items: [
        {
          title: "All Agents",
          url: "/list",
          icon: Bot,
        },
        {
          title: "Conversations Flow",
          url: "/conversations-flow",
          icon: Waypoints,
        },
        {
          title: "Knowledge Base",
          url: "/knowledge-base",
          icon: BookUser,
        },
        {
          title: "Phone Numbers",
          url: "/phone-numbers",
          icon: Phone,
        },
        {
          title: "Call History",
          url: "/call-history",
          icon: History,
        },
        {
          title: "Billing",
          url: "/billing",
          icon: ReceiptText,
        },
        // {
        //   title: "Single Prompt",
        //   url: "/agents/single-prompt",
        //   icon: Workflow,
        // },
        // {
        //   title: "Multi Prompt",
        //   url: "/agents/multi-prompt",
        //   icon: Network,
        // },
        // {
        //   title: "Custom LLM",
        //   url: "/agents/custom-llm",
        //   icon: Link,
        // },
      ],
    },
    // {
    //   title: "Models",
    //   url: "/models",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "/models/genesis",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "/models/explorer",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "/models/quantum",
    //     },
    //   ],
    // },
  ],

  projects: [
    {
      name: "All Agents",
      url: "/list",
      icon: Bot,
    },
    // {
    //   name: "Conversations Flow",
    //   url: "/agents/conversations-flow",
    //   icon: Waypoints,
    // },
    {
      name: "Knowledge Base",
      url: "/knowledge-base",
      icon: BookUser,
    },
    // {
    //   name: "Squads",
    //   url: "/agents/squads",
    //   icon: Users,
    // },
    // {
    //   name: "Phone Numbers",
    //   url: "/agents/phone-numbers",
    //   icon: Phone,
    // },
    {
      name: "Number",
      url: "/number",
      icon: PhoneCall,
    },
    {
      name: "Batch Calls",
      url: "/batch-calls",
      icon: MonitorSmartphone,
    },
    {
      name: "Call History",
      url: "/call-history",
      icon: History,
    },
    // {
    //   name: "Billing",
    //   url: "/agents/billing",
    //   icon: ReceiptText,
    // },
    // {
    //   name: "Provider Keys",
    //   url: "/agents/keys",
    //   icon: Key,
    // },
    // {
    //   title: "Single Prompt",
    //   url: "/agents/single-prompt",
    //   icon: Workflow,
    // },
    // {
    //   title: "Multi Prompt",
    //   url: "/agents/multi-prompt",
    //   icon: Network,
    // },
    // {
    //   title: "Custom LLM",
    //   url: "/agents/custom-llm",
    //   icon: Link,
    // },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <SidebarTrigger className="-ml-1" /> */}
      {/* <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader> */}
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
