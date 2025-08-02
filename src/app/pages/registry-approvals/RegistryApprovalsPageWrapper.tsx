import {FC} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import {RegistryApprovalsPage} from './RegistryApprovalsPage.tsx'

const RegistryApprovalsPageWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>Registry Approvals</PageTitle>
      <RegistryApprovalsPage />
    </>
  )
}

export default RegistryApprovalsPageWrapper
