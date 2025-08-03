import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'

import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import ConnectionsMapPage from "../pages/connections-map/ConnectionsMapPage.tsx";

const PrivateRoutes = () => {
    const ProfileManagementWrapper = lazy(() => import('../pages/profiles/ProfilesPage.tsx'))
    const UsersPage = lazy(() => import('../pages/user-management/UsersPage'))
    const DashboardWrapper = lazy(() =>import('../pages/dashboard/DashboardWrapper'))
    const AccountPage = lazy(() => import('../pages/accounts/AccountPage'))
    const ConectionsMapPage = lazy(() => import('../pages/connections-map/ConnectionsMapPage.tsx'))
    const HelpSupportWrapper = lazy(() => import('../pages/help-support/HelpSupportPageWrapper.tsx'))
    const RegistryApprovalsWrapper = lazy(() => import('../pages/registry-approvals/RegistryApprovalsPageWrapper.tsx'))
    const AuditLogsWrapper = lazy(() => import('../pages/audit-logs/AuditLogsPageWrapper.tsx'))
    const InvitationsWrapper = lazy(() => import('../pages/invitations/InvitationsPageWrapper.tsx'))
    const SystemStatusWrapper = lazy(() => import('../pages/system-status/SystemStatusPageWrapper.tsx'))
    const ChangeLogWrapper = lazy(() => import('../pages/change-logs/ChangeLogsPageWrapper.tsx'))


    return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
          {/* Lazy Modules */}

          <Route path='dashboard' element={<SuspensedView><DashboardWrapper /></SuspensedView>} />

        <Route
          path='/profile/*'
          element={
            <SuspensedView>
              <ProfileManagementWrapper />
            </SuspensedView>
          }
        />
          <Route
              path='/user/*'
              element={
                  <SuspensedView>
                      <UsersPage />
                  </SuspensedView>
              }
          />
          <Route
              path='help-support'
              element={
                  <SuspensedView>
                      <HelpSupportWrapper />
                  </SuspensedView>
              } />
          <Route
              path='system-status'
              element={
                  <SuspensedView>
                      <SystemStatusWrapper />
                  </SuspensedView>
              } />

          <Route
              path='registry-approvals'
              element={
                  <SuspensedView>
                      <RegistryApprovalsWrapper />
                  </SuspensedView>
              } />
          <Route
              path='audit-logs'
              element={
                  <SuspensedView>
                      <AuditLogsWrapper />
                  </SuspensedView>
              } />
          <Route
              path='invitations'
              element={
                  <SuspensedView>
                      <InvitationsWrapper />
                  </SuspensedView>
              } />

          <Route
              path='account/*'
              element={
                  <SuspensedView>
                      <AccountPage />
                  </SuspensedView>
              }
          />

          <Route
              path='connections-map/*'
              element={
                  <SuspensedView>
                      <ConnectionsMapPage />
                  </SuspensedView>
              }
          />

          <Route
              path='change-logs'
              element={
                  <SuspensedView>
                      <ChangeLogWrapper />
                  </SuspensedView>
              }
          />

        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
