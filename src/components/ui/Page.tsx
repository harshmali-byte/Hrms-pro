import { ReactNode } from "react";
import { Text, View } from "react-native";
import { font } from "@/constants/fonts";
import { useResponsive } from "@/hooks/useResponsive";
import { BodyMuted, H1 } from "./Typography";

interface PageProps {
  children: ReactNode;
  className?: string;
}

/** Top-level page wrapper inside AppShell scroll area */
export function Page({ children, className = "" }: PageProps) {
  const { isWide } = useResponsive();
  return (
    <View className={`w-full ${isWide ? "max-w-content self-center" : ""} ${className}`}>
      {children}
    </View>
  );
}

interface PageHeaderProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className = "" }: PageHeaderProps) {
  const { isMobile } = useResponsive();
  return (
    <View
      className={`mb-6 ${isMobile ? "" : "flex-row items-start justify-between"} ${className}`}
    >
      <View className={`flex-1 ${isMobile && actions ? "mb-4" : ""}`}>
        {title ? <H1>{title}</H1> : null}
        {description ? <BodyMuted className="mt-1">{description}</BodyMuted> : null}
      </View>
      {actions ? <View className={isMobile ? "w-full" : "ml-4"}>{actions}</View> : null}
    </View>
  );
}

interface ContentGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  gap?: number;
  className?: string;
}

/** Responsive grid: 1 → 2 → n columns by breakpoint */
export function ContentGrid({
  children,
  columns = 2,
  gap = 4,
  className = "",
}: ContentGridProps) {
  const { gridColumns, isMobile } = useResponsive();
  const cols = gridColumns(columns);
  const childArray = Array.isArray(children) ? children : [children];

  const gapClass = gap === 6 ? "gap-6" : gap === 4 ? "gap-4" : "gap-3";

  if (isMobile && cols === 1) {
    return (
      <View className={`${gapClass} ${className}`}>
        {childArray.map((child, i) => (
          <View key={i} className="w-full">
            {child}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View className={`flex-row flex-wrap ${gapClass} ${className}`}>
      {childArray.map((child, i) => {
        const basis =
          cols === 4 ? "23%" : cols === 3 ? "31%" : cols === 2 ? "48%" : "100%";
        return (
          <View key={i} style={{ width: basis, minWidth: cols === 1 ? "100%" : 240 }}>
            {child}
          </View>
        );
      })}
    </View>
  );
}

interface StackProps {
  children: ReactNode;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const stackGap = { sm: "gap-2", md: "gap-4", lg: "gap-6" };

export function Stack({ children, gap = "md", className = "" }: StackProps) {
  return <View className={`${stackGap[gap]} ${className}`}>{children}</View>;
}

export function PageSectionTitle({ children }: { children: string }) {
  return (
    <Text
      style={{ fontFamily: font.semibold }}
      className="mb-3 text-xs uppercase tracking-wide text-textSubtle"
    >
      {children}
    </Text>
  );
}
