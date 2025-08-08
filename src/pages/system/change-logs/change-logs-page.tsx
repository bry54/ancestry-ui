import { PageNavbar } from '@/pages/account';
import { ChangeLogsContent } from '@/pages/system';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { useSettings } from '@/providers/settings-provider';
import { Container } from '@/components/common/container';

export function ChangeLogsPage() {
  const {} = useSettings();

  return (
    <>
      <PageNavbar />
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>
              Summary of how the system has evolved over time
            </ToolbarDescription>
          </ToolbarHeading>
        </Toolbar>
      </Container>
      <Container>
        <ChangeLogsContent />
      </Container>
    </>
  );
}
