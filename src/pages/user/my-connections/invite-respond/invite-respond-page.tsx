import { useSearchParams } from 'react-router-dom';
import { Container } from '@/components/common/container';
import { InviteRespondContent } from '.';

export function InviteRespondPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return (
    <Container>
      <InviteRespondContent token={token} />
    </Container>
  );
}
