import {FC} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import {AuditLogsPage} from './AuditLogsPage.tsx'

const AuditLogsPageWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>Audit Logs</PageTitle>
      <AuditLogsPage />
    </>
  )
}

export default AuditLogsPageWrapper
