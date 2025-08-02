import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {ProfilesListWrapper} from './profiles-list/ProflesList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Profile Management',
    path: '/profile/profiles',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const ProfilesPage = () => {
  return (
      <Routes>
        <Route element={<Outlet />}>
          <Route
              path='profiles'
              element={
                <>
                  <PageTitle breadcrumbs={usersBreadcrumbs}>Profiles Person List</PageTitle>
                  <ProfilesListWrapper />
                </>
              }
          />
        </Route>
        <Route index element={<Navigate to='/profile/profiles' />} />
      </Routes>
  )
}

export default ProfilesPage
