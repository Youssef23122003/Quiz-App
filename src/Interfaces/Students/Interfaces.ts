
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

