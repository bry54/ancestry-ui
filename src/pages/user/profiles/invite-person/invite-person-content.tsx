import { useState } from 'react';
import { InvitePersonSheet } from '@/pages/user/profiles/invite-person/invite-person-sheet.tsx';
import { ProfilesListPage } from '@/pages/user/profiles/profiles-list';
import { useNavigate } from 'react-router-dom';
import { LineageSide, RelationshipType } from '@/lib/enums';
import { Any } from '@/lib/interfaces';

interface IInvitePerson {
  person: Any;
}

export interface IInvitePersonDto {
  email: string;
  phone?: string;
  type?: RelationshipType;
  targetPersonId: string;
  lineageSide?: LineageSide;
}

export function InvitePersonContent({ person }: IInvitePerson) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleInvitePerson = () => {
    navigate('/user/profiles');
  };

  const handleOpenChange = () => {
    setOpen(false);
    navigate('/user/profiles');
  };

  return (
    <>
      <ProfilesListPage />
      <InvitePersonSheet
        open={open}
        onOpenChange={handleOpenChange}
        onInvitePerson={handleInvitePerson}
        person={person}
      />
    </>
  );
}
