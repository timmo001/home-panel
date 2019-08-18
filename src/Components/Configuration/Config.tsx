// @flow
import { Color } from '@material-ui/core';
import { CommonColors } from '@material-ui/core/colors/common';

import { BaseProps } from '../Cards/Base';

export interface ConfigProps {
  config: any;
  editing?: any;
  handleUpdateConfig?: (path: any[], data: any) => void;
  handleConfigChange?: (config: any) => void;
}

export type PageProps = {
  name: string;
  icon: string;
};

export type GroupProps = {
  name: string;
  cards: BaseProps[];
  page: number;
  width: number;
};

export type ThemeProps = {
  name: string;
  type: string;
  primary: string | Color | CommonColors;
  secondary: string | Color | CommonColors;
  background_default: string;
  background_paper: string;
};

export const defaultPage = {
  name: 'Page',
  icon: 'file'
};

export const defaultGroup = (page: number) => ({
  name: 'Group',
  cards: [],
  page,
  width: 2
});

export const defaultCard = {
  title: 'Card',
  type: 'entity',
  content: '',
  width: 1
};

export const defaultTheme = {
  type: 'dark',
  primary: 'pink',
  secondary: 'purple',
  background_default: '#303030',
  background_paper: '#383c45'
};

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
            name: 'Midnight',
            type: 'dark',
            primary: 'pink',
            secondary: 'pink',
            background_default: '#303030',
            background_paper: '#383c45'
          }
        ],
        items: [
          {
            name: 'theme',
            title: 'Theme',
            description: 'test',
            icon: 'mdi-format-list-bulleted-type',
            type: 'object',
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
        default: 'left',
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
        default: 'left',
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
