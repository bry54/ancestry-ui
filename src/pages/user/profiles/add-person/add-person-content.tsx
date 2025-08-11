import { useState } from 'react';
import { AddPersonSheet } from '@/pages/user/profiles/add-person/add-person-sheet.tsx';
import { ProfilesListPage } from '@/pages/user/profiles/profiles-list';
import { useNavigate } from 'react-router-dom';

export function AddPersonContent() {
  const [open, setOpen] = useState(true);
  const [selectedProductId] = useState('123');
  const navigate = useNavigate();

  const handleAddPerson = () => {
    console.log('Added');
    navigate(-1);
  };

  const handleOpenChange = () => {
    setOpen(false);
    navigate(-1);
  };

  return (
    <>
      <ProfilesListPage />
      <AddPersonSheet
        open={open}
        productId={selectedProductId}
        onOpenChange={handleOpenChange}
        addPerson={handleAddPerson}
      />
    </>
  );
}
