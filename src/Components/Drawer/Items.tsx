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
    link: 'overview',
    icon: 'mdi-view-dashboard',
    menuItems: [{ name: 'Edit', link: 'edit', icon: 'mdi-pencil' }]
  },
  {
    name: 'Configuration',
    link: 'configuration',
    icon: 'mdi-settings'
  }
];
