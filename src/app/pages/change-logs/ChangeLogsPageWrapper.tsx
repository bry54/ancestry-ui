import {FC} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import {ChangeLogsPage} from './ChangeLogsPage.tsx'

const ChangeLogsPageWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>Change Logs</PageTitle>
      <ChangeLogsPage />
    </>
  )
}

export default ChangeLogsPageWrapper
