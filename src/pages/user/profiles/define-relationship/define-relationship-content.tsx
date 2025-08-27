import { useState } from 'react';
import { DefineRelationshipSheet } from '@/pages/user';
import { ProfilesListPage } from '@/pages/user/profiles/profiles-list';
import { useNavigate } from 'react-router-dom';

export function DefineRelationshipContent() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleOnSuccess = () => {
    navigate('/user/profiles');
  };

  const handleOpenChange = () => {
    setOpen(false);
    navigate('/user/profiles');
  };

  return (
    <>
      <ProfilesListPage />
      <DefineRelationshipSheet
        open={open}
        onOpenChange={handleOpenChange}
        onRelationshipDefined={handleOnSuccess}
      />
    </>
  );
}
