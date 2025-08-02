import {FC} from 'react'
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {PrivateRoutes} from './PrivateRoutes'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {Logout, AuthPage, useAuth} from '../modules/auth'
import {App} from '../App'

const {BASE_URL} = import.meta.env

const AppRoutes: FC = () => {
  const {currentUser} = useAuth()

    console.log('APP_ROUES', currentUser)
  return (
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          {currentUser && currentUser.role ? (
            <>
              {/* User is logged in and has a role */}
              <Route path='/*' element={<PrivateRoutes />} />
              <Route index element={<Navigate to='/dashboard' />} />
            </>
          ) : (
            <>
              {/* User is not logged in or has no role */}
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to={currentUser ? '/auth/select-role' : '/auth'} />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}
