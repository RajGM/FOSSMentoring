"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
//import { useRouter } from "next/router";
import { useContext, useRef, useEffect } from "react";
import { UserContext } from "@lib/context";
import { auth, googleAuthProvider } from "@lib/firebase";

import ModalButton from "./Modal";
import HoverModalButton from "./HoverModalButton";
import Image from "next/image";

import { toast } from "react-hot-toast";

export default function Header() {
  const { user, username } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
  }, [user]);

  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  const signOut = () => {
    // Show a loading toast
    const toastId = toast.loading("Logging out...");

    auth
      .signOut()
      .then(() => {
        // Dismiss the loading toast and show a success toast
        toast.dismiss(toastId);
        toast.success("Logged out successfully!");
        router.push("/");
      })
      .catch((error) => {
        // Dismiss the loading toast and show an error toast
        toast.dismiss(toastId);
        toast.error("Error logging out: " + error.message);
      });
  };

  return (
    <>
      <div className="navbar bg-info text-primary-content">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl" href="/">
            FOSS Mentoring
          </a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            {username && (
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <Image
                    src={user?.photoURL || "/default-avatar.png"}
                    alt="DP"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
              </label>
            )}
            {/* user is signed-in and has username */}
            {username && (
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <a href="/dashboard" className="justify-between">
                    Dash
                  </a>
                </li>
                <li>
                  <a href="/opp" className="justify-between">
                    OPP
                  </a>
                </li>
                <li>
                  <a href="/mentor" className="justify-between">
                    Mentors
                  </a>
                </li>
                <li>
                  <a href="/chat" className="justify-between">
                    Chat
                  </a>
                </li>
                <li>
                  <a href="/blog" className="justify-between">
                    Blog
                  </a>
                </li>
                <li>
                  <ModalButton eventData={null} />
                </li>
                <li>
                  <button onClick={signOut}>LogOut</button>
                </li>
              </ul>
            )}

            {!username && (
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80" />
                </div>
              </label>
            )}

            {!username && (
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link href="/enter">
                    <button className="btn-blue">Log in</button>
                  </Link>
                </li>
                <li>
                  <Link href="/mentors">
                    <button className="btn-blue">Mentors</button>
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
