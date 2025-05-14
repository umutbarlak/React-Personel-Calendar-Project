export const getShiftById = (shifts: any[], shiftId: string) => {
  return shifts.find((s) => s.id === shiftId);
};

export const getAssigmentById = (assignments: any[], assignmentId: string) => {
  return assignments.find((a) => a.id === assignmentId);
};

export const getStaffById = (staffs: any[], staffId: string) => {
  return staffs.find((s) => s.id === staffId);
};
