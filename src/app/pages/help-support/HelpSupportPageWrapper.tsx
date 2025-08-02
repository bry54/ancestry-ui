import {FC} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import {HelpSupportPage} from './HelpSupportPage.tsx'

const HelpSupportPageWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>Help & Support</PageTitle>
      <HelpSupportPage />
    </>
  )
}

export default HelpSupportPageWrapper
