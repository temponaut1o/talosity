export type IndustryKey =
  | 'commercial-cleaning'
  | 'warehouse-automation'
  | 'construction'
  | 'medical';

export interface Industry {
  id: IndustryKey;
  name: string;
  shortName: string;
  description: string;
  focus: string;
}

export interface Company {
  id: string;
  name: string;
  category: IndustryKey;
  location: string;
  yearFounded: number;
  summary: string;
  tags: string[];
  robots: string[];
}

export interface Robot {
  id: string;
  name: string;
  companyId: string;
  category: IndustryKey;
  application: string;
  deployment: string;
  payload: string;
  autonomy: string;
  description: string;
}
