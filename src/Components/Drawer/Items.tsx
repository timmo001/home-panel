// @flow
export interface ItemsProps {
  name: string;
  link: string;
  icon: string;
  menuItems?: MenuItemsProps[];
}

export interface MenuItemsProps {
  name: string;
  link: string;
  icon: string;
}

export default [
  {
    name: 'Overview',
    link: '/',
    icon: 'mdi-view-dashboard',
    menuItems: [{ name: 'Edit', link: '?edit=true', icon: 'mdi-pencil' }]
  },
  {
    name: 'Configuration',
    link: '/configuration',
    icon: 'mdi-settings'
  }
];
