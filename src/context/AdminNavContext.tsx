import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { AdminRouteId } from "@/navigation/shellNav";
import type { Employee } from "@/types";
import type { LeaveStatus } from "@/types";

export type PeopleDepartmentFilter = "All" | string;
export type PeopleStatusFilter = "all" | Employee["status"];

export interface AdminNavigateOptions {
  peopleDepartment?: PeopleDepartmentFilter;
  peopleStatus?: PeopleStatusFilter;
  leaveTab?: LeaveStatus | "all";
}

interface AdminNavState {
  peopleDepartment: PeopleDepartmentFilter;
  peopleStatus: PeopleStatusFilter;
  leaveTab: LeaveStatus | "all";
  setPeopleDepartment: (d: PeopleDepartmentFilter) => void;
  setPeopleStatus: (s: PeopleStatusFilter) => void;
  setLeaveTab: (t: LeaveStatus | "all") => void;
  navigate: (route: AdminRouteId, options?: AdminNavigateOptions) => void;
}

const Ctx = createContext<AdminNavState | null>(null);

export function AdminNavProvider({
  children,
  onRouteChange,
}: {
  children: ReactNode;
  onRouteChange: (route: AdminRouteId) => void;
}) {
  const [peopleDepartment, setPeopleDepartment] = useState<PeopleDepartmentFilter>("All");
  const [peopleStatus, setPeopleStatus] = useState<PeopleStatusFilter>("all");
  const [leaveTab, setLeaveTab] = useState<LeaveStatus | "all">("pending");

  const navigate = useCallback(
    (route: AdminRouteId, options?: AdminNavigateOptions) => {
      if (options?.peopleDepartment != null) setPeopleDepartment(options.peopleDepartment);
      if (options?.peopleStatus != null) setPeopleStatus(options.peopleStatus);
      if (options?.leaveTab != null) setLeaveTab(options.leaveTab);
      onRouteChange(route);
    },
    [onRouteChange],
  );

  const value = useMemo(
    () => ({
      peopleDepartment,
      peopleStatus,
      leaveTab,
      setPeopleDepartment,
      setPeopleStatus,
      setLeaveTab,
      navigate,
    }),
    [peopleDepartment, peopleStatus, leaveTab, navigate],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminNav(): AdminNavState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdminNav must be used inside AdminNavProvider");
  return ctx;
}
