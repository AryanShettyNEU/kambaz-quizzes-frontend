"use client";
import Link from "next/link";
import { redirect } from "next/dist/client/components/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as db from "../../Database";
import { FormControl, Button, FormLabel } from "react-bootstrap";
import * as client from "../client";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const signin = async () => {
    const user = await client.signin(credentials);
    if (!user) return;
    dispatch(setCurrentUser(user));
    redirect("/Dashboard");
  };

  return (
    <div
      id="wd-signin-screen"
      style={{
        maxWidth: 300,
      }}
    >
      <h3>Sign in</h3>
      <FormLabel htmlFor="wd-signin-username">Username</FormLabel>
      <FormControl
        placeholder="username"
        id="wd-signin-username"
        className="wd-username"
        defaultValue={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
      />

      <FormLabel htmlFor="wd-signin-password" className="mt-3">
        Password
      </FormLabel>
      <FormControl
        id="wd-signin-password"
        placeholder="password"
        type="password"
        className="wd-password"
        defaultValue={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
      />

      <Button onClick={signin} id="wd-signin-btn" className="w-100 my-3">
        Sign in
      </Button>
      <br />
      <Link href="Signup" id="wd-signup-link">
        Sign up
      </Link>
    </div>
  );
}
