import { useState } from 'react';
import { DefineRelationshipSheet } from '@/pages/user';
import { ProfilesListPage } from '@/pages/user/profiles/profiles-list';
import { useNavigate } from 'react-router-dom';

interface DefineRelationshipContentProps {
  target: string;
  source: string;
}

export function DefineRelationshipContent(
  props: DefineRelationshipContentProps,
) {
  const { target, source } = props;
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
        source={source}
        target={target}
      />
    </>
  );
}
