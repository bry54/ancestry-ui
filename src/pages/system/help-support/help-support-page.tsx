import { Fragment } from 'react';
import { useSettings } from '@/providers/settings-provider';
import { Container } from '@/components/common/container';
import { HelpSupportContent } from '.';

export function HelpSupportPage() {
  const {} = useSettings();

  return (
    <Fragment>
      <Container>
        <HelpSupportContent />
      </Container>
    </Fragment>
  );
}
