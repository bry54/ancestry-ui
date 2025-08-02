import {ProfileListToolbar} from './ProfileListToolbar.tsx'

const ProfilesListHeader = () => {
  return (
    <div className='card-header border-0 pt-6'>
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        <ProfileListToolbar />
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {ProfilesListHeader}
