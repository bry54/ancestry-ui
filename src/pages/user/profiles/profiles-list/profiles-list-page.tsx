import { Fragment } from 'react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Link } from 'react-router-dom';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { ProfilesListContent } from '.';

export function ProfilesListPage() {
  const {} = useSettings();

  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>
              Central Hub to manage profiles
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="outline">Upload CSV</Button>
            <Button variant="primary">
              <Link to={'/user/profiles/add'}>Add Person</Link>
            </Button>
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <ProfilesListContent />
      </Container>
    </Fragment>
  );
}
