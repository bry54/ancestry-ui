import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyConnectionsPage } from '../my-connections-page';
import { InviteRespondSheet } from './invite-respond-sheet';

interface InviteRespondPageProps {
  token: string | null;
}

export function InviteRespondContent({ token }: InviteRespondPageProps) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleAccept = () => {
    console.log('Accepted');
    navigate('/user/my-connections');
  };

  const handleReject = () => {
    console.log('Rejected');
    navigate('/user/my-connections');
  };

  const handleOpenChange = () => {
    setOpen(false);
    navigate('/user/my-connections');
  };

  return (
    <>
      <MyConnectionsPage />
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
