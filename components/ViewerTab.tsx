"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  Loader2,
  Eclipse,
  Settings2,
  Undo2,
  Radius,
  RotateCcw,
  Camera,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Model } from "./ModelLoader";
import SceneEnvironment from "./SceneEnvironment";
import { useCallback, useRef, useState } from "react";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ScreenshotFunction, ScreenshotHandler } from "./ScreenshotHandler";

interface ViewerTabProps {
  modelUrl: string;
  fileType: "fbx" | "gltf";
  environment: "studio" | "sunset" | "dawn" | "night";
  setEnvironment: (env: "studio" | "sunset" | "dawn" | "night") => void;
  isLoading: boolean;
  toolsExpanded: boolean;
}

const ENVIRONMENTS = {
  studio: { name: "Studio" },
  sunset: { name: "Sunset" },
  dawn: { name: "Dawn" },
  night: { name: "Night" },
};

export default function ViewerTab({
  modelUrl,
  fileType,
  environment,
  setEnvironment,
  isLoading,
  toolsExpanded,
}: ViewerTabProps) {
  const [autoRotate, setAutoRotate] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [takeScreenshot, setTakeScreenshot] = useState<(() => void) | null>(
    null
  );

  const handleScreenshotButtonClick = useCallback(
    (screenshotFn: ScreenshotFunction) => {
      setTakeScreenshot(() => screenshotFn);
    },
    []
  );

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!modelUrl) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">
          No model loaded. Please upload a model first.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {toolsExpanded && (
        <Card className="absolute top-16 right-4 z-10 w-64 shadow-lg bg-background/80 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Viewer Settings
            </CardTitle>
            <CardDescription className="text-xs">
              Customize your 3D environment
            </CardDescription>
          </CardHeader>
          <CardContent className="py-2 space-y-4">
            {/* Environment Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <Label
                  htmlFor="environment-select"
                  className="text-sm flex items-center gap-1"
                >
                  <Eclipse className="h-4 w-4 text-primary" />
                  Environment
                </Label>
                <Select
                  value={environment}
                  onValueChange={(value) =>
                    setEnvironment(
                      value as "studio" | "sunset" | "dawn" | "night"
                    )
                  }
                >
                  <SelectTrigger
                    id="environment-select"
                    className="w-28 h-8 text-xs"
                  >
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ENVIRONMENTS).map(([key, { name }]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          <span>{name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Auto-rotate Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="auto-rotate"
                  className="text-sm flex items-center gap-1"
                >
                  <Radius className="h-4 w-4 text-primary" />
                  Auto-rotate
                </Label>
                <Switch
                  id="auto-rotate"
                  checked={autoRotate}
                  onCheckedChange={setAutoRotate}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              {autoRotate && (
                <div className="pl-6">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="rotation-speed"
                      className="text-xs whitespace-nowrap w-12"
                    >
                      Speed:
                    </Label>
                    <Slider
                      id="rotation-speed"
                      min={0.1}
                      max={5}
                      step={0.1}
                      value={[rotationSpeed]}
                      onValueChange={(value) => setRotationSpeed(value[0])}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {rotationSpeed.toFixed(1)}x
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Button */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-1">
                  <RotateCcw className="h-4 w-4 text-primary" />
                  Reset View
                </Label>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (controlsRef.current) {
                      controlsRef.current.reset();
                    }
                  }}
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Screenshot Button */}
            <div>
              <Button
                onClick={() => takeScreenshot && takeScreenshot()}
                className="w-full p-2 border rounded-md"
                disabled={!takeScreenshot}
              >
                <Camera className="h-4 w-4" />
                Capture Screenshot
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex-1">
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
          <SceneEnvironment environment={environment}>
            <Model url={modelUrl} fileType={fileType} />
          </SceneEnvironment>
          <OrbitControls
            ref={controlsRef}
            autoRotate={autoRotate}
            autoRotateSpeed={rotationSpeed * 2}
            enableZoom={true}
            enablePan={true}
            minDistance={0.1}
            maxDistance={999}
          />
          <ScreenshotHandler onButtonClick={handleScreenshotButtonClick} />
        </Canvas>
      </div>
    </div>
  );
}
