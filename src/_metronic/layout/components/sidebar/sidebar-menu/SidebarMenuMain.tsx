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
                to='/connections-map'
                icon='technology-2'
                title={intl.formatMessage({id: 'MENU.CONNECTIONS_MAP'})}
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
                to='/profile/profiles'
                icon='profile-user'
                title={intl.formatMessage({id: 'MENU.PROFILE_I_MANAGE'})}
                fontIcon='bi-layers'
            />
            <SidebarMenuItem
                to='/invitations'
                icon='sms'
                title={intl.formatMessage({id: 'MENU.INVITATIONS'})}
                fontIcon='bi-tree'
            />
            <SidebarMenuItem
                to='/help-support'
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
                to='/user/users'
                icon='user'
                title={intl.formatMessage({id: 'MENU.USER_MANAGEMENT'})}
                fontIcon='bi-layers'
            />
            <SidebarMenuItem
                to='/registry-approvals'
                icon='bank'
                title={intl.formatMessage({id: 'MENU.REGISTRY_APPROVALS'})}
                fontIcon='bi-tree'
            />
            <SidebarMenuItem
                to='/audit-logs'
                icon='notepad'
                title={intl.formatMessage({id: 'MENU.AUDIT_LOGS'})}
                fontIcon='bi-tree'
            />

            <div className='menu-item'>
                <div className='menu-content pt-8 pb-2'>
                    <span className='menu-section text-muted text-uppercase fs-8 ls-1'>{intl.formatMessage({id: 'MENU.TECHNICAL_INFO'})}</span>
                </div>
            </div>

            <SidebarMenuItem
                to='/system-status'
                icon='graph-up'
                title={intl.formatMessage({id: 'MENU.SYSTEM_STATUS'})}
                fontIcon='bi-tree'
            />

            <SidebarMenuItem
                to='/change-logs'
                icon='code'
                title={`${intl.formatMessage({id: 'MENU.CHANGE_LOG'})} v${import.meta.env.VITE_APP_VERSION}`}
                fontIcon='bi-tree'
            />
        </>)
}

export {SidebarMenuMain}
