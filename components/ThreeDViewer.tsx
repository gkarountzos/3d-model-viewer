"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "./ThemeToggle";
import ViewerTab from "./ViewerTab";
import InputTab from "./InputTab";
import { OctagonXIcon, Settings2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";

export default function ThreeDViewer() {
  const [modelUrl, setModelUrl] = useState("");
  const [fileType, setFileType] = useState<"fbx" | "gltf" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  const [environment, setEnvironment] = useState<
    "studio" | "sunset" | "dawn" | "night"
  >("studio");
  const [toolsExpanded, setToolsExpanded] = useState(true);

  const onFileLoaded = (url: string, type: "fbx" | "gltf") => {
    setModelUrl(url);
    setFileType(type);
    setActiveTab("view");
  };

  const onUrlLoaded = (url: string, type: "fbx" | "gltf") => {
    setModelUrl(url);
    setFileType(type);
    setActiveTab("view");
  };

  const resetModel = () => {
    if (modelUrl) {
      URL.revokeObjectURL(modelUrl);
    }
    setModelUrl("");
    setFileType("");
    setActiveTab("input");
  };

  const toggleTools = () => {
    setToolsExpanded(!toolsExpanded);
  };

  return (
    <div className="w-full h-screen">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full h-full"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">3D Model Viewer</h2>
          <div className="flex items-center gap-2">
            <TabsList>
              <TabsTrigger value="input" disabled={isLoading}>
                Input
              </TabsTrigger>
              <TabsTrigger value="view" disabled={!modelUrl || isLoading}>
                View
              </TabsTrigger>
            </TabsList>
            <ThemeToggle />
            {modelUrl && (
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={resetModel}
                      >
                        <OctagonXIcon className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset Model</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTools}
                      >
                        <Settings2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{toolsExpanded ? "Hide Tools" : "Show Tools"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>
        <TabsContent
          value="input"
          className="h-full flex items-center justify-center p-6"
        >
          <InputTab
            onFileLoaded={onFileLoaded}
            onUrlLoaded={onUrlLoaded}
            setLoading={setIsLoading}
          />
        </TabsContent>
        <TabsContent value="view" className="h-full">
          <ViewerTab
            modelUrl={modelUrl}
            fileType={fileType as "fbx" | "gltf"}
            environment={environment}
            setEnvironment={setEnvironment}
            isLoading={isLoading}
            toolsExpanded={toolsExpanded}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
