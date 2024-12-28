declare namespace App.Data {
  export type User = {
    global_id: string | null;
    name: string;
    email: string;
    phone: any;
    password: string;
  };
}
