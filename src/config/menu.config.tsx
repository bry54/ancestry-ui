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
  { title: 'Dashboard', icon: LucideLayoutDashboard, path: '' },
  { heading: 'User' },
  { title: 'Profiles', icon: PeopleIcon, path: '' },
  { title: 'Invitations/Relationships', icon: Send, path: '' },
  { heading: 'Family & Network' },
  { title: 'Tree Explorer', icon: GitBranch, path: '' },
  { title: 'Relationship Graph', icon: ListTree, path: '' },
  { title: 'Name Distribution', icon: Tags, path: '' },
  { title: 'Family Size', icon: PieChart, path: '' },
  { heading: 'Admin' },
  { title: 'User Management', icon: UserCog, path: '' },
  { title: 'Government Approvals', icon: ShieldUser, path: '' },
  { title: 'Audit Logs', icon: ScrollText, path: '' },
  { heading: 'Help & Support' },
  { title: 'System Status', icon: ListChecks, path: '' },
  { title: 'Change Logs', icon: FileCode, path: '' },
  { title: 'Help', icon: ShieldQuestionMark, path: '' },
];

export const MENU_MEGA: MenuConfig = [{ title: 'Home', path: '/' }];

export const MENU_MEGA_MOBILE: MenuConfig = [{ title: 'Home', path: '/' }];
