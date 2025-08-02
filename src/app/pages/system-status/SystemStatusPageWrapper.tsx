import {FC} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import {SystemStatusPage} from './SystemStatusPage.tsx'

const SystemStatusPageWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>System Status</PageTitle>
      <SystemStatusPage />
    </>
  )
}

export default SystemStatusPageWrapper
