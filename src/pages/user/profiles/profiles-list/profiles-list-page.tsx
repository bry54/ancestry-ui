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
              Central Hub to manage people in your tree, add minors/deceased or
              invite people from here.
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="primary">
              <Link to={'/user/profiles/add'}>Add Person</Link>
            </Button>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white">
              <Link to={'/user/profiles/relationship'}>
                Define Relationship
              </Link>
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
