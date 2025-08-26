import { useState } from 'react';
import { useAuth } from '@/auth/context/auth-context.ts';
import { Empty } from '@/pages/utilities/empty.tsx';
import { useNavigate } from 'react-router-dom';
import { MyConnectionsPage } from '../my-connections-page';
import { InviteRespondSheet } from './invite-respond-sheet';

interface InviteRespondPageProps {
  token: string | null;
}

export function InviteRespondContent({ token }: InviteRespondPageProps) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAccept = () => {
    console.log('Accepted');
    navigate('/user/connections');
  };

  const handleReject = () => {
    console.log('Rejected');
    navigate('/user/connections');
  };

  const handleOpenChange = () => {
    setOpen(false);
    navigate('/user/connections');
  };

  return (
    <>
      {user ? <MyConnectionsPage /> : <Empty />}
      <InviteRespondSheet
        open={open}
        onOpenChange={handleOpenChange}
        onAccept={handleAccept}
        onReject={handleReject}
        token={token}
      />
    </>
  );
}
