import { Driver } from '../drivers/driver.model';

export interface History {
  id?: number;
  type: string;
  description?: string;
  date: string;
  driver_id: number;
  vehicle_id: number;    // <-- Ajoute ici !
 
}

interface ApiResponse<T> 
{
  "success": true,
  "data":  History[];
   
  
}
