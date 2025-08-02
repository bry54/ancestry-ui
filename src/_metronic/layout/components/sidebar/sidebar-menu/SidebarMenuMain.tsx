import {useAuth} from "../../../../../app/modules/auth";
import {AdminMenu} from "./menus/AdminMenu.tsx";
import {ViewerMenu} from "./menus/ViewerMenu.tsx";

const SidebarMenuMain = () => {

    const {currentUser} = useAuth()

    if (!currentUser?.role === 'ADMINS') {
        return (<AdminMenu/>)
    } else {
        return (<ViewerMenu/>)
    }
}

export {SidebarMenuMain}
