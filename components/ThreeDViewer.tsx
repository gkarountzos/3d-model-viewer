"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "./ThemeToggle";
import ViewerTab from "./ViewerTab";
import InputTab from "./InputTab";

export default function ThreeDViewer() {
  const [modelUrl, setModelUrl] = useState("");
  const [fileType, setFileType] = useState<"fbx" | "gltf" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  const [environment, setEnvironment] = useState<
    "studio" | "sunset" | "dawn" | "night"
  >("studio");

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
            {modelUrl && (
              <div className="flex gap-2">
                <button
                  onClick={resetModel}
                  title="Reset"
                  className="p-2 border rounded"
                >
                  Reset
                </button>
              </div>
            )}
            <ThemeToggle />
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
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
