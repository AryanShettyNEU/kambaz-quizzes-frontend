"use client";
import { redirect } from "next/dist/client/components/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { Button, FormControl, FormLabel, FormSelect } from "react-bootstrap";
import * as client from "../client";

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const fetchProfile = () => {
    if (!currentUser) return redirect("/Account/Signin");
    setProfile(currentUser);
  };
  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    redirect("/Account/Signin");
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  const updateProfile = async () => {
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
  };

  return (
    <div id="wd-profile-screen" style={{ maxWidth: 300 }}>
      <h3>Profile</h3>
      <div>
        <FormLabel htmlFor="wd-profile-username">Username</FormLabel>
        <FormControl
          id="wd-profile-username"
          defaultValue={profile.username}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          placeholder="username"
          className="wd-username"
        />
        <FormLabel className="mt-2" htmlFor="wd-profile-password">
          Password
        </FormLabel>
        <FormControl
          id="wd-profile-password"
          defaultValue={profile.password}
          onChange={(e) => setProfile({ ...profile, password: e.target.value })}
          placeholder="password"
          type="password"
          className="wd-password"
        />

        <FormLabel className="mt-2" htmlFor="wd-firstname">
          First Name
        </FormLabel>
        <FormControl
          defaultValue={profile.firstName}
          onChange={(e) =>
            setProfile({ ...profile, firstName: e.target.value })
          }
          placeholder="First Name"
          id="wd-firstname"
        />

        <FormLabel className="mt-2" htmlFor="wd-lastname">
          Last Name
        </FormLabel>

        <FormControl
          defaultValue={profile.lastName}
          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
          placeholder="Last Name"
          id="wd-lastname"
        />

        <FormLabel className="mt-2" htmlFor="wd-dob">
          Date of Birth
        </FormLabel>
        <FormControl
          defaultValue={profile.dob}
          onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
          type="date"
          id="wd-dob"
        />

        <FormLabel className="mt-2" htmlFor="wd-email">
          Email
        </FormLabel>
        <FormControl
          defaultValue={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          type="email"
          id="wd-email"
        />

        <FormLabel className="mt-2" htmlFor="wd-role">
          Role
        </FormLabel>
        <FormSelect
          defaultValue="FACULTY"
          id="wd-role"
          onChange={(e) => setProfile({ ...profile, role: e.target.value })}
        >
          <option value="USER">User</option>{" "}
          <option value="ADMIN">Admin</option>
          <option value="FACULTY">Faculty</option>
          <option value="STUDENT">Student</option>
        </FormSelect>
        <button onClick={updateProfile} className="btn btn-primary w-100 mt-4">
          {" "}
          Update{" "}
        </button>
        <Button
          onClick={signout}
          className="w-100 mb-2 mt-4"
          id="wd-signout-btn"
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
