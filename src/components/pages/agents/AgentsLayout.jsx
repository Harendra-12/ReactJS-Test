import { Outlet } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function AgentsLayout() {
  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <Separator />
      {/* Main Content Area */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
