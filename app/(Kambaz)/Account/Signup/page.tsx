"use client";
import Link from "next/link";
import { useState } from "react";
import { Button, FormControl, FormLabel } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as client from "../client";
import { setCurrentUser } from "../reducer";
import { redirect } from "next/navigation";

export default function Signup() {
  const [user, setUser] = useState<any>({ username: "", password: "", role: "STUDENT" });
  const dispatch = useDispatch();
  const signup = async () => {
    try {
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      redirect("/Account/Profile");
    } catch (err: any) {
      console.log(err); // Handle errors (like duplicate username)
    }
  };

  return (
    <div
      id="wd-signup-screen"
      style={{
        maxWidth: 300,
      }}
    >
      <h3>Sign up</h3>

      <FormLabel htmlFor="wd-signup-username">Username</FormLabel>
      <FormControl
        id="wd-signup-username"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        className="wd-username b-2"
        placeholder="username"
      />

      <FormLabel htmlFor="wd-signup-password" className="mt-3">
        Password
      </FormLabel>
      <FormControl
        id="wd-signup-password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        className="wd-password mb-2"
        placeholder="password"
        type="password"
      />

      <FormLabel htmlFor="wd-re-enter-password" className="mt-3">
        Re-enter Password
      </FormLabel>
      <FormControl
        id="wd-re-enter-password"
        placeholder="verify password"
        type="password"
        className="wd-password-verify"
      />

      {/* --- NEW: ROLE DROPDOWN --- */}
      <FormLabel htmlFor="wd-signup-role">Role</FormLabel>
      <select
        id="wd-signup-role"
        className="form-select mb-2"
        value={user.role}
        onChange={(e) => setUser({ ...user, role: e.target.value })}
      >
        <option value="STUDENT">Student</option>
        <option value="FACULTY">Faculty</option>
        <option value="ADMIN">Admin</option>
      </select>
      {/* --------------------------- */}

      <Button className="w-100 my-3" onClick={signup}>
        Sign up{" "}
      </Button>
      <br />

      <Link href="Signin"> Sign in </Link>
    </div>
  );
}
