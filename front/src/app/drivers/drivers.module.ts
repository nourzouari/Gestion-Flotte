// src/app/models/driver.model.ts
export interface Vehicle {
  id: number;
  registration_number: string;
  brand: string;
  model: string;
  created_at: string;
  pivot: {
    driver_id: number;
    vehicle_id: number;
    created_at: string;
    assigned_at: string | null;
  };
}

export interface Driver {
  id: number;
  name: string;
  license_number: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
  vehicles: Vehicle[];
}

export interface ApiResponse {
  success: boolean;
  data: Driver[];
}