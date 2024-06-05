export interface User {
  id: number;
  nationalId: string;
  name: string;
  lastName: string;
  age: number;
  goal?: string;
  startDate: Date;
  gender: string;
}
