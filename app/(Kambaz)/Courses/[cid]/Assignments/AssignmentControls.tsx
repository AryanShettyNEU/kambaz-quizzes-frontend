import { BsPlusLg } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";

export default function AssignmentControlButtons() {
  return (
    <span>
      <span className="border border-dark  p-2 rounded-pill">40% of Total</span>
      <BsPlusLg className="me-3 ms-2" href="/Courses/1234/Assignments/New" />
      <IoEllipsisVertical className="fs-4" />
    </span>
  );
}
