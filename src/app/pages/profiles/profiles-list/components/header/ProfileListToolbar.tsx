import {KTIcon} from '../../../../../../_metronic/helpers'

const ProfileListToolbar = () => {
  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      {/* begin::Export */}
      <button type='button' className='btn btn-light-primary me-3'>
        <KTIcon iconName='exit-up' className='fs-2' />
        Export
      </button>
      {/* end::Export */}

      {/* begin::Add user */}
      <button type='button' className='btn btn-primary' onClick={() => alert('Implement add user drawer')}>
        <KTIcon iconName='plus' className='fs-2' />
        Add User
      </button>
      {/* end::Add user */}
    </div>
  )
}

export {ProfileListToolbar}
