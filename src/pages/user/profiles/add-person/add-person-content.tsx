import { useState } from 'react';
import { AddPersonSheet } from '@/pages/user/profiles/add-person/add-person-sheet.tsx';
import { ProfilesListPage } from '@/pages/user/profiles/profiles-list';
import { useNavigate } from 'react-router-dom';

export function AddPersonContent() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleAddPerson = () => {
    console.log('Added');
    navigate('/user/profiles');
  };

  const handleOpenChange = () => {
    setOpen(false);
    navigate('/user/profiles');
  };

  return (
    <>
      <ProfilesListPage />
      <AddPersonSheet
        open={open}
        onOpenChange={handleOpenChange}
        addPerson={handleAddPerson}
      />
    </>
  );
}
