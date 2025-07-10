// src/app/models/vehicle.model.ts
export interface Vehicle {
  id?: number; // facultatif si on crée un nouveau véhicule
  registration_number: string;
  brand: string;
  model: string;
  year: number;
  type?: string;
  created_at?: string;
  updated_at?: string;
  drivers?: Driver[]; // <-- ici, la propriété drivers est un tableau optionnel
  is_available: boolean; // Disponibilité

}
export interface Driver {
  id: number;
  name: string;
  // autres propriétés si besoin
}
