import {Config} from 'ziggy-js';
import {SideMenu} from "@/Components/MainMenu";
import Plots = App.Data.Tenant.Frontend.Table.Plots;

export interface User {
  id: number;
  global_id: string;
  name: string;
  phone: string;
  email: string;
}

export interface ListPageProps {
  defaultPerPage: number;
  defaultOnPage: Array<number>;
}

export interface QueryParameters {
  q: string;
  pp: number;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>, > = T & {
  auth: {
    user: User;
  };
  mainMenu: Array<SideMenu | string>;
  ziggy: Config & { location: string };
  listPageProps: ListPageProps;
  queryParams: QueryParameters;
};
