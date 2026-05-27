import { useEffect, useState } from "react";
import { Dimensions, Platform, useWindowDimensions } from "react-native";
import { breakpoints } from "@/constants/breakpoints";

/** Min viewport width to use centered modal instead of bottom drawer. */
export const OVERLAY_DESKTOP_MIN = breakpoints.lg;

function readViewportWidth(): number {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return window.innerWidth;
  }
  return Dimensions.get("window").width;
}

/**
 * Reliable desktop detection for overlay layout (web + resize).
 * useWindowDimensions alone can be wrong inside nested shells on web.
 */
export function useIsDesktopOverlay(minWidth = OVERLAY_DESKTOP_MIN): boolean {
  const { width: hookWidth } = useWindowDimensions();
  const [viewportWidth, setViewportWidth] = useState(readViewportWidth);

  useEffect(() => {
    const onDimensionsChange = ({ window }: { window: { width: number } }) => {
      setViewportWidth(window.width);
    };
    const sub = Dimensions.addEventListener("change", onDimensionsChange);

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
      const sync = () => setViewportWidth(window.innerWidth);
      sync();
      mq.addEventListener("change", sync);
      window.addEventListener("resize", sync);
      return () => {
        sub?.remove();
        mq.removeEventListener("change", sync);
        window.removeEventListener("resize", sync);
      };
    }

    setViewportWidth(readViewportWidth());
    return () => sub?.remove();
  }, [minWidth]);

  const width = Platform.OS === "web" ? viewportWidth : hookWidth;
  return width >= minWidth;
}
