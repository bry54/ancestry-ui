import { useState } from 'react';
import { UserManagementPage } from '@/pages/admin';
import { AddUserSheet } from '@/pages/admin/user-management/add-user/add-user-sheet.tsx';
import { useNavigate } from 'react-router-dom';

export function AddUserContent() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleAddUser = () => {
    navigate('/admin/users');
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
        onOpenChange={handleOpenChange}
        addUser={handleAddUser}
      />
    </>
  );
}
