import { Fragment } from 'react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { FamilySizeContent } from '.';

export function FamilySizePage() {
  const {} = useSettings();

  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="Family Size" />
            <ToolbarDescription>See how big your family is</ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="primary">Download PNG</Button>
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <FamilySizeContent />
      </Container>
    </Fragment>
  );
}
