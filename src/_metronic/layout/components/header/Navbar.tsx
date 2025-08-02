import clsx from 'clsx'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {HeaderUserMenu} from '../../../partials'
import {useLayout} from '../../core'
import {useAuth} from "../../../../app/modules/auth";

const itemClass = 'ms-1 ms-md-4'
const userAvatarClass = 'symbol-35px'
const btnIconClass = 'fs-2'

const Navbar = () => {
    const {currentUser} = useAuth()
  const {config} = useLayout()
  return (
    <div className='app-navbar flex-shrink-0'>

        <div className={clsx('app-navbar-item', itemClass)}>
            <div className='d-flex flex-column'>
                <div className='fw-bolder d-flex align-items-center fs-5'>
                    {currentUser?.displayName}
                    <span className='badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2'>Pro</span>
                </div>
                <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
                    {currentUser?.email}
                </a>
            </div>
        </div>

      <div className={clsx('app-navbar-item', itemClass)}>
        <div
          className={clsx('cursor-pointer symbol', userAvatarClass)}
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
        >
          <img src={currentUser?.photoURL ? currentUser.photoURL : toAbsoluteUrl('media/avatars/300-3.jpg')} alt='' />
        </div>
        <HeaderUserMenu />
      </div>

      {config.app?.header?.default?.menu?.display && (
        <div className='app-navbar-item d-lg-none ms-2 me-n3' title='Show header menu'>
          <div
            className='btn btn-icon btn-active-color-primary w-35px h-35px'
            id='kt_app_header_menu_toggle'
          >
            <KTIcon iconName='text-align-left' className={btnIconClass} />
          </div>
        </div>
      )}
    </div>
  )
}

export {Navbar}
