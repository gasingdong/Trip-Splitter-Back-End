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

export interface Person {
  trip_id: number;
  first_name: string;
  last_name: null | string;
  user_id: null | number;
}
