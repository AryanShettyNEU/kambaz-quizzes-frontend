import Link from "next/link";
import React from "react";

interface AttemptRowProps {
  attemptNumber: number;
  score: number;
  total: number;
  cid: string;
  qid: string;
  attemptId: string;
}

export default function AttemptRow({
  attemptNumber,
  score,
  total,
  cid,
  qid,
  attemptId,
}: AttemptRowProps) {
  return (
    <tr>
      <Link href={`/Courses/${cid}/Quizzes/${qid}/${attemptId}`}>
        <td className="py-3 text-danger">Attempt {attemptNumber}</td>
      </Link>
      <td className="py-3">
        {score} out of {total}
      </td>
    </tr>
  );
}
