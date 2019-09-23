export interface User {
  id: number;
  username: string;
  password: string;
  photo: string;
  trips: Trip[];
}

export interface Trip {
  user_id: number;
  destination: null | string;
  date: null | Date;
  active: boolean;
  created_by: string;
}

export interface Person {
  trip_id: number;
  first_name: string;
  last_name: null | string;
  user_id: null | number;
}
