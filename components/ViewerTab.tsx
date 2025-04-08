"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Loader2, Eclipse } from "lucide-react";
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

interface ViewerTabProps {
  modelUrl: string;
  fileType: "fbx" | "gltf";
  environment: "studio" | "sunset" | "dawn" | "night";
  setEnvironment: (env: "studio" | "sunset" | "dawn" | "night") => void;
  isLoading: boolean;
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
}: ViewerTabProps) {
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
      <div className="p-2 flex justify-end items-center gap-2">
        <Eclipse className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="environment-select" className="text-sm">
          Scene:
        </Label>
        <Select
          value={environment}
          onValueChange={(value) =>
            setEnvironment(value as "studio" | "sunset" | "dawn" | "night")
          }
        >
          <SelectTrigger id="environment-select" className="w-[180px]">
            <SelectValue placeholder="Select environment" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ENVIRONMENTS).map(([key, { name }]) => (
              <SelectItem key={key} value={key}>
                <span>{name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
          <SceneEnvironment environment={environment}>
            <Model url={modelUrl} fileType={fileType} />
          </SceneEnvironment>
          <OrbitControls
            autoRotate={false}
            enableZoom={true}
            enablePan={true}
            minDistance={0.1}
            maxDistance={999}
          />
        </Canvas>
      </div>
    </div>
  );
}
