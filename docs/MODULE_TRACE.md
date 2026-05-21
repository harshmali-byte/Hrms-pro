# HRMS Pro — Module trace (end-to-end)

Dummy API: `src/api/hrmsApi.ts` (AsyncStorage + in-memory). No real backend.

## 1. Auth
| Step | Screen | Action | Data |
|------|--------|--------|------|
| 1 | Login | Pick role + sign in | `AuthContext.signIn(role)` |
| 2 | Root | Route by role | `admin` → AdminTabs, `employee` → EmployeeTabs |

## 2. Admin — Dashboard
| Step | UI | Action | API / state |
|------|-----|--------|-------------|
| 1 | KPI cards | Tap | Navigate Personnel / show detail |
| 2 | Charts | View | `getDashboardStats()` |
| 3 | Events / notices | Tap row | Alert with detail |
| 4 | Pending leave (optional) | Approve | `updateLeaveStatus` → notifies employee |

## 3. Admin — Personnel
| Step | UI | Action | API / state |
|------|-----|--------|-------------|
| 1 | Search / filters | Type / chip | Client filter on `employees` |
| 2 | List row | Tap | Bottom sheet detail |
| 3 | Add | Submit form | `addEmployee()` → list refresh |
| 4 | Share contact | Tap field | Native share |

## 4. Admin — Leave Management
| Step | UI | Action | API / state |
|------|-----|--------|-------------|
| 1 | Tabs | Pending / Approved / Rejected | Filter `leaveRequests` |
| 2 | Card tap | Detail | Alert |
| 3 | Approve / Reject | Button | `updateLeaveStatus` + balance + notification |

## 5. Admin — Compensation (Payroll)
| Step | UI | Action | API / state |
|------|-----|--------|-------------|
| 1 | Stat cards | Tap | Info alert |
| 2 | Checklist steps | Tap row | Step hint |
| 3 | Continue run | Button | `advancePayrollRun()` persisted |
| 4 | Preview | Button | Summary alert |

## 6. Admin — Configuration
| Step | UI | Action | API / state |
|------|-----|--------|-------------|
| 1 | Settings rows | Tap | Demo alert |
| 2 | Reset demo | Confirm | `resetDemoData()` |
| 3 | Sign out | Button | `AuthContext.signOut()` |

## 7. Employee — Dashboard
| Step | UI | Action | API / state |
|------|-----|--------|-------------|
| 1 | Attendance widget | Check in/out | `clockIn` / `clockOut` + persist |
| 2 | Quick actions | Tile | Navigate module / sheet |
| 3 | Bell (TopBar) | Open | Notifications sheet |

## 8. Employee — Attendance
| Step | UI | Action | API / state |
|------|-----|--------|-------------|
| 1 | Widget | Punch | Same as dashboard |
| 2 | History row | Tap | Session detail alert |
| 3 | Stat cards | Tap | Month stats alert |

## 9. Employee — Leave
| Step | UI | Action | API / state |
|------|-----|--------|-------------|
| 1 | Balances | Tap | Policy alert |
| 2 | Apply sheet | Submit | `submitLeave()` → admin queue |
| 3 | My requests | Tap card | Detail alert |

## 10. Employee — Compensation (Payslips)
| Step | UI | Action | API / state |
|------|-----|--------|-------------|
| 1 | YTD card | Tap | Tax summary |
| 2 | Payslip row | Tap | Breakdown |
| 3 | Download | Icon | Demo PDF alert |

## 11. Employee — Profile
| Step | UI | Action | API / state |
|------|-----|--------|-------------|
| 1 | Fields / menu | Tap | Alert |
| 2 | Reset demo | Confirm | `resetDemoData()` |
| 3 | Sign out | Button | `signOut()` |

## Shared
- **TopBar search**: filters employees (admin) or routes hint (employee).
- **Notifications**: `markNotificationRead`, `markAllNotificationsRead`.
- **Persistence keys**: `hrms.v1.attendance`, `hrms.v1.demo`, `hrms.v1.payroll`.
