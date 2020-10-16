import { Color } from "@material-ui/core";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import pink from "@material-ui/core/colors/pink";

import { BaseProps } from "../Cards/Base";
import { Editing } from "../Types/Types";
import makeKey from "../../utils/makeKey";

export interface ConfigProps {
  config: ConfigurationProps;
  editing: Editing;
  handleUpdateConfig: (
    path: (string | number)[],
    data?:
      | string
      | number
      | ConfigSectionItem
      | Page
      | GroupProps
      | CardProps
      | (string | number | ConfigSectionItem | Page | GroupProps | CardProps)[]
  ) => void;
  handleConfigChange: (config: ConfigurationProps) => void;
  handleSetTheme: (palette: ThemeProps) => void;
}

export type ConfigSection = {
  name: string | number;
  title: string | number;
  type: string;
  items: ConfigSectionItem[];
};

export type ConfigSectionItem = {
  key?: string;
  name: string | number;
  title: string;
  description: string;
  icon: string;
  type: string;
  default?: string | number | boolean;
  items?: (string | number | ConfigSectionItem)[];
};

export type ConfigurationProps = {
  general: General;
  theme: ThemeProps;
  header: Header;
  pages: Page[];
  groups: GroupProps[];
  cards: CardProps[];
  news: News;
};

export type General = {
  autohide_navigation: boolean;
  autohide_toolbar: boolean;
  dense_toolbar: boolean;
  drawer_type: string;
};

export type ThemeProps = {
  type: "light" | "dark";
  primary: string | Color;
  secondary: string | Color;
  background_default: string;
  background_paper: string;
  text_primary: string;
  link_color: string;
};

export type Header = {
  time_show: boolean;
  time_military: boolean;
  time_location: number;
  time_font_size: string;
  time_period_font_size: string;
  date_show: boolean;
  date_format: string;
  date_location: number;
  date_font_size: string;
};

export type Page = {
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
  width?: number;
  height?: number | string;
  square?: boolean;
  padding?: number | string;
  elevation?: number;
  background?: string;
  backgroundTemp?: string;
  icon?: string;
  icon_size?: string;
  title?: string;
  title_justify?: "left" | "center" | "right" | "justify";
  title_size?: string;
  content?: string;
  url?: string;
  domain?: string;
  entity?: string;
  state?: string | number;
  state_size?: string;
  disabled?: boolean;
  toggleable?: boolean;
  chart?: string;
  chart_detail?: number;
  chart_from?: number;
  chart_labels?: boolean;
  checklist_items?: ChecklistItem[];
  click_action?: EntityAction;
};

export interface ChecklistItem {
  key: string;
  checked: boolean;
  text: string;
}

export interface EntityAction {
  type: EntityActionType;
  service?: string;
  service_data?: string;
}

export type EntityActionType = "default" | "call-service";

export type News = {
  news_api_key: string;
};

export type CardType = {
  name: string;
  title: string;
};

export const defaultPage = (): Page => ({
  key: makeKey(16),
  name: "Page",
  icon: "file",
});

export const defaultGroup = (pageKey: string): GroupProps => ({
  key: makeKey(16),
  name: "Group",
  page: pageKey,
  width: 2,
  cards: [],
});

export const defaultCard = (groupKey: string): CardProps => ({
  key: makeKey(16),
  group: groupKey,
  title: "Card",
  type: "entity",
  elevation: 1,
  width: 1,
  height: 1,
});

export const defaultTheme: ThemeProps = {
  type: "dark",
  primary: "pink",
  secondary: "pink",
  background_default: "#303030",
  background_paper: "#383c45",
  text_primary: "#ffffff",
  link_color: "#00ccff",
};

export const defaultPalette: PaletteOptions = {
  type: "dark",
  primary: pink,
  secondary: pink,
  background: {
    default: "#303030",
    paper: "#383c45",
  },
  text: {
    primary: "#ffffff",
  },
};

export const cardTypes: CardType[] = [
  { name: "entity", title: "Entity" },
  { name: "iframe", title: "iFrame" },
  { name: "image", title: "Image" },
  { name: "markdown", title: "Markdown" },
  { name: "news", title: "News Feed" },
  { name: "rss", title: "RSS Feed" },
  { name: "checklist", title: "Checklist" },
];

