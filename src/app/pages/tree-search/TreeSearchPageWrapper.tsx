import {FC} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import {TreeSearchPage} from './TreeSearchPage.tsx'

const TreeSearchPageWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>Layout Builder</PageTitle>
      <TreeSearchPage />
    </>
  )
}

export default TreeSearchPageWrapper
