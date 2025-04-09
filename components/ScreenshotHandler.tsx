import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export type ScreenshotFunction = () => void;

export function ScreenshotHandler({
  onButtonClick,
}: {
  onButtonClick: (fn: ScreenshotFunction) => void;
}) {
  const { scene, camera, gl } = useThree();

  useEffect(() => {
    const takeScreenshot = () => {
      // render the scene
      gl.render(scene, camera);

      // capture as blob
      gl.domElement.toBlob((blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "screenshot.png";
        link.href = url;
        link.click();

        // clean up
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }, "image/png");
    };

    // pass the function to the parent once
    onButtonClick(takeScreenshot);
  }, [scene, camera, gl, onButtonClick]);

  return null;
}
