"use client";
import Link from "next/link";
import { useState } from "react";
import { Button, FormControl, FormLabel } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as client from "../client";
import { setCurrentUser } from "../reducer";
import { redirect } from "next/navigation";

export default function Signup() {
  const [user, setUser] = useState<any>({});
  const dispatch = useDispatch();
  const signup = async () => {
    const currentUser = await client.signup(user);
    dispatch(setCurrentUser(currentUser));
    redirect("/Account/Profile");
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

      <Button className="w-100 my-3" onClick={signup}>
        Sign up{" "}
      </Button>
      <br />

      <Link href="Signin"> Sign in </Link>
    </div>
  );
}
