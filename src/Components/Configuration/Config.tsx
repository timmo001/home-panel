// @flow
import { BaseProps } from '../Cards/Base';

export interface ConfigProps {
  config: any;
  editing?: any;
  handleUpdateConfig?: (path: any[], data: any) => void;
  handleConfigChange?: (config: any) => void;
}

export type GroupProps = {
  name: string;
  cards: BaseProps[];
  page: number;
  width: number;
};

export const defaultGroup = (page: number) => ({
  name: 'New group',
  cards: [],
  page,
  width: 2
});

export const defaultCard = {
  title: 'New card',
  type: 'entity',
  content: '',
  width: 1
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
