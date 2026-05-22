import { sequelize } from "../config/database.js";
import { User } from "./User.js";
import { Employee } from "./Employee.js";
import { LeaveRequest } from "./LeaveRequest.js";
import { LeaveBalance } from "./LeaveBalance.js";
import { AttendanceDay } from "./AttendanceDay.js";
import { Notification } from "./Notification.js";
import { Payslip } from "./Payslip.js";
import { PayrollRun } from "./PayrollRun.js";
import { CompanyProfile } from "./CompanyProfile.js";
import { LeavePolicy } from "./LeavePolicy.js";
import { HrRole } from "./HrRole.js";
import { DocumentTemplate } from "./DocumentTemplate.js";
import { OrgPreferences } from "./OrgPreferences.js";
import { AuditLog } from "./AuditLog.js";
import { Announcement } from "./Announcement.js";
import { Holiday } from "./Holiday.js";
import { OrgEvent } from "./OrgEvent.js";
import { Notice } from "./Notice.js";
import { EmployeeDocument } from "./EmployeeDocument.js";
import { PrivacyPreference } from "./PrivacyPreference.js";
import { SupportTicket } from "./SupportTicket.js";
import { UserPreference } from "./UserPreference.js";

Employee.hasMany(LeaveRequest, { foreignKey: "employeeId" });
LeaveRequest.belongsTo(Employee, { foreignKey: "employeeId" });

Employee.hasMany(LeaveBalance, { foreignKey: "employeeId" });
LeaveBalance.belongsTo(Employee, { foreignKey: "employeeId" });

Employee.hasMany(AttendanceDay, { foreignKey: "employeeId" });
AttendanceDay.belongsTo(Employee, { foreignKey: "employeeId" });

Employee.hasMany(Payslip, { foreignKey: "employeeId" });
Payslip.belongsTo(Employee, { foreignKey: "employeeId" });

User.belongsTo(Employee, { foreignKey: "employeeId", targetKey: "id", constraints: false });

Employee.hasMany(EmployeeDocument, { foreignKey: "employeeId" });
EmployeeDocument.belongsTo(Employee, { foreignKey: "employeeId" });

Employee.hasOne(PrivacyPreference, { foreignKey: "employeeId" });
PrivacyPreference.belongsTo(Employee, { foreignKey: "employeeId" });

Employee.hasMany(SupportTicket, { foreignKey: "employeeId" });
SupportTicket.belongsTo(Employee, { foreignKey: "employeeId" });

Employee.hasOne(UserPreference, { foreignKey: "employeeId" });
UserPreference.belongsTo(Employee, { foreignKey: "employeeId" });

export {
  sequelize,
  User,
  Employee,
  LeaveRequest,
  LeaveBalance,
  AttendanceDay,
  Notification,
  Payslip,
  PayrollRun,
  CompanyProfile,
  LeavePolicy,
  HrRole,
  DocumentTemplate,
  OrgPreferences,
  AuditLog,
  Announcement,
  Holiday,
  OrgEvent,
  Notice,
  EmployeeDocument,
  PrivacyPreference,
  SupportTicket,
  UserPreference,
};
