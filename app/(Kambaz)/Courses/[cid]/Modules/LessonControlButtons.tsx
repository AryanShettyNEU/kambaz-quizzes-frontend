import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { FaTrash } from "react-icons/fa";
export default function LessonControlButtons({
  onDeleteAssignment,
}: {
  onDeleteAssignment?: () => void;
}) {
  return (
    <div className="float-end">
      <GreenCheckmark />
      <IoEllipsisVertical className="fs-4" />

      {onDeleteAssignment && (
        <FaTrash className="text-danger" onClick={onDeleteAssignment} />
      )}
    </div>
  );
}
