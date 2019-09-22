export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Trip {
  user_id: number;
  destination: null | string;
  date: null | Date;
  active: boolean;
}
