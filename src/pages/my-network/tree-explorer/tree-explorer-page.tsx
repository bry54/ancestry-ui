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
import { TreeExplorerContent } from '.';

export function TreeExplorerPage() {
  const {  } = useSettings();

  return (
    <Fragment>
      <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text='Tree Explorer' />
              <ToolbarDescription>
                Explore your family tree nodes
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="primary">Download PNG</Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      <Container>
        <TreeExplorerContent />
      </Container>
    </Fragment>
  );
}
