import { useLocation } from 'react-router-dom';
import { Container } from '@/components/common/container';
import { DefineRelationshipContent } from './define-relationship-content.tsx';

export function DefineRelationshipPage() {
  const location = useLocation();

  const target = location.state?.targetPerson;
  const source = location.state?.sourcePerson;

  return (
    <Container>
      <DefineRelationshipContent target={target} source={source} />
    </Container>
  );
}
