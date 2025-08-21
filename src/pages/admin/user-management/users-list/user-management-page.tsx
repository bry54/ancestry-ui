import { Fragment } from 'react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { UserManagementContent } from '.';

export function UserManagementPage() {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>
              Central Hub to manage system users
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="primary">
              <Link to={'/admin/users/add'}>Add User</Link>
            </Button>
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <UserManagementContent />
      </Container>
    </Fragment>
  );
}
