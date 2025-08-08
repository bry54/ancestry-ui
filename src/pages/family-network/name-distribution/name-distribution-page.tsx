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
import { NameDistributionContent } from '.';

export function NameDistributionPage() {
  const {} = useSettings();

  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="Name Distribution" />
            <ToolbarDescription>
              Explore how names are distributed in your network
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <Select defaultValue="both">
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Select Side" />
              </SelectTrigger>
              <SelectContent className="w-32">
                <SelectItem value="both"> Both </SelectItem>
                <SelectItem value="paternal"> Paternal </SelectItem>
                <SelectItem value="maternal">Maternal</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="primary">Download PNG</Button>
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <NameDistributionContent />
      </Container>
    </Fragment>
  );
}
