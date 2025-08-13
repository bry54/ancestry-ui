import { Fragment } from 'react';
import { PageNavbar } from '@/pages/account';
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Link } from 'react-router-dom';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { AuditLogContent } from '.';

export function AuditLogPage() {
  const { settings } = useSettings();

  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="outline">
              <Link to="#">Security Overview</Link>
            </Button>
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <AuditLogContent />
      </Container>
    </Fragment>
  );
}
