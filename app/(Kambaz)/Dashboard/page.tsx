"use client";
import { SyntheticEvent, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  FormControl,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCourse,
  deleteCourse,
  updateCourse,
  setCourses,
} from "../Courses/reducer";
import { enrollInCourse, setEnrollments, unEnrollInCourse } from "./reducer";
import * as client from "../Courses/client";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);

  const [showAll, setShowAll] = useState(false);
  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  const isFaculty = currentUser?.role === "FACULTY";

  const showAllEnrollments = (e: SyntheticEvent) => {
    e.preventDefault();
    setShowAll(true);
  };

  const showMyEnrollments = (e: SyntheticEvent) => {
    e.preventDefault();
    setShowAll(false);
  };

  const isEnrolled = (courseId: string) =>
    enrollments.some(
      (e: any) => e.user === currentUser?._id && e.course === courseId
    );

  const handleUpdate = () => dispatch(updateCourse(course));
  const handleDelete = (id: string) => dispatch(deleteCourse(id));
  const handleEdit = (c: any) => setCourse(c);

  const handleEnrollToggle = async (e: SyntheticEvent, course: any) => {
    e.preventDefault();
    if (isEnrolled(course._id)) {
      await client.unEnrollInCourse(currentUser?._id, course._id);
    } else {
      await client.enrollInCourse(currentUser?._id, course._id);
    }
    await fetchAllEnrollments();
    if (!showAll) fetchCourses();
  };
  const fetchCourses = async () => {
    try {
      const courses = await client.findMyCourses();
      dispatch(setCourses(courses));
    } catch (error) {
      console.error(error);
    }
  };
  const onDeleteCourse = async (courseId: string) => {
    const status = await client.deleteCourse(courseId);
    dispatch(
      setCourses(courses.filter((course: any) => course._id !== courseId))
    );
  };

  const fetchAllCourses = async () => {
    try {
      const courses = await client.fetchAllCourses();
      dispatch(setCourses(courses));
    } catch (error) {
      console.error(error);
    }
  };
  const fetchAllEnrollments = async () => {
    try {
      const enrollments = await client.findMyEnrollments();
      dispatch(setEnrollments(enrollments));
    } catch (error) {
      console.error(error);
    }
  };
  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(
      setCourses(
        courses.map((c: any) => {
          if (c._id === course._id) {
            return course;
          } else {
            return c;
          }
        })
      )
    );
  };

  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
    fetchAllEnrollments();
  };

  useEffect(() => {
    if (showAll) {
      fetchAllCourses();
    } else fetchCourses();
    fetchAllEnrollments();
  }, [currentUser, showAll]);
  return (
    <div id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title">Dashboard</h1>
        {showAll ? (
          <Button variant="primary" onClick={showMyEnrollments}>
            My Courses
          </Button>
        ) : (
          <Button variant="primary" onClick={showAllEnrollments}>
            All Courses
          </Button>
        )}
      </div>
      <hr />

      {isFaculty && (
        <>
          <h5>
            New Course
            <div className="float-end">
              <Button
                variant="primary"
                id="wd-add-new-course-click"
                onClick={onAddNewCourse}
              >
                Add
              </Button>
              <Button
                variant="warning"
                className="ms-2"
                id="wd-update-course-click"
                onClick={onUpdateCourse}
              >
                Update
              </Button>
            </div>
          </h5>
          <FormControl
            value={course.name}
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
            className="mb-2"
          />
          <FormControl
            value={course.description}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
        </>
      )}

      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
      <hr />

      <Row xs={1} md={5} className="g-4">
        {courses.map((c: any) => {
          const enrolled = isEnrolled(c._id);
          return (
            <Col
              className="wd-dashboard-course"
              style={{ width: "300px" }}
              key={c._id}
            >
              <Card>
                <Link
                  href={`/Courses/${c._id}/Home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <CardImg
                    src={c.image || "/images/reactjs.jpg"}
                    height={160}
                  />
                  <CardBody>
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {c.name}
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      {c.description}
                    </CardText>

                    <Button variant="primary">Go</Button>

                    {isFaculty && (
                      <>
                        <Button
                          variant="warning"
                          className="me-2 float-end"
                          id="wd-edit-course-click"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEdit(c);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          className="float-end me-2"
                          id="wd-delete-course-click"
                          onClick={(e) => {
                            e.preventDefault();
                            onDeleteCourse(c._id);
                          }}
                        >
                          Delete
                        </Button>
                      </>
                    )}

                    {currentUser?._id && showAll && (
                      <div className="mt-2">
                        <Button
                          variant={enrolled ? "danger" : "success"}
                          onClick={(e) => handleEnrollToggle(e, c)}
                        >
                          {enrolled ? "Unenroll" : "Enroll"}
                        </Button>
                      </div>
                    )}
                  </CardBody>
                </Link>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
