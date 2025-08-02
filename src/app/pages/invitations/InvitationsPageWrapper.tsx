import {FC} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import {InvitationsPage} from './InvitationsPage.tsx'

const InvitationsPageWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>Invitations</PageTitle>
      <InvitationsPage />
    </>
  )
}

export default InvitationsPageWrapper
