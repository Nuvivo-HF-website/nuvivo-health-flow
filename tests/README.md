# Generate Summary Integration Tests

This directory contains comprehensive tests for the `generate-summary` edge function, including integration tests and unit tests to verify proper anonymization and API behavior.

## Test Files

### `generateSummary.integration.test.ts`
Full integration tests that test the complete flow:
- Creates test data in Supabase
- Calls the actual edge function
- Verifies database changes
- Mocks Azure OpenAI API and validates anonymization

### `generateSummary.unit.test.ts`
Unit tests for the core logic:
- Tests anonymization function directly
- Validates prompt generation
- Tests edge cases and error handling
- Verifies CORS handling

## Key Test Scenarios

### 1. Successful AI Summary Generation
- ✅ Creates test user and result with mixed allowed/non-allowed tests
- ✅ Verifies only allowed tests are sent to Azure OpenAI API
- ✅ Confirms PII (names, DOB, NHS numbers) is filtered out
- ✅ Validates AI summary is saved to database
- ✅ Checks AI usage is logged in `ai_logs` table

### 2. Data Anonymization Verification
```typescript
// Input data contains:
tests: [
  { name: 'Cholesterol', value: 4.2, unit: 'mmol/L' },  // ✅ Allowed
  { name: 'HDL', value: 1.5, unit: 'mmol/L' },          // ✅ Allowed
  { name: 'PrivateTest', value: 99, unit: 'units' }     // ❌ Filtered out
],
patient_name: 'John Doe',                               // ❌ Filtered out
dob: '1990-01-01',                                      // ❌ Filtered out
nhs_number: 'AB123456C'                                 // ❌ Filtered out

// API payload contains only:
"• Cholesterol: 4.2 mmol/L (Reference: < 5.0)
• HDL: 1.5 mmol/L (Reference: > 1.0)"
```

### 3. System Prompt Validation
Verifies the exact system prompt is used:
```
"You are a clinical assistant generating short, non-alarming patient-friendly summaries from ANONYMISED lab values only. NEVER ask for or infer identity. Output 2–4 sentences, avoid jargon, include one next step like 'discuss with your GP'. At the end add: 'This is not a diagnosis; consult your GP.'"
```

### 4. Error Handling Tests
- ✅ AI consent disabled → 403 error
- ✅ No valid tests after anonymization → 400 error
- ✅ Missing authorization → 401 error
- ✅ Azure API failure → 503 error with no database changes

## Running Tests

### Prerequisites
```bash
# Install dependencies
npm install

# Set up test environment variables
export SUPABASE_URL="your-test-supabase-url"
export SUPABASE_SERVICE_ROLE_KEY="your-test-service-key"
export AZURE_OPENAI_ENDPOINT="https://test.openai.azure.com"
export AZURE_OPENAI_KEY="test-key"
export AZURE_DEPLOYMENT_NAME="test-deployment"
```

### Run Tests
```bash
# Run all tests
npm run test

# Run tests once (CI mode)
npm run test:run

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui

# Run specific test file
npx vitest tests/generateSummary.integration.test.ts
```

## Test Assertions

### Database Assertions
- `results.ai_summary` is populated
- `results.ai_generated_at` timestamp is set
- `ai_logs` entry is created with correct model and snippet

### API Call Assertions
- Azure OpenAI endpoint is called exactly once
- Request headers include correct `api-key`
- Request body contains only anonymized test data
- System prompt matches specification exactly
- No PII data in API payload

### Anonymization Assertions
- Only tests from allowed list are included
- Patient identifiers are completely removed
- Test values maintain proper formatting
- Reference ranges are preserved

## Mock Strategy

### Supabase Mocking
- Authentication responses
- Database operations (CRUD)
- Edge function invocation

### Azure OpenAI Mocking
- API response structure
- Error scenarios (503, timeout)
- Request payload capture for verification

## Security Verification

The tests specifically verify that:
1. **No PII leakage**: Patient names, DOB, NHS numbers never reach external APIs
2. **Test filtering**: Only approved medical tests are processed
3. **Consent enforcement**: AI processing requires explicit user consent
4. **Audit logging**: All AI operations are logged for compliance

## Test Data

### Allowed Tests (per anonymizer)
- Cholesterol, HDL, LDL, TSH, Glucose, HbA1c, WBC, RBC, Platelets

### Filtered Out Tests
- Any test not in the allowed list
- Custom/proprietary test markers
- Experimental biomarkers

### Filtered Out PII
- patient_name, dob, nhs_number, address
- Any personally identifiable information

## CI/CD Integration

Tests are designed to run in CI/CD pipelines with:
- Deterministic test data
- Proper cleanup procedures
- Environment variable configuration
- Fast execution (< 30 seconds)