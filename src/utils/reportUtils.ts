import { Call, CompanyFilter, COMPANY_CITIES } from '../types';

interface CityData {
  city: string;
  total: number;
  sade: number;
  totalPercentage: number;
  sadePercentage: number;
}

interface CompanyData {
  name: string;
  total: number;
  sade: number;
  totalPercentage: number;
  sadePercentage: number;
}

export function calculateCityData(
  calls: Call[], 
  selectedCity: string | 'all', 
  companyFilter: CompanyFilter
): CityData[] {
  let filteredCalls = calls;

  // Filter by company if selected
  if (companyFilter !== 'all') {
    filteredCalls = calls.filter(call => 
      COMPANY_CITIES[companyFilter].includes(call.city as any)
    );
  }

  // Then filter by city if selected
  if (selectedCity !== 'all') {
    filteredCalls = filteredCalls.filter(call => call.city === selectedCity);
  }

  // Calculate totals first
  const cityData = filteredCalls.reduce((acc: { [key: string]: CityData }, call) => {
    if (!acc[call.city]) {
      acc[call.city] = {
        city: call.city,
        total: 0,
        sade: 0,
        totalPercentage: 0,
        sadePercentage: 0
      };
    }
    acc[call.city].total += 1;
    if (call.registeredInSADE) acc[call.city].sade += 1;
    return acc;
  }, {});

  // Calculate grand total for percentages
  const grandTotal = Object.values(cityData).reduce((sum, city) => sum + city.total, 0);
  
  // Calculate percentages
  return Object.values(cityData).map(city => ({
    ...city,
    totalPercentage: grandTotal ? (city.total / grandTotal) * 100 : 0,
    sadePercentage: city.total ? (city.sade / city.total) * 100 : 0
  }));
}

export function calculateCompanyData(calls: Call[]): CompanyData[] {
  const companyData: { [key: string]: CompanyData } = {
    '1CIA': {
      name: '1ª Companhia',
      total: 0,
      sade: 0,
      totalPercentage: 0,
      sadePercentage: 0
    },
    '2CIA': {
      name: '2ª Companhia',
      total: 0,
      sade: 0,
      totalPercentage: 0,
      sadePercentage: 0
    }
  };

  // Calculate totals for each company
  calls.forEach(call => {
    if (COMPANY_CITIES['1CIA'].includes(call.city as any)) {
      companyData['1CIA'].total += 1;
      if (call.registeredInSADE) companyData['1CIA'].sade += 1;
    } else if (COMPANY_CITIES['2CIA'].includes(call.city as any)) {
      companyData['2CIA'].total += 1;
      if (call.registeredInSADE) companyData['2CIA'].sade += 1;
    }
  });

  // Calculate grand total for percentages
  const grandTotal = Object.values(companyData).reduce((sum, company) => sum + company.total, 0);

  // Calculate percentages
  return Object.values(companyData).map(company => ({
    ...company,
    totalPercentage: grandTotal ? (company.total / grandTotal) * 100 : 0,
    sadePercentage: company.total ? (company.sade / company.total) * 100 : 0
  }));
}