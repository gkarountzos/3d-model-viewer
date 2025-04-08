"use client";

import { useGLTF, useFBX } from "@react-three/drei";

interface ModelProps {
  url: string;
  fileType: "fbx" | "gltf" | "glb";
}

export function Model({ url, fileType }: ModelProps) {
  if (!url) return null;
  return fileType === "fbx" ? <FBXModel url={url} /> : <GLTFModel url={url} />;
}

function GLTFModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function FBXModel({ url }: { url: string }) {
  const fbx = useFBX(url);
  return <primitive object={fbx} />;
}
