"use client";
import { UserIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import styles from "./NavAuth.module.css";

type User = {
  name: string;
  email: string;
} | null;

export default function NavAuthClient({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
  const { error } = await authClient.signOut();
  if (error) {
    toast.error(error.message || "Something went wrong");
  } else {
    toast.success("Signed out successfully");
    router.push("/register");
    router.refresh(); 
  }
}

  return (
    <div className={styles.wrapper}>
      <button onClick={() => setOpen(!open)} className={styles.trigger}>
        <UserIcon size={16} />
        <span>{user ? user.name : "Account"} ▾</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          {user ? (
            <>
              <Link href="/orders" onClick={() => setOpen(false)} className={styles.item}>
                My Account
              </Link>
              <button className={styles.item} onClick={handleSignOut}>
                <LogOutIcon size={16} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className={styles.item}>
                Sign in
              </Link>
              <Link href="/register" onClick={() => setOpen(false)} className={styles.item}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}