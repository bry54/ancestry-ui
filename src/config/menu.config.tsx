import {
  FileCode,
  GitBranch,
  ListChecks,
  ListTree,
  LucideLayoutDashboard,
  Users as PeopleIcon,
  PieChart,
  ScrollText,
  Send,
  ShieldQuestionMark,
  ShieldUser,
  Tags,
  UserCog,
} from 'lucide-react';
import { type MenuConfig } from './types';

export const MENU_SIDEBAR: MenuConfig = [
  { title: 'Dashboard', icon: LucideLayoutDashboard, path: '/' },
  { heading: 'User' },
  { title: 'Profiles', icon: PeopleIcon, path: '/user/profiles' },
  { title: 'My Connections', icon: Send, path: '/user/connections' },
  { heading: 'Family & Network' },
  { title: 'Tree Explorer', icon: GitBranch, path: '/network/tree-explorer' },
  {
    title: 'Relationship Graph',
    icon: ListTree,
    path: '/network/relations-graph',
  },
  {
    title: 'Name Distribution',
    icon: Tags,
    path: '/network/name-distribution',
  },
  { title: 'Family Size', icon: PieChart, path: '/network/family-size' },
  { heading: 'Admin' },
  { title: 'User Management', icon: UserCog, path: '/admin/user-management' },
  {
    title: 'Government Approvals',
    icon: ShieldUser,
    path: '/admin/government-approvals',
  },
  { title: 'Audit Logs', icon: ScrollText, path: '/admin/audit-logs' },
  { heading: 'Help & Support' },
  { title: 'System Status', icon: ListChecks, path: '/system/status' },
  { title: 'Change Logs', icon: FileCode, path: '/system/change-logs' },
  { title: 'Help', icon: ShieldQuestionMark, path: '/system/help' },
];

export const MENU_MEGA: MenuConfig = [{ title: 'Home', path: '/' }];

export const MENU_MEGA_MOBILE: MenuConfig = [{ title: 'Home', path: '/' }];
