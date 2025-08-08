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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { Container } from '@/components/common/container';
import { RelationsGraphContent } from '.';

export function RelationsGraphPage() {
  const {} = useSettings();

  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="Tree Explorer" />
            <ToolbarDescription>
              Explore your family tree nodes
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <Select defaultValue="all">
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Select Depth" />
              </SelectTrigger>
              <SelectContent className="w-32">
                <SelectItem value="all"> All nodes </SelectItem>
                <SelectItem value="<3"> &lt; 3 </SelectItem>
                <SelectItem value="<5">&lt; 5</SelectItem>
                <SelectItem value=">6">&gt; 6</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="primary">Download PNG</Button>
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <RelationsGraphContent />
      </Container>
    </Fragment>
  );
}
