import { AudioLines, SquareArrowUpRight } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Link } from "react-router-dom";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const ProviderKeys = () => {
  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Provider Keys</h1>
            <p className="text-gray-600">
              You can manage your keys provider here.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center w-full">
          <div className="flex gap-2 items-center w-2/4 justify-between">
            {/* First category  */}
            <div className="w-full">
              <div className="flex items-center mb-3">
                <AudioLines />
                <p className="ms-2 text-xl font-bold">Voice Providers</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="w-full">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        PlayHT
                        <Link to="https://play.ht/" target="_blank">
                          <SquareArrowUpRight className="hover:text-blue-600 text-muted-foreground" />
                        </Link>
                      </CardTitle>
                      <CardDescription>
                        For using custom voices from PlayHT.
                      </CardDescription>
                    </CardHeader>
                    <Separator />
                    <CardContent>
                      <div className="grid w-full max-w-sm items-center gap-1.5 mb-4">
                        <Label htmlFor="api-key">API Key</Label>
                        <Input
                          type="text"
                          id="api-key"
                          placeholder="Enter your API key"
                        />
                      </div>
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="user-id">User Id</Label>
                        <Input
                          type="text"
                          id="user-id"
                          placeholder="Enter your user id"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full cursor-pointer" disabled>
                        Save
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                <div className="w-full">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        PlayHT
                        <Link to="https://play.ht/" target="_blank">
                          <SquareArrowUpRight className="hover:text-blue-600 text-muted-foreground" />
                        </Link>
                      </CardTitle>
                      <CardDescription>
                        For using custom voices from PlayHT.
                      </CardDescription>
                    </CardHeader>
                    <Separator />
                    <CardContent>
                      <div className="grid w-full max-w-sm items-center gap-1.5 mb-4">
                        <Label htmlFor="api-key">API Key</Label>
                        <Input
                          type="text"
                          id="api-key"
                          placeholder="Enter your API key"
                        />
                      </div>
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="user-id">User Id</Label>
                        <Input
                          type="text"
                          id="user-id"
                          placeholder="Enter your user id"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full cursor-pointer" disabled>
                        Save
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                <div className="w-full">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        PlayHT
                        <Link to="https://play.ht/" target="_blank">
                          <SquareArrowUpRight className="hover:text-blue-600 text-muted-foreground" />
                        </Link>
                      </CardTitle>
                      <CardDescription>
                        For using custom voices from PlayHT.
                      </CardDescription>
                    </CardHeader>
                    <Separator />
                    <CardContent>
                      <div className="grid w-full max-w-sm items-center gap-1.5 mb-4">
                        <Label htmlFor="api-key">API Key</Label>
                        <Input
                          type="text"
                          id="api-key"
                          placeholder="Enter your API key"
                        />
                      </div>
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="user-id">User Id</Label>
                        <Input
                          type="text"
                          id="user-id"
                          placeholder="Enter your user id"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full cursor-pointer" disabled>
                        Save
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderKeys;
