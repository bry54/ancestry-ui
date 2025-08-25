import { useLocation } from 'react-router-dom';
import { Container } from '@/components/common/container';
import { InvitePersonContent } from './invite-person-content';

export function InvitePersonPage() {
  const location = useLocation();
  const person = location.state?.person;

  return (
    <Container>
      <InvitePersonContent person={person} />
    </Container>
  );
}
