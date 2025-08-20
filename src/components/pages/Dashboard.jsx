import React, { useState } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { Separator } from "../ui/separator";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useDispatch } from "react-redux";
import { generalGetFunction } from "@/globalFunctions/globalFunction";

const Dashboard = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Get the current page title from the last segment of the URL
  const currentPage = pathSegments[pathSegments.length - 1]
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Get the section (if any) from the path segments
  const section = pathSegments.length > 1 ? pathSegments[0] : null;
  const sectionTitle = section
    ? section.charAt(0).toUpperCase() + section.slice(1)
    : null;

  const [allWorkspaces, setAllWorkspaces] = useState([]);

  const allWorkspacea = async () => {
    const apiData = await generalGetFunction("/workspaces");

    if (apiData.status) {
      setAllWorkspaces(apiData.data[0]);
      dispatch({
        type: "SET_ALL_WORKSPACES",
        payload: apiData.data[0],
      });
    } else {
      navigate("/sign-up");
      console.error("Failed to fetch workspaces");
    }
  };
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 w-full">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {section && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink>
                          <Link to={`/${section}`}>{section}</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  )}
                  {currentPage && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{currentPage}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default Dashboard;
