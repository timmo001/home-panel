import { Page } from '../Types/Types';

export interface DrawerItem {
  name: Page;
  icon: string;
  menuItems?: MenuItem[];
}

export interface MenuItem {
  name: string;
  icon: string;
}

const Items: DrawerItem[] = [
  {
    name: 'Overview',
    icon: 'mdi-view-dashboard',
    menuItems: [{ name: 'Edit', icon: 'mdi-pencil' }],
  },
  {
    name: 'Configuration',
    icon: 'mdi-cog',
  },
];

export default Items;
