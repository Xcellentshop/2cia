export interface Call {
  id: string;
  city: string;
  timestamp: number;
  registeredInSADE: boolean;
  userId: string;
}

export interface User {
  id: string;
  email: string;
}

export type City = 
  | "FOZ DO IGUAÇU"
  | "SANTA TEREZINHA"
  | "SÃO MIGUEL"
  | "MEDIANEIRA"
  | "SERRANOPOLIS"
  | "MISSAL"
  | "ITAIPULANDIA"
  | "OUTRAS CIDAEDS";