"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface CombinedInputTabProps {
  onFileLoaded: (url: string, fileType: "fbx" | "gltf") => void;
  onUrlLoaded: (url: string, fileType: "fbx" | "gltf") => void;
  setLoading: (value: boolean) => void;
}

export default function CombinedInputTab({
  onFileLoaded,
  onUrlLoaded,
  setLoading,
}: CombinedInputTabProps) {
  const [inputMethod, setInputMethod] = useState<"upload" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !["fbx", "gltf", "glb"].includes(extension)) {
      alert("Unsupported file type. Please upload FBX, GLTF, or GLB files.");
      setLoading(false);
      return;
    }

    const fileType: "fbx" | "gltf" = extension === "fbx" ? "fbx" : "gltf";
    const objectUrl = URL.createObjectURL(file);
    onFileLoaded(objectUrl, fileType);
    setLoading(false);
  };

  const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const url = formData.get("model-url") as string;
    if (!url) {
      setLoading(false);
      return;
    }

    const extension = url.split(".").pop()?.toLowerCase();
    if (!extension || !["fbx", "gltf", "glb"].includes(extension)) {
      alert(
        "Unsupported file type. Please provide a URL to an FBX, GLTF, or GLB file."
      );
      setLoading(false);
      return;
    }

    const fileType: "fbx" | "gltf" = extension === "fbx" ? "fbx" : "gltf";
    onUrlLoaded(url, fileType);
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md p-6">
      <div className="flex flex-col items-center text-center">
        <div className="flex gap-2 mb-4">
          <Button
            variant={inputMethod === "upload" ? "default" : "outline"}
            onClick={() => setInputMethod("upload")}
          >
            Upload File
          </Button>
          <Button
            variant={inputMethod === "url" ? "default" : "outline"}
            onClick={() => setInputMethod("url")}
          >
            Load URL
          </Button>
        </div>

        {inputMethod === "upload" ? (
          <>
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload your 3D model</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Supported formats: FBX, GLTF, GLB
            </p>
            <input
              id="model-upload"
              type="file"
              ref={fileInputRef}
              accept=".fbx,.gltf,.glb"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              Select File
            </Button>
          </>
        ) : (
          <form className="w-full" onSubmit={handleUrlSubmit}>
            <h3 className="text-lg font-medium mb-4">Load model from URL</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter a URL to a 3D model (FBX, GLTF, GLB)
            </p>
            <div className="grid w-full gap-4">
              <div className="grid gap-2">
                <Label htmlFor="model-url">Model URL</Label>
                <input
                  id="model-url"
                  name="model-url"
                  type="url"
                  placeholder="https://example.com/model.glb"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none"
                />
              </div>
              <Button type="submit">Load Model</Button>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}
