import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { EmployeeRouteId } from "@/navigation/shellNav";

export type ProfileSection = "profile" | "documents" | "privacy" | "support" | "settings";

export interface EmployeeNavigateOptions {
  profileSection?: ProfileSection;
}

interface EmployeeNavState {
  profileSection: ProfileSection | null;
  setProfileSection: (s: ProfileSection | null) => void;
  navigate: (route: EmployeeRouteId, options?: EmployeeNavigateOptions) => void;
}

const Ctx = createContext<EmployeeNavState | null>(null);

export function EmployeeNavProvider({
  children,
  onRouteChange,
}: {
  children: ReactNode;
  onRouteChange: (route: EmployeeRouteId) => void;
}) {
  const [profileSection, setProfileSection] = useState<ProfileSection | null>(null);

  const navigate = useCallback(
    (route: EmployeeRouteId, options?: EmployeeNavigateOptions) => {
      if (options?.profileSection) setProfileSection(options.profileSection);
      onRouteChange(route);
    },
    [onRouteChange],
  );

  const value = useMemo(
    () => ({ profileSection, setProfileSection, navigate }),
    [profileSection, navigate],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEmployeeNav(): EmployeeNavState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEmployeeNav must be used inside EmployeeNavProvider");
  return ctx;
}
