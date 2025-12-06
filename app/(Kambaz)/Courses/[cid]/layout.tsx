"use client";
import { ReactNode, useEffect, useState } from "react";
import CourseNavigation from "./Navigation";
import { useSelector } from "react-redux";
import { redirect, useParams } from "next/navigation";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "./Breadcrumb";
export default function CoursesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { cid } = useParams();
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const course = courses.find((course: any) => course?._id === cid);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);

  const [isNavigationVisible, setIsNavigationVisible] = useState(true);

  useEffect(() => {
    if (
      !enrollments.some(
        (enrollment: any) =>
          enrollment.user === currentUser?._id &&
          enrollment.course === course?._id
      )
    ) {
      redirect("/Dashboard");
    }
    console.log(currentUser, enrollments, course);
  }, [currentUser, enrollments, course]);
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify
          className="me-4 fs-4 mb-1"
          onClick={() => {
            setIsNavigationVisible((prev) => !prev);
          }}
        />
        <Breadcrumb course={course} />
      </h2>
      <hr />
      <div className="d-flex">
        {isNavigationVisible && (
          <div className="d-none d-md-block">
            <CourseNavigation courseId={cid as string} />
          </div>
        )}
        <div className="d-flex w-100 flex-fill">{children}</div>
      </div>
    </div>
  );
}
