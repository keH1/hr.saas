import {Config} from 'ziggy-js';
import {SideMenu} from "@/Components/MainMenu";

export interface User {
  id: number;
  global_id: string;
  name: string;
  phone: string;
  email: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>, > = T & {
  auth: {
    user: User;
  };
  mainMenu: Array<SideMenu | string>;
  ziggy: Config & { location: string };
};
