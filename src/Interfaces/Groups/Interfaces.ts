export interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: 'active' | 'inactive';
  avg_score: number;
  role?: string;
  group?: {
    name: string;
  };
}


export interface Group {
  _id: string;
  name: string;
  status: 'active' | 'inactive';
  instructor: string;
  students: Student[];
  max_students: number;
}

export interface AddGroup {
  name: string;
  students: string[];
}


export interface StudentOption {
  value: string;
  label: string;
}