import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { breakpoints } from "@/constants/breakpoints";
import { layout } from "@/constants/theme";

export interface ResponsiveState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  /** Persistent sidebar visible */
  showSidebar: boolean;
  /** Overlay drawer for nav */
  useDrawer: boolean;
  contentPadding: number;
  gridColumns: (n: 2 | 3 | 4) => number;
}

export function useResponsive(): ResponsiveState {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isMobile = width < breakpoints.lg;
    const isTablet = width >= breakpoints.md && width < breakpoints.lg;
    const isDesktop = width >= breakpoints.lg;
    const isWide = width >= breakpoints.xl;

    return {
      width,
      height,
      isMobile,
      isTablet,
      isDesktop,
      isWide,
      showSidebar: isDesktop,
      useDrawer: isMobile,
      contentPadding: isMobile ? layout.paddingMobile : isDesktop ? layout.paddingDesktop : 20,
      gridColumns: (n: 2 | 3 | 4) => {
        if (width < breakpoints.sm) return 1;
        if (width < breakpoints.md) return Math.min(2, n);
        if (width < breakpoints.lg) return Math.min(2, n);
        if (width < breakpoints.xl) return Math.min(3, n);
        return n;
      },
    };
  }, [width, height]);
}
