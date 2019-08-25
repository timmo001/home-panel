// @flow
import { Color } from '@material-ui/core';
import { CommonColors } from '@material-ui/core/colors/common';

import { BaseProps } from '../Cards/Base';
import makeKey from '../Utils/makeKey';

export interface ConfigProps {
  config: ConfigurationProps;
  editing: number;
  back?: boolean;
  handleUpdateConfig?: (path: any[], data?: any) => void;
  handleConfigChange?: (config: ConfigurationProps) => void;
  handleSetBack?: (back: boolean) => void;
  handleSetTheme?: (palette: ThemesProps) => void;
}

export type ConfigurationProps = {
  general: GeneralProps;
  theme: ThemeProps;
  header: HeaderProps;
  pages: [PageProps];
  groups: [GroupProps];
  cards: [CardProps];
};

export type GeneralProps = {
  autohide_toolbar: boolean;
  dense_toolbar: boolean;
};

export type ThemeProps = {
  current: string;
  themes: [ThemesProps];
};

export type HeaderProps = {
  time_show: boolean;
  time_military: boolean;
  time_location: number;
  date_show: boolean;
  date_format: string;
  date_location: number;
};

export type PageProps = {
  key: string;
  name: string;
  icon: string;
};

export type GroupProps = {
  key: string;
  page: string;
  name: string;
  cards: BaseProps[];
  width: number;
};

export type CardProps = {
  key: string;
  group: string;
  type: string;
  width: number;
  height?: number;
  square?: boolean;
  padding?: number;
  elevation?: number;
  background?: string;
  title?: string;
  content?: string;
  url?: string;
  domain?: string;
  entity?: string;
  state?: string | boolean;
  disabled?: boolean;
  toggleable?: boolean;
};

export type ThemesProps = {
  key: string;
  name: string;
  type: string;
  primary: string | Color | CommonColors;
  secondary: string | Color | CommonColors;
  background_default: string;
  background_paper: string;
};

export const defaultPage = () => ({
  key: makeKey(16),
  name: 'Page',
  icon: 'file'
});

export const defaultGroup = (pageKey: string) => ({
  key: makeKey(16),
  name: 'Group',
  page: pageKey,
  width: 2
});

export const defaultCard = (groupKey: string) => ({
  key: makeKey(16),
  group: groupKey,
  title: 'Card',
  type: 'entity',
  width: 1
});

export const defaultTheme = () => ({
  key: makeKey(16),
  name: 'Theme',
  type: 'dark',
  primary: 'pink',
  secondary: 'purple',
  background_default: '#303030',
  background_paper: '#383c45'
});

export const items = [
  {
    name: 'general',
    title: 'General',
    items: [
      {
        name: 'autohide_toolbar',
        title: 'Auto Hide Toolbar',
        description: 'Should the toolbar hide after a given time?',
        icon: 'mdi-page-layout-header',
        type: 'switch',
        default: false
      },
      {
        name: 'dense_toolbar',
        title: 'Dense Toolbar',
        description: 'Should the toolbar use less space?',
        icon: 'mdi-page-layout-header',
        type: 'switch',
        default: false
      }
    ]
  },
  {
    name: 'theme',
    title: 'Theme',
    items: [
      {
        name: 'current',
        title: 'Current Theme',
        description: 'Current theme?',
        icon: 'mdi-compare',
        type: 'theme',
        default: 0
      },
      {
        name: 'themes',
        title: 'Themes',
        description: 'Configured themes.',
        icon: 'mdi-format-list-bulleted-type',
        type: 'array',
        default: [
          {
            name: 'Theme',
            type: 'dark',
            primary: 'pink',
            secondary: 'pink',
            background_default: '#303030',
            background_paper: '#383c45'
          }
        ],
        items: [
          {
            name: 'name',
            title: 'Name',
            description: 'Theme name.',
            icon: 'mdi-rename-box',
            type: 'input',
            default: 'Midnight'
          },
          {
            name: 'type',
            title: 'Type',
            description: 'Light or dark? (`light` or `dark`)',
            icon: 'mdi-theme-light-dark',
            type: 'input',
            default: 'dark'
          },
          {
            name: 'primary',
            title: 'Primary',
            description:
              'Primary palette. See [here](https://material-ui.com/customization/color/#color-palette) for available names.',
            icon: 'mdi-palette',
            type: 'input',
            default: 'pink'
          },
          {
            name: 'secondary',
            title: 'Secondary',
            description:
              'Secondary palette. See [here](https://material-ui.com/customization/color/#color-palette) for available names.',
            icon: 'mdi-palette',
            type: 'input',
            default: 'pink'
          },
          {
            name: 'background_default',
            title: 'Background',
            description: 'Background color.',
            icon: 'mdi-format-color-fill',
            type: 'input',
            default: '#303030'
          },
          {
            name: 'background_paper',
            title: 'Paper',
            description: 'Card color.',
            icon: 'mdi-card-bulleted',
            type: 'input',
            default: '#383c45'
          }
        ]
      }
    ]
  },
  {
    name: 'header',
    title: 'Header',
    items: [
      {
        name: 'time_show',
        title: 'Show Time',
        description: 'Show the time?',
        icon: 'mdi-progress-clock',
        type: 'switch',
        default: true
      },
      {
        name: 'time_military',
        title: 'Military Time',
        description: 'Should time be using the 24 hour clock?',
        icon: 'mdi-clock-outline',
        type: 'switch',
        default: false
      },
      {
        name: 'time_location',
        title: 'Time Location',
        description: 'Where should the time be shown?',
        icon: 'mdi-format-horizontal-align-center',
        type: 'radio',
        default: '0',
        items: [
          {
            name: '0',
            title: 'Left'
          },
          {
            name: '1',
            title: 'Center'
          },
          {
            name: '2',
            title: 'Right'
          }
        ]
      },
      {
        name: 'date_show',
        title: 'Show Date',
        description: 'Show the date?',
        icon: 'mdi-calendar',
        type: 'switch',
        default: true
      },
      {
        name: 'date_format',
        title: 'Date format',
        description:
          'Format of the date. See [here](https://momentjs.com/docs/#/displaying/format) for options.',
        icon: 'mdi-calendar-range',
        type: 'input',
        default: 'Do MMMM YYYY'
      },
      {
        name: 'date_location',
        title: 'Date Location',
        description: 'Where should the date be shown?',
        icon: 'mdi-format-horizontal-align-center',
        type: 'radio',
        default: '1',
        items: [
          {
            name: '0',
            title: 'Left'
          },
          {
            name: '1',
            title: 'Center'
          },
          {
            name: '2',
            title: 'Right'
          }
        ]
      }
    ]
  }
];
