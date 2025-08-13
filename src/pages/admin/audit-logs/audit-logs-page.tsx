import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { AuditLogsContent } from '.';

export function AuditLogsPage() {
  return (
    <Fragment>
      <Container>
        <AuditLogsContent />
      </Container>
    </Fragment>
  );
}
