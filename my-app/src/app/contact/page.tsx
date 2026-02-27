import { getServerSession } from '@/lib/get-session';
import { redirect } from 'next/navigation';
import ContactPage from './contactClient';

const page = async () => {
  const session = await getServerSession();
  const user = session?.user;

    if(user){
      redirect("/account")
    }

  return <ContactPage />
}

export default page