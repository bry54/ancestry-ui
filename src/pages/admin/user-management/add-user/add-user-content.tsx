import { useState } from 'react';
import { UserManagementPage } from '@/pages/admin';
import { AddUserSheet } from '@/pages/admin/user-management/add-user/add-user-sheet.tsx';
import { useNavigate } from 'react-router-dom';

export function AddUserContent() {
  const [open, setOpen] = useState(true);
  const [selectedProductId] = useState('123');
  const navigate = useNavigate();

  const handleAddUser = () => {
    console.log('Added');
    navigate(-1);
  };

  const handleOpenChange = () => {
    setOpen(false);
    navigate('/admin/users');
  };

  return (
    <>
      <UserManagementPage />
      <AddUserSheet
        open={open}
        productId={selectedProductId}
        onOpenChange={handleOpenChange}
        addUser={handleAddUser}
      />
    </>
  );
}
