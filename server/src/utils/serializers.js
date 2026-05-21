export function employeeToJson(e) {
  return {
    id: e.id,
    name: e.name,
    role: e.role,
    department: e.department,
    email: e.email,
    phone: e.phone,
    avatarColor: e.avatarColor,
    joinedOn: e.joinedOn,
    reportsTo: e.reportsTo ?? undefined,
    status: e.status,
    location: e.location ?? undefined,
    employeeCode: e.employeeCode ?? undefined,
  };
}

export function leaveRequestToJson(r) {
  return {
    id: r.id,
    employeeId: r.employeeId,
    employeeName: r.employeeName,
    type: r.type,
    from: r.from,
    to: r.to,
    days: r.days,
    reason: r.reason,
    status: r.status,
    appliedOn: r.appliedOn,
  };
}

export function notificationToJson(n) {
  return {
    id: n.id,
    title: n.title,
    body: n.body,
    read: n.read,
    createdAt: n.createdAtLabel,
  };
}

export function payslipToJson(p) {
  return {
    id: p.id,
    month: p.month,
    year: p.year,
    gross: p.gross,
    deductions: p.deductions,
    net: p.net,
    status: p.status,
  };
}
