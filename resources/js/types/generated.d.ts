declare namespace App.Data.Tenant {
  export type Gardener = {
    id: number;
    last_name: string;
    first_name: string;
    middle_name: string | null;
    residence_address: string;
    mailing_address: string | null;
    is_member: boolean;
    membership_start_date: string | null;
    membership_end_date: string | null;
    archived: boolean;
    ownership_percentage: number;
    created_at: string;
    updated_at: string;
  };
  export type Plot = {
    id: number;
    plot_number: number;
    street_id: number;
    street: App.Data.Tenant.Street;
    owners: Array<App.Data.Tenant.Gardener> | null;
    area: number;
    cadastre_number: string;
    created_at: string;
    updated_at: string;
  };
  export type Street = {
    id: number;
    name: string;
  };
}
declare namespace App.Data.Tenant.Frontend {
  export type PaginationLinks = {
    label: string;
    url: string | null;
    active: boolean;
  };
}
declare namespace App.Data.Tenant.Frontend.Table {
  export type Plots = {
    data: Array<App.Data.Tenant.Plot> | null;
    current_page: number;
    first_page_url: string | null;
    from: number | null;
    last_page: number | null;
    last_page_url: string;
    links: Array<App.Data.Tenant.Frontend.PaginationLinks> | null;
    next_page_url: string | null;
    path: string | null;
    per_page: number | null;
    prev_page_url: string | null;
    to: number | null;
    total: number | null;
  };
}
declare namespace App.Data.Tenant.Frontend.Widgets {
  export type PageWidget = {
    name: string;
    data: string;
    measureUnit?: string | null;
  };
  export type PageWidgets = {
    widgets: Array<App.Data.Tenant.Frontend.Widgets.PageWidget>;
  };
}
declare namespace App.Enums {
  export enum HistoryActionType { 'CREATE' = 'create', 'UPDATE' = 'update', 'DELETE' = 'delete' };
}
declare namespace App.Enums.Tenant {
  export enum ContactLabels { 'PRIMARY' = 'Основной', 'SECONDARY' = 'Дополнительный' };

  export enum ContactTypes { 'PHONE' = 'Телефон', 'EMAIL' = 'Email' };
}
