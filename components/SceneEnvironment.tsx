"use client";

import { Stage, Environment } from "@react-three/drei";

interface SceneEnvironmentProps {
  environment: "studio" | "sunset" | "dawn" | "night";
  children: React.ReactNode;
}

export default function SceneEnvironment({
  environment,
  children,
}: SceneEnvironmentProps) {
  return (
    <>
      {environment === "studio" ? (
        <Stage environment="studio" intensity={0.5} adjustCamera={1.5}>
          {children}
        </Stage>
      ) : (
        <>
          <Environment preset={environment} />
          <ambientLight intensity={environment === "night" ? 0.2 : 0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={
              environment === "sunset" ? 2 : environment === "night" ? 0.1 : 1
            }
            color={
              environment === "sunset"
                ? "#ff7e5f"
                : environment === "dawn"
                ? "#b7c9e2"
                : environment === "night"
                ? "#b4c2d3"
                : "#ffffff"
            }
          />
          {children}
        </>
      )}
    </>
  );
}
