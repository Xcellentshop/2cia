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
  | "OUTRAS CIDADES";

export type CompanyFilter = 'all' | '1CIA' | '2CIA';

export const COMPANY_CITIES = {
  '1CIA': ["FOZ DO IGUAÇU", "SANTA TEREZINHA"],
  '2CIA': ["MEDIANEIRA", "SÃO MIGUEL", "MISSAL", "ITAIPULANDIA", "SERRANOPOLIS"]
} as const;