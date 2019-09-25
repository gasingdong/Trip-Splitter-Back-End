export interface User {
  id: number;
  username: string;
  password: string;
  photo: string;
  trips: Trip[];
  friends: Friend[];
}

export interface Friend {
  friend_id: number;
  username: string;
}

export interface Trip {
  id: number;
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

export interface Expense {
  id: number;
  person_id: number;
  name: null | string;
  first_name: string;
  last_name: null | string;
  trip_id: number;
  amount: number;
}

export interface Debt {
  expense_id: number;
  person_id: number;
  first_name: string;
  last_name: null | string;
  amount: number;
}
