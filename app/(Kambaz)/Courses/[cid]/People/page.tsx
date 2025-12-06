"use client";
import { findUsersForCourse } from "../../client";
import { useEffect, useState } from "react";
import PeopleTable from "./Table/page";
import { useParams } from "next/navigation";
export default function page() {
  const { cid } = useParams();
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    const tempUsers = await findUsersForCourse(cid as string);
    setUsers(tempUsers ?? []);
  };
  useEffect(() => {
    fetchUsers();
  }, [cid]);

  return (
    <PeopleTable
      users={users.filter((user) => user !== null)}
      fetchUsers={() => {}}
    />
  );
}
