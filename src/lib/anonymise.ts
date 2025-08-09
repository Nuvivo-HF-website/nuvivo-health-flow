export type AnonTest = { 
  name: string; 
  value: number | string; 
  unit?: string; 
  reference?: string; 
};

const allowedTests = new Set([
  'Cholesterol',
  'HDL', 
  'LDL', 
  'TSH', 
  'Glucose', 
  'HbA1c', 
  'WBC', 
  'RBC', 
  'Platelets'
]);

export function anonymiseParsed(raw: any): { tests: AnonTest[]; sample_date?: string } {
  const tests: AnonTest[] = [];
  
  if (!raw || !Array.isArray(raw.tests)) {
    return { tests: [] };
  }
  
  for (const t of raw.tests) {
    const name = String(t.name || '').trim();
    if (!allowedTests.has(name)) continue;
    
    const value = t.value === undefined ? null : (Number(t.value) ?? t.value);
    
    tests.push({ 
      name, 
      value, 
      unit: t.unit || null, 
      reference: t.reference || null 
    });
  }
  
  return { 
    tests, 
    sample_date: raw.sample_date || null 
  };
}