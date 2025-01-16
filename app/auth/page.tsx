
import { Tabs } from './components/Tabs';
import { redirect } from 'next/navigation';

interface SearchParams {
  tab?: string;
}

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Await the searchParams Promise
  const params = await searchParams;
  const tab = params?.tab;

  if (!tab) {
    redirect('/auth?tab=signin');
  }

  if (tab !== 'signin' && tab !== 'signup') {
    redirect('/auth?tab=signin');
  }

  return <Tabs tab={tab} />;
}
