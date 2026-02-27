import { getServerSession } from '@/lib/get-session';
import RegisterClient from './registerClient'
import { redirect } from 'next/navigation';


const page = async () => {
  const session = await getServerSession();
  const user = session?.user;

    if(user){
      redirect("/account")
    }

  return <RegisterClient />
}

export default page