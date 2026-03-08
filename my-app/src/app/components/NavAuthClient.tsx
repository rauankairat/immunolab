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
  role: string;
} | null;

type Labels = {
  account: string;
  myAccount: string;
  adminDashboard: string;
  ownerDashboard: string;
  signOut: string;
  signIn: string;
  register: string;
  signOutSuccess: string;
  signOutError: string;
};

export default function NavAuthClient({ user, labels }: { user: User; labels: Labels }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message || labels.signOutError);
    } else {
      toast.success(labels.signOutSuccess);
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <div className={styles.wrapper}>
      <button onClick={() => setOpen(!open)} className={styles.trigger}>
        <UserIcon size={16} />
        <span>{user ? user.name : labels.account} ▾</span>
      </button>
      {open && (
        <div className={styles.dropdown}>
          {user ? (
            <>
              <Link href="/account" onClick={() => setOpen(false)} className={styles.item}>
                {labels.myAccount}
              </Link>
              {(user.role === "ADMIN" || user.role === "OWNER") && (
                <Link href="/admin" onClick={() => setOpen(false)} className={styles.item}>
                  {labels.adminDashboard}
                </Link>
              )}
              {user.role === "OWNER" && (
                <Link href="/owner" onClick={() => setOpen(false)} className={styles.item}>
                  {labels.ownerDashboard}
                </Link>
              )}
              <button className={styles.item} onClick={handleSignOut}>
                {labels.signOut}
                <LogOutIcon size={16} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className={styles.item}>
                {labels.signIn}
              </Link>
              <Link href="/register" onClick={() => setOpen(false)} className={styles.item}>
                {labels.register}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}