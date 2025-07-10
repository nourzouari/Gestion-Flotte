// models/assignment.model.ts
// assignment.model.ts
export interface Assignment {
  id: number;
  driver_id: number;
  vehicle_id: number;
  start_date: string;
  end_date: string;
  notes?: string;

  // Relations optionnelles (si tu les reçois du backend)
  driver?: {
    name: string;
  };
  vehicle?: {
    registration_number: string;
  };
}

// models/vehicle.model.ts
export interface Vehicle {
   id?: number; // facultatif si on crée un nouveau véhicule
   registration_number: string;
   brand: string;
   model: string;
   year: number;
   created_at?: string;
   updated_at?: string;
   drivers?: Driver[]; // <-- ici, la propriété drivers est un tableau optionnel
   is_available: boolean; // Disponibilité

 }
export interface Driver {
  id: number;
  name: string;
  license_number: string;
}