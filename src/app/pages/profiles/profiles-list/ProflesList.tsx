import {KTCard} from '../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'
import {ProfilesListHeader} from "./components/header/ProfilesListHeader.tsx";
import {ProfilesTable} from "./table/ProfilesTable.tsx";

const UsersList = () => {
  return (
    <>
      <KTCard>
        <ProfilesListHeader />
        <ProfilesTable />
      </KTCard>
    </>
  )
}

const ProfilesListWrapper = () => (
  <>
        <ToolbarWrapper />
        <Content>
          <UsersList />
        </Content>
  </>
)

export {ProfilesListWrapper}
