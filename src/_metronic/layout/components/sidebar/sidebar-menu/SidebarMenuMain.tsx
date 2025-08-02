import {SidebarMenuItem} from "./SidebarMenuItem.tsx";
import {KTIcon} from "../../../../helpers";
import {useIntl} from "react-intl";
import {useAuth} from "../../../../../app/modules/auth";

const SidebarMenuMain = () => {
    const intl = useIntl()
    const {currentUser} = useAuth()

    return (
        <>
        <SidebarMenuItem
            to='/dashboard'
            icon='element-11'
            title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
            fontIcon='bi-app-indicator'
        />
        <SidebarMenuItem
            to='/tree-search'
            icon='search-list'
            title={intl.formatMessage({id: 'MENU.TREE_SEARCH'})}
            fontIcon='bi-tree'
        />

        <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
                    <span className='menu-section text-muted text-uppercase fs-8 ls-1'>
                        {intl.formatMessage({id: 'MENU.MANAGE'})}
                    </span>
            </div>
        </div>

            <SidebarMenuItem
                to='/apps/user-management/users'
                icon='profile-user'
                title={intl.formatMessage({id: 'MENU.PROFILE_I_MANAGE'})}
                fontIcon='bi-layers'
            />
        <SidebarMenuItem
            to='/tree-search'
            icon='sms'
            title={intl.formatMessage({id: 'MENU.INVITATIONS'})}
            fontIcon='bi-tree'
        />
        <SidebarMenuItem
            to='/tree-search'
            icon='information'
            title={intl.formatMessage({id: 'MENU.HELP_SUPPORT'})}
            fontIcon='bi-tree'
        />

        <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
                <span className='menu-section text-muted text-uppercase fs-8 ls-1'>{intl.formatMessage({id: 'MENU.ADMIN'})}</span>
            </div>
        </div>
        <SidebarMenuItem
            to='/apps/user-management/users'
            icon='user'
            title={intl.formatMessage({id: 'MENU.USER_MANAGEMENT'})}
            fontIcon='bi-layers'
        />
        <SidebarMenuItem
            to='/tree-search'
            icon='bank'
            title={intl.formatMessage({id: 'MENU.GOVERNMENT_APPROVALS'})}
            fontIcon='bi-tree'
        />
        <SidebarMenuItem
            to='/tree-search'
            icon='notepad'
            title={intl.formatMessage({id: 'MENU.AUDIT_LOGS'})}
            fontIcon='bi-tree'
        />
        <SidebarMenuItem
            to='/tree-search'
            icon='graph-up'
            title={intl.formatMessage({id: 'MENU.SYSTEM_STATUS'})}
            fontIcon='bi-tree'
        />
        <div className='menu-item'>
            <a
                target='_blank'
                className='menu-link'
                href={ '/changelog'}
            >
          <span className='menu-icon'>
            <KTIcon iconName='code' className='fs-2' />
          </span>
                <span className='menu-title'>{intl.formatMessage({id: 'MENU.CHANGE_LOG'})} {import.meta.env.VITE_APP_VERSION}</span>
            </a>
        </div>
    </>)
}

export {SidebarMenuMain}
