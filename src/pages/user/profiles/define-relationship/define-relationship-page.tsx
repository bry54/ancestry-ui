import { useLocation } from 'react-router-dom';
import { Container } from '@/components/common/container';
import { DefineRelationshipContent } from './define-relationship-content.tsx';

export function DefineRelationshipPage() {
  const location = useLocation();

  return (
    <Container>
      <DefineRelationshipContent />
    </Container>
  );
}
