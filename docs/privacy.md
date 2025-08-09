# Privacy Policy & Data Protection

## Overview

This document outlines our privacy practices, data protection measures, and user consent requirements for AI-powered medical analysis features.

## Data Collection & Processing

### Medical Data Processing
- **Test Results**: We process anonymized blood test results to provide AI-powered summaries
- **Personal Information**: Names, dates of birth, NHS numbers, and addresses are **never** sent to external AI services
- **Anonymization**: Only approved medical test names and values are processed (Cholesterol, HDL, LDL, TSH, Glucose, HbA1c, WBC, RBC, Platelets)

### AI Consent Requirements
Users must explicitly consent to AI processing before any medical data analysis occurs. This consent:
- Can be enabled/disabled at any time in user profile settings
- Is required for each AI summary generation
- Covers only anonymized medical test data processing

## Azure OpenAI Integration

### Regional Compliance
**IMPORTANT**: All Azure OpenAI resources MUST be created in EU regions to ensure GDPR compliance:

```bash
# Required: Use EU regions only
# Recommended regions:
- West Europe (Netherlands)
- North Europe (Ireland)
- France Central
- Germany West Central

# Example Azure CLI command:
az cognitiveservices account create \
  --name "your-openai-service" \
  --resource-group "your-rg" \
  --location "westeurope" \
  --kind "OpenAI" \
  --sku "S0"
```

### Data Processing Safeguards
1. **No PII Transmission**: Personal identifiers are filtered before API calls
2. **Test Filtering**: Only approved medical tests are processed
3. **Prompt Anonymization**: System prompts explicitly state data is anonymized
4. **Logging Restrictions**: Only response snippets (200 chars max) are stored, never full prompts

## User Consent Text

### AI Insights Consent
When users enable AI insights, they see this consent text:

> **Enable AI Insights**
> 
> I consent to the processing of my anonymized blood test results using AI technology to generate patient-friendly summaries. I understand that:
> 
> - Only approved medical test values will be processed
> - My personal information (name, date of birth, NHS number, address) will never be shared with AI services
> - AI summaries are for educational purposes only and do not replace professional medical advice
> - I can withdraw this consent at any time in my profile settings
> - Data processing occurs in EU regions in compliance with GDPR
> 
> **This is not a diagnosis; always consult your GP for medical advice.**

### Data Retention
- **AI Summaries**: Stored indefinitely as part of medical records
- **AI Logs**: Response snippets stored for audit purposes (no prompts or PII)
- **Consent Records**: Tracked with timestamps for compliance

## Technical Implementation

### Anonymization Process
```typescript
// Only these tests are allowed for AI processing
const allowedTests = new Set([
  'Cholesterol', 'HDL', 'LDL', 'TSH', 'Glucose', 
  'HbA1c', 'WBC', 'RBC', 'Platelets'
]);

// PII fields are never included
const excludedFields = [
  'patient_name', 'dob', 'nhs_number', 'address',
  'full_name', 'email', 'phone', 'postcode'
];
```

### System Prompt Template
```
"You are a clinical assistant generating short, non-alarming patient-friendly 
summaries from ANONYMISED lab values only. NEVER ask for or infer identity. 
Output 2–4 sentences, avoid jargon, include one next step like 'discuss with 
your GP'. At the end add: 'This is not a diagnosis; consult your GP.'"
```

### Audit Logging
```typescript
// Only response snippets are logged, never prompts
await supabase.from('ai_logs').insert({
  result_id: resultId,
  model: 'azure-openai',
  response_snippet: aiSummary.slice(0, 200), // Max 200 chars
  created_at: new Date().toISOString()
});
```

## User Rights (GDPR Compliance)

### Right to Access
Users can view all their AI summaries and consent history through their patient portal.

### Right to Rectification
Users can update their consent preferences at any time.

### Right to Erasure
Users can request deletion of:
- AI summaries (while preserving original test results)
- AI processing logs
- Consent history

### Right to Data Portability
Users can export their medical data including AI summaries in structured format.

### Right to Object
Users can withdraw AI consent immediately, preventing future AI processing while preserving existing summaries.

## Contact Information

For privacy questions or data protection requests:
- **Data Protection Officer**: [Insert contact details]
- **Support Email**: [Insert support email]
- **Address**: [Insert company address]

## Updates

This privacy policy was last updated: [Insert date]
Users will be notified of material changes via email and in-app notifications.

---

**Note for Developers**: 
- Always verify Azure resources are in EU regions before deployment
- Test anonymization thoroughly before production releases
- Monitor AI logs to ensure no PII leakage
- Regular privacy impact assessments are required for AI feature updates