import {FC} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import {ProfileManagementPage} from './ProfileManagementPage.tsx'

const ProfileManagementPageWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>System Status</PageTitle>
      <ProfileManagementPage />
    </>
  )
}

export default ProfileManagementPageWrapper
