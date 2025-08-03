import {FC} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import {Link} from 'react-router-dom'
import {Dropdown1} from '../../../_metronic/partials'
import {useLocation} from 'react-router'
import {Content} from '../../../_metronic/layout/components/content'
import {useIntl} from "react-intl";

const ConnectionsMapHeader: FC = () => {
  const location = useLocation()
  const intl = useIntl()

  return (
    <>
      <Content>
        <div className='card mb-1 mb-xl-5'>
          <div className='card-body pt-9 pb-0'>
            <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
              <div className='me-7 mb-4'>
                <div className='symbol symbol-sm symbol-fixed position-relative'>
                  <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt='Metronic' />
                  <div className='position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px'></div>
                </div>
              </div>

              <div className='flex-grow-1'>
                <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
                  <div className='d-flex flex-column'>
                    <div className='d-flex align-items-center mb-2'>
                      <a href='#' className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'>
                        Max Smith
                      </a>
                      <a href='#'>
                        <KTIcon iconName='verify' className='fs-1 text-primary' />
                      </a>
                      <a
                        href='#'
                        className='btn btn-sm btn-light-success fw-bolder ms-2 fs-8 py-1 px-3'
                        data-bs-toggle='modal'
                        data-bs-target='#kt_modal_upgrade_plan'
                      >
                        Upgrade to Pro
                      </a>
                    </div>

                    <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                      <a
                        href='#'
                        className='d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2'
                      >
                        <KTIcon iconName='profile-circle' className='fs-4 me-1' />
                        Developer
                      </a>
                      <a
                        href='#'
                        className='d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2'
                      >
                        <KTIcon iconName='geolocation' className='fs-4 me-1' />
                        SF, Bay Area
                      </a>
                      <a
                        href='#'
                        className='d-flex align-items-center text-gray-500 text-hover-primary mb-2'
                      >
                        <KTIcon iconName='sms' className='fs-4 me-1' />
                        max@kt.com
                      </a>
                    </div>
                  </div>

                  <div className='d-flex my-4'>
                    <a href='#' className='btn btn-sm btn-light me-2' id='kt_user_follow_button'>
                      <KTIcon iconName='check' className='fs-3 d-none' />

                      <span className='indicator-label'>Follow</span>
                      <span className='indicator-progress'>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    </a>
                    <a
                      href='#'
                      className='btn btn-sm btn-primary me-3'
                      data-bs-toggle='modal'
                      data-bs-target='#kt_modal_offer_a_deal'
                    >
                      Hire Me
                    </a>
                    <div className='me-0'>
                      <button
                        className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                        data-kt-menu-flip='top-end'
                      >
                        <i className='bi bi-three-dots fs-3'></i>
                      </button>
                      <Dropdown1 />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='d-flex overflow-auto h-35px'>
              <ul className='text-uppercase nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname === '/connections-map/overview' && 'active')
                    }
                    to='/connections-map/overview'
                  >
                    {intl.formatMessage({id: 'CONNECTIONS_MAP.OVERVIEW'})}
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                      className={
                          `nav-link text-active-primary me-6 ` +
                          (location.pathname === '/connections-map/family-names' && 'active')
                      }
                      to='/connections-map/family-names'
                  >
                    {intl.formatMessage({id: 'CONNECTIONS_MAP.NAME_DISTRIBUTION'})}
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                      className={
                          `nav-link text-active-primary me-6 ` +
                          (location.pathname === '/connections-map/family-size' && 'active')
                      }
                      to='/connections-map/family-size'
                  >
                    {intl.formatMessage({id: 'CONNECTIONS_MAP.FAMILY_SIZE'})}
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname === '/connections-map/parent-child' && 'active')
                    }
                    to='/connections-map/parent-child'
                  >
                    {intl.formatMessage({id: 'CONNECTIONS_MAP.PARENT_CHILD'})}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Content>
    </>
  )
}

export {ConnectionsMapHeader}
