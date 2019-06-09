// @flow
import { CardBaseProps } from '../../Components/Cards/CardBase';

export interface ConfigProps {
  config: any;
  handleUpdateConfig?: (path: any[], data: any) => void;
  handleConfigChange?: (config: any) => void;
}

export type GroupProps = {
  name: string;
  cards: CardBaseProps[];
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
  type: 'markdown',
  content: ''
};

export const items = [
  {
    name: 'general',
    title: 'General',
    items: [
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
        icon: 'mdi-clock-outline',
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
        name: 'sensors_show',
        title: 'Show Sensors',
        description: 'Show the sensors?',
        icon: 'mdi-thermometer',
        type: 'switch',
        default: true
      }
    ]
  }
];

// "header": {
//   "time": {
//     "disable": false,
//     "military": false
//   },
//   "date": {
//     "disable": false,
//     "format": "Do MMMM YYYY"
//   },
//   "left_outdoor_weather": {
//     "dark_sky_icon": "sensor.dark_sky_icon",
//     "condition": "",
//     "data": [
//       {
//         "entity_id": "",
//         "unit_of_measurement": ""
//       }
//     ]
//   },
//   "right_indoor": [
//     {
//       "label": "",
//       "data": [
//         {
//           "entity_id": "",
//           "unit_of_measurement": ""
//         }
//       ]
//     }
//   ]
// },
