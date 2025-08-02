import {useIntl} from 'react-intl'
import {KTIcon} from '../../../../../helpers'
import {SidebarMenuItemWithSub} from '../SidebarMenuItemWithSub'
import {SidebarMenuItem} from '../SidebarMenuItem'

const ViewerMenu = () => {
    const intl = useIntl()

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
                icon='filter-search'
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
                to='/tree-search'
                icon='element-plus'
                title={intl.formatMessage({id: 'MENU.MY_PROFILES'})}
                fontIcon='bi-tree'
            />
            <SidebarMenuItem
                to='/tree-search'
                icon='element-plus'
                title={intl.formatMessage({id: 'MENU.RELATIONSHIPS'})}
                fontIcon='bi-tree'
            />
            <SidebarMenuItem
                to='/tree-search'
                icon='element-plus'
                title={intl.formatMessage({id: 'MENU.INVITATIONS'})}
                fontIcon='bi-tree'
            />
            <SidebarMenuItem
                to='/tree-search'
                icon='element-plus'
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
                icon='abstract-28'
                title='User management'
                fontIcon='bi-layers'
            />
            <SidebarMenuItem
                to='/tree-search'
                icon='element-plus'
                title={intl.formatMessage({id: 'MENU.GOVERNMENT_APPROVALS'})}
                fontIcon='bi-tree'
            />
            <SidebarMenuItem
                to='/tree-search'
                icon='element-plus'
                title={intl.formatMessage({id: 'MENU.AUDIT_LOGS'})}
                fontIcon='bi-tree'
            />
            <SidebarMenuItem
                to='/tree-search'
                icon='element-plus'
                title={intl.formatMessage({id: 'MENU.SYSTEM_STATUS'})}
                fontIcon='bi-tree'
            />
            <div className='menu-item'>
                <a
                    target='_blank'
                    className='menu-link'
                    href={import.meta.env.VITE_APP_PREVIEW_DOCS_URL + '/changelog'}
                >
          <span className='menu-icon'>
            <KTIcon iconName='code' className='fs-2' />
          </span>
                    <span className='menu-title'>Changelog {import.meta.env.VITE_APP_VERSION}</span>
                </a>
            </div>
        </>
    )
}

export {ViewerMenu}
