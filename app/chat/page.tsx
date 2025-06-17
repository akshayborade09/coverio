import { Suspense } from 'react';
import ChatPage from './ChatPage';

export default function Page() {
  return (
    <Suspense>
      <ChatPage />
    </Suspense>
  );
} 