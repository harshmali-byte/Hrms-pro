import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addEmployee as apiAddEmployee,
  advancePayrollStep,
  clockInApi,
  clockOutApi,
  computeDashboardStats,
  deleteEmployee as apiDeleteEmployee,
  fetchAttendanceHistory,
  fetchBootstrap,
  fetchDashboardCharts,
  fetchDashboardStats,
  fetchDashboardWidgets,
  fetchDepartments,
  fetchPayrollSummary,
  getPayslipsFromApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
  publishPayrollPayslips,
  resetAllData,
  saveAttendance,
  submitLeaveRequest,
  updateEmployee as apiUpdateEmployee,
  updateLeaveStatus,
  type DashboardStats,
  type DemoPersist,
  type PayrollPersist,
} from "@/api/hrmsApi";
import { useAuth } from "@/context/AuthContext";
import { formatPostedDate, todayKey } from "@/utils/dates";
import {
  formatDurationHuman,
  msToHoursOneDecimal,
  totalWorkedMs,
  type AttendanceSegment,
} from "@/utils/attendance";
import type {
  Announcement,
  AttendanceRecord,
  DashboardCharts,
  DepartmentStat,
  Employee,
  Holiday,
  HrmsNotification,
  LeaveBalance,
  LeaveRequest,
  LeaveStatus,
  LeaveType,
  PayrollSummary,
  Payslip,
} from "@/types";
import type { DashboardWidget } from "@/types/dashboard";

export interface HrmsDataContextValue {
  isReady: boolean;
  apiError: string | null;
  currentEmployeeId: string | null;
  currentEmployee: Employee | null;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  attendanceDateKey: string;
  segments: AttendanceSegment[];
  clockIn: () => Promise<void>;
  clockOut: () => Promise<void>;
  isCheckedIn: boolean;
  workedTodayLabel: string;
  lastEventHint: string | null;

  employees: Employee[];
  addEmployee: (input: {
    name: string;
    email: string;
    role: string;
    department: string;
  }) => Promise<boolean>;
  updateEmployee: (
    id: string,
    input: Partial<
      Pick<Employee, "name" | "email" | "phone" | "role" | "department" | "status" | "location" | "reportsTo">
    >,
  ) => Promise<boolean>;
  deleteEmployee: (id: string) => Promise<boolean>;

  leaveRequests: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  myLeaveRequestsList: LeaveRequest[];
  pendingLeaveCount: number;
  addLeaveRequest: (input: {
    type: LeaveType;
    from: string;
    to: string;
    days: number;
    reason: string;
  }) => Promise<void>;
  setLeaveRequestStatus: (id: string, status: LeaveStatus) => Promise<void>;

  notifications: HrmsNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  payslips: Payslip[];
  payroll: PayrollPersist;
  advancePayrollRun: () => Promise<PayrollPersist | null>;
  publishPayslips: () => Promise<number>;

  dashboardStats: DashboardStats;
  dashboardCharts: DashboardCharts | null;
  dashboardWidgets: DashboardWidget[];
  refreshDashboardWidgets: () => Promise<void>;
  announcements: Announcement[];
  holidays: Holiday[];
  attendanceHistory: AttendanceRecord[];
  departments: DepartmentStat[];
  payrollSummary: PayrollSummary | null;
  reload: () => Promise<void>;
  resetDemoData: () => Promise<void>;
}

const Ctx = createContext<HrmsDataContextValue | null>(null);