export const cardTypeDefaults: { [type: string]: CardProps } = {
  entity: {
    key: "",
    group: "",
    title: cardTypes[0].title,
    type: "entity",
    elevation: 1,
    background: "",
    padding: "",
    square: false,
    width: 1,
    height: 1,
    icon: "",
    entity: "",
  },
  iframe: {
    key: "",
    group: "",
    title: "",
    type: "iframe",
    elevation: 1,
    background: "",
    padding: "0px",
    square: false,
    width: 2,
    height: "auto",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  image: {
    key: "",
    group: "",
    title: "",
    type: "image",
    elevation: 1,
    background: "",
    padding: "0px",
    square: false,
    width: 2,
    url: "https://source.unsplash.com/daily",
  },
  markdown: {
    key: "",
    group: "",
    title: cardTypes[3].title,
    type: "markdown",
    elevation: 1,
    background: "",
    padding: "",
    square: false,
    width: 2,
    height: 1,
    content: "",
  },
  news: {
    key: "",
    group: "",
    title: cardTypes[4].title,
    type: "news",
    elevation: 1,
    background: "",
    padding: "",
    square: false,
    width: 2,
    height: 3,
    url: "",
  },
  rss: {
    key: "",
    group: "",
    title: cardTypes[5].title,
    type: "rss",
    elevation: 1,
    background: "",
    padding: "",
    square: false,
    width: 2,
    height: 3,
    url: "",
  },
  checklist: {
    key: "",
    group: "",
    title: cardTypes[6].title,
    type: "checklist",
    elevation: 1,
    background: "",
    padding: "",
    square: false,
    width: 2,
    height: 3,
    checklist_items: [],
  },
};

export const colorItems: string[] = [
  "blue",
  "blueGrey",
  "brown",
  "cyan",
  "deepOrange",
  "deepPurple",
  "green",
  "grey",
  "indigo",
  "lightBlue",
  "lightGreen",
  "lime",
  "orange",
  "pink",
  "purple",
  "red",
  "teal",
  "yellow",
];

export const sections: ConfigSection[] = [
  {
    name: "general",
    title: "General",
    type: "standard",
    items: [
      {
        name: "backup_restore",
        title: "Backup and Restore Configuration",
        description:
          "Backup and Restore. Restoring will wipe your current config.",
        icon: "mdi-hammer",
        type: "backup_restore",
      },
      {
        name: "autohide_navigation",
        title: "Auto Hide Navigation",
        description: "Should the toolbar hide after a few seconds?",
        icon: "mdi-page-layout-header",
        type: "switch",
        default: true,
      },
      {
        name: "autohide_toolbar",
        title: "Auto Hide Toolbar",
        description: "Should the toolbar hide after a few seconds?",
        icon: "mdi-page-layout-header",
        type: "switch",
        default: false,
      },
      {
        name: "dense_toolbar",
        title: "Dense Toolbar",
        description: "Should the toolbar use less space?",
        icon: "mdi-page-layout-header",
        type: "switch",
        default: false,
      },
      {
        name: "drawer_type",
        title: "Drawer Type",
        description: "Type of drawer",
        icon: "mdi-page-layout-sidebar-left",
        type: "select",
        default: "default",
        items: [
          "default",
          "persistent",
          "persistent_icons_only",
          "permanent_icons_only",
        ],
      },
    ],
  },
  {
    name: "news",
    title: "News Feed",
    type: "standard",
    items: [
      {
        name: "news_api_key",
        title: "News API Key",
        description: "Your [News API](https://newsapi.org) key.",
        icon: "mdi-page-layout-header",
        type: "input_password",
        default: "",
      },
    ],
  },
  {
    name: "theme",
    title: "Theme",
    type: "standard",
    items: [
      {
        name: "type",
        title: "Type",
        description: "Light or dark base?",
        icon: "mdi-theme-light-dark",
        type: "select",
        default: "dark",
        items: ["dark", "light"],
      },
      {
        name: "primary",
        title: "Primary",
        description:
          "Primary palette. See [here](https://material-ui.com/customization/color/#color-palette) for color palette.",
        icon: "mdi-palette",
        type: "select",
        default: "pink",
        items: colorItems,
      },
      {
        name: "secondary",
        title: "Secondary",
        description:
          "Secondary palette. See [here](https://material-ui.com/customization/color/#color-palette) for color palette.",
        icon: "mdi-palette",
        type: "select",
        default: "pink",
        items: colorItems,
      },
      {
        name: "background_default",
        title: "Background",
        description: "Background color.",
        icon: "mdi-format-color-fill",
        type: "color",
        default: "#303030",
      },
      {
        name: "background_paper",
        title: "Paper",
        description: "Card color.",
        icon: "mdi-card-bulleted",
        type: "color",
        default: "#383c45",
      },
      {
        name: "text_primary",
        title: "Text",
        description: "Text color.",
        icon: "mdi-text",
        type: "color_only",
        default: "#ffffff",
      },
      {
        name: "link_color",
        title: "Link",
        description:
          "[Link](https://home-panel-docs.timmo.dev/configui/) color.",
        icon: "mdi-link",
        type: "color_only",
        default: "#00ccff",
      },
    ],
  },
  {
    name: "header",
    title: "Header",
    type: "standard",
    items: [
      {
        name: "time_show",
        title: "Show Time",
        description: "Show the time?",
        icon: "mdi-progress-clock",
        type: "switch",
        default: true,
      },
      {
        name: "time_military",
        title: "Military Time",
        description: "Should time be using the 24 hour clock?",
        icon: "mdi-clock-outline",
        type: "switch",
        default: false,
      },
      {
        name: "time_location",
        title: "Time Location",
        description: "Where should the time be shown?",
        icon: "mdi-format-horizontal-align-center",
        type: "radio",
        default: 0,
        items: ["Left", "Center", "Right"],
      },
      {
        name: "time_font_size",
        title: "Time Font Size",
        description: "Custom font size for Time.",
        icon: "mdi-text",
        type: "input",
        default: "",
      },
      {
        name: "time_period_font_size",
        title: "Time Period Font Size",
        description: "Custom font size for Time period (non-military time).",
        icon: "mdi-text",
        type: "input",
        default: "",
      },
      {
        name: "date_show",
        title: "Show Date",
        description: "Show the date?",
        icon: "mdi-calendar",
        type: "switch",
        default: true,
      },
      {
        name: "date_format",
        title: "Date format",
        description:
          "Format of the date. See [here](https://momentjs.com/docs/#/displaying/format) for options.",
        icon: "mdi-calendar-range",
        type: "input",
        default: "Do MMMM YYYY",
      },
      {
        name: "date_location",
        title: "Date Location",
        description: "Where should the date be shown?",
        icon: "mdi-format-horizontal-align-center",
        type: "radio",
        default: 1,
        items: ["Left", "Center", "Right"],
      },
      {
        name: "date_font_size",
        title: "Date Font Size",
        description: "Custom font size for Date.",
        icon: "mdi-text",
        type: "input",
        default: "",
      },
    ],
  },
];
