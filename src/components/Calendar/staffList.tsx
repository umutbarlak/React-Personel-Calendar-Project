import PersonIcon from "./personIcon";

type StaffListProps = {
  staffs: any[];
  selectedStaffId: string | null;
  setSelectedStaffId: (id: string) => void;
};

const StaffList = ({
  staffs,
  selectedStaffId,
  setSelectedStaffId,
}: StaffListProps) => {
  return (
    <div className="staff-list">
      <div
        onClick={() => setSelectedStaffId("")}
        className={`staff ${!selectedStaffId ? "active" : ""}`}
      >
        Tümü
      </div>
      {staffs?.map((staff: any) => (
        <div
          key={staff.id}
          onClick={() => setSelectedStaffId(staff.id)}
          className={`staff ${staff.id === selectedStaffId ? "active" : ""}`}
        >
          <PersonIcon />
          <span>{staff.name}</span>
        </div>
      ))}
    </div>
  );
};

export default StaffList;