export function HrmsDataProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const [demo, setDemo] = useState<DemoPersist | null>(null);
  const [payroll, setPayroll] = useState<PayrollPersist | null>(null);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [attendanceDay, setAttendanceDay] = useState({
    dateKey: todayKey(),
    segments: [] as AttendanceSegment[],
  });
  const [dashboardStatsRemote, setDashboardStatsRemote] = useState<DashboardStats | null>(
    null,
  );
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string | null>(null);
  const [dashboardCharts, setDashboardCharts] = useState<DashboardCharts | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [departments, setDepartments] = useState<DepartmentStat[]>([]);
  const [payrollSummary, setPayrollSummary] = useState<PayrollSummary | null>(null);
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([]);

  const refreshDashboardWidgets = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetchDashboardWidgets();
      setDashboardWidgets(res.widgets ?? []);
    } catch {
      /* keep previous widgets */
    }
  }, [token]);

  const loadAll = useCallback(async () => {
    if (!token) {
      setDemo(null);
      setPayroll(null);
      setPayslips([]);
      setAttendanceDay({ dateKey: todayKey(), segments: [] });
      setCurrentEmployeeId(null);
      setDashboardCharts(null);
      setAnnouncements([]);
      setHolidays([]);
      setAttendanceHistory([]);
      setDepartments([]);
      setPayrollSummary(null);
      setDashboardWidgets([]);
      setIsReady(true);
      setApiError(null);
      return;
    }

    setIsReady(false);
    setApiError(null);
    const isAdmin = user?.role === "admin";
    try {
      const [state, stats, charts, widgetsRes, history, depts, summary, slips] = await Promise.all([
        fetchBootstrap(),
        fetchDashboardStats().catch(() => null),
        isAdmin ? fetchDashboardCharts().catch(() => null) : Promise.resolve(null),
        fetchDashboardWidgets().catch(() => ({ widgets: [] })),
        user?.employeeId
          ? fetchAttendanceHistory(14).catch(() => [] as AttendanceRecord[])
          : Promise.resolve([] as AttendanceRecord[]),
        isAdmin ? fetchDepartments().catch(() => [] as DepartmentStat[]) : Promise.resolve([]),
        isAdmin ? fetchPayrollSummary().catch(() => null) : Promise.resolve(null),
        getPayslipsFromApi().catch(() => [] as Payslip[]),
      ]);
      setDemo({
        employees: state.employees,
        leaveRequests: state.leaveRequests,
        leaveBalances: state.leaveBalances,
        notifications: state.notifications,
      });
      setPayroll(state.payroll);
      setAttendanceDay(state.attendance);
      setCurrentEmployeeId(state.currentEmployeeId);
      setPayslips(slips.length ? slips : state.payslips);
      setAnnouncements(state.announcements ?? []);
      setHolidays(state.holidays ?? []);
      setAttendanceHistory(history);
      setDashboardCharts(charts);
      setDashboardWidgets(widgetsRes.widgets ?? []);
      setDepartments(depts);
      setPayrollSummary(summary);
      if (stats) setDashboardStatsRemote(stats);
    } catch (e) {
      setApiError(e instanceof Error ? e.message : "Could not reach API server");
    } finally {
      setIsReady(true);
    }
  }, [token, user?.role, user?.employeeId]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (!token || !isReady) return;
    const t = setInterval(() => {
      const k = todayKey();
      setAttendanceDay((d) => (d.dateKey === k ? d : { dateKey: k, segments: [] }));
    }, 60_000);
    return () => clearInterval(t);
  }, [token, isReady]);

  useEffect(() => {
    if (!token || !isReady) return;
    void saveAttendance(attendanceDay);
  }, [token, isReady, attendanceDay]);

  const segments = attendanceDay.segments;
  const attendanceDateKey = attendanceDay.dateKey;

  const refreshAttendanceHistory = useCallback(async () => {
    if (!user?.employeeId) return;
    try {
      const history = await fetchAttendanceHistory(14);
      setAttendanceHistory(history);
    } catch {
      /* keep existing history */
    }
  }, [user?.employeeId]);

  const clockIn = useCallback(async () => {
    const next = await clockInApi();
    setAttendanceDay(next);
    void refreshAttendanceHistory();
    void refreshDashboardWidgets();
  }, [refreshAttendanceHistory, refreshDashboardWidgets]);

  const clockOut = useCallback(async () => {
    const next = await clockOutApi();
    setAttendanceDay(next);
    void refreshAttendanceHistory();
    void refreshDashboardWidgets();
  }, [refreshAttendanceHistory, refreshDashboardWidgets]);

  const isCheckedIn =
    segments.length > 0 && segments[segments.length - 1].out === null;

  const workedTodayLabel = formatDurationHuman(totalWorkedMs(segments, Date.now()));

  const lastEventHint = useMemo(() => {
    if (segments.length === 0) return null;
    const last = segments[segments.length - 1];
    if (last.out === null) {
      return `In progress since ${new Date(last.in).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}`;
    }
    return `${segments.length} session(s) today`;
  }, [segments]);

  const leaveRequests = demo?.leaveRequests ?? [];
  const leaveBalances = demo?.leaveBalances ?? [];
  const notifications = demo?.notifications ?? [];
  const employees = demo?.employees ?? [];

  const employeeId = currentEmployeeId ?? user?.employeeId ?? null;

  const currentEmployee = useMemo(
    () => employees.find((e) => e.id === employeeId) ?? null,
    [employees, employeeId],
  );

  const myLeaveRequestsList = useMemo(() => {
    if (!employeeId) return [];
    const mine = leaveRequests.filter((r) => r.employeeId === employeeId);
    return [...mine].sort((a, b) => b.id.localeCompare(a.id));
  }, [leaveRequests, employeeId]);

  const pendingLeaveCount = useMemo(
    () => leaveRequests.filter((r) => r.status === "pending").length,
    [leaveRequests],
  );

  const dashboardStats = useMemo(
    () =>
      dashboardStatsRemote ?? computeDashboardStats(employees, leaveRequests),
    [dashboardStatsRemote, employees, leaveRequests],
  );

  const addLeaveRequest = useCallback(
    async (input: {
      type: LeaveType;
      from: string;
      to: string;
      days: number;
      reason: string;
    }) => {
      await submitLeaveRequest(input);
      await loadAll();
    },
    [loadAll],
  );

  const setLeaveRequestStatus = useCallback(
    async (id: string, status: LeaveStatus) => {
      const result = await updateLeaveStatus(id, status);
      setDemo((d) =>
        d
          ? {
              ...d,
              leaveRequests: d.leaveRequests.map((r) =>
                r.id === id ? result.request : r,
              ),
              leaveBalances:
                result.leaveBalances.length > 0 ? result.leaveBalances : d.leaveBalances,
            }
          : d,
      );
      await loadAll();
    },
    [loadAll],
  );

  const addEmployee = useCallback(
    async (input: { name: string; email: string; role: string; department: string }) => {
      if (!input.name.trim() || !input.email.trim()) return false;
      const employee = await apiAddEmployee(input);
      setDemo((d) =>
        d ? { ...d, employees: [employee, ...d.employees] } : d,
      );
      await loadAll();
      return true;
    },
    [loadAll],
  );

  const updateEmployee = useCallback(
    async (
      id: string,
      input: Partial<
        Pick<Employee, "name" | "email" | "phone" | "role" | "department" | "status" | "location" | "reportsTo">
      >,
    ) => {
      const employee = await apiUpdateEmployee(id, input);
      setDemo((d) =>
        d
          ? {
              ...d,
              employees: d.employees.map((e) => (e.id === id ? employee : e)),
            }
          : d,
      );
      await loadAll();
      return true;
    },
    [loadAll],
  );

  const deleteEmployee = useCallback(
    async (id: string) => {
      await apiDeleteEmployee(id);
      setDemo((d) =>
        d
          ? {
              ...d,
              employees: d.employees.filter((e) => e.id !== id),
              leaveRequests: d.leaveRequests.filter((r) => r.employeeId !== id),
            }
          : d,
      );
      await loadAll();
      return true;
    },
    [loadAll],
  );

  const advancePayrollRun = useCallback(async () => {
    const next = await advancePayrollStep();
    setPayroll(next);
    await loadAll();
    return next;
  }, [loadAll]);

  const publishPayslips = useCallback(async () => {
    const result = await publishPayrollPayslips();
    await loadAll();
    return result.published;
  }, [loadAll]);

  const markNotificationRead = useCallback(
    (id: string) => {
      setDemo((d) =>
        d
          ? {
              ...d,
              notifications: d.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n,
              ),
            }
          : d,
      );
      void markNotificationReadApi(id);
    },
    [],
  );

  const markAllNotificationsRead = useCallback(() => {
    setDemo((d) =>
      d
        ? {
            ...d,
            notifications: d.notifications.map((n) => ({ ...n, read: true })),
          }
        : d,
    );
    void markAllNotificationsReadApi();
  }, []);

  const resetDemoData = useCallback(async () => {
    await resetAllData();
    await loadAll();
  }, [loadAll]);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const value = useMemo<HrmsDataContextValue>(
    () => ({
      isReady,
      apiError,
      currentEmployeeId: employeeId,
      currentEmployee,
      globalSearch,
      setGlobalSearch,
      attendanceDateKey,
      segments,
      clockIn,
      clockOut,
      isCheckedIn,
      workedTodayLabel,
      lastEventHint,
      employees,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      leaveRequests,
      leaveBalances,
      myLeaveRequestsList,
      pendingLeaveCount,
      addLeaveRequest,
      setLeaveRequestStatus,
      notifications,
      unreadNotificationCount,
      markNotificationRead,
      markAllNotificationsRead,
      payslips,
      payroll: payroll ?? { steps: [], runStatus: "In progress" },
      advancePayrollRun,
      publishPayslips,
      dashboardStats,
      dashboardCharts,
      dashboardWidgets,
      refreshDashboardWidgets,
      announcements,
      holidays,
      attendanceHistory,
      departments,
      payrollSummary,
      reload: loadAll,
      resetDemoData,
    }),
    [
      isReady,
      apiError,
      employeeId,
      currentEmployee,
      globalSearch,
      attendanceDateKey,
      segments,
      clockIn,
      clockOut,
      isCheckedIn,
      workedTodayLabel,
      lastEventHint,
      employees,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      leaveRequests,
      leaveBalances,
      myLeaveRequestsList,
      pendingLeaveCount,
      addLeaveRequest,
      setLeaveRequestStatus,
      notifications,
      unreadNotificationCount,
      markNotificationRead,
      markAllNotificationsRead,
      payslips,
      payroll,
      advancePayrollRun,
      publishPayslips,
      dashboardStats,
      dashboardCharts,
      dashboardWidgets,
      refreshDashboardWidgets,
      announcements,
      holidays,
      attendanceHistory,
      departments,
      payrollSummary,
      loadAll,
      resetDemoData,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useHrmsData(): HrmsDataContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useHrmsData must be used within HrmsDataProvider");
  return v;
}

export function buildTodayAttendanceRecord(
  segments: AttendanceSegment[],
  todayShortLabel: string,
): AttendanceRecord | null {
  if (segments.length === 0) return null;
  const last = segments[segments.length - 1];
  const now = Date.now();
  const worked = totalWorkedMs(segments, now);
  const firstIn = new Date(segments[0].in);
  const lastOut = last.out !== null ? new Date(last.out) : null;
  return {
    date: todayShortLabel,
    checkIn: firstIn.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    checkOut: lastOut
      ? lastOut.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "—",
    hours: msToHoursOneDecimal(worked),
    status: "present",
  };
}
