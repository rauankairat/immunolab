import React from 'react'
import { getServerSession } from '@/lib/get-session';
import { redirect } from 'next/navigation';
import LoginPage from './loginClient';

const page = async () => {
  const session = await getServerSession();
  const user = session?.user;

    if(user){
      redirect("/account")
    }

  return <LoginPage />
}

export default page