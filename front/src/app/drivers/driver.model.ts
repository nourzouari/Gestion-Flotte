export interface Driver {
  id: number; // Rend l'id obligatoire (retirez le ?)
  name: string;
  license_number: string;
  phone?: string;
  email?: string;
  password?: string; // Ajout du champ password
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}