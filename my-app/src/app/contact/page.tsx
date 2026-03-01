import { getServerSession } from '@/lib/get-session';
import { redirect } from 'next/navigation';
import ContactPage from './contactClient';

const page = async () => {
  
  return <ContactPage />
}

export default page