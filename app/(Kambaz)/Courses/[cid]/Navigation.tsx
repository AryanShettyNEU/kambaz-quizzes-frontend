"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  "Home",
  "Modules",
  "Piazza",
  "Zoom",
  "Assignments",
  "Quizzes",
  "Grades",
  "People",
];

export default function CourseNavigation({ courseId }: { courseId: string }) {
  const pathname = usePathname();
  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => (
        <Link
          href={`/Courses/${courseId}/${link}`}
          key={link}
          id={`wd-course-${link.toLowerCase()}-link`}
          className={`list-group-item ${
            pathname.includes(link) ? "active" : "text-danger"
          } border-0`}
        >
          {link}
        </Link>
      ))}
    </div>
  );
}
