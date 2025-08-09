# Medical AI Platform - Documentation

## Overview
This platform provides AI-powered medical analysis tools with strict privacy and GDPR compliance.

## Key Documents

### Privacy & Compliance
- [Privacy Policy](./privacy.md) - Comprehensive privacy practices and consent requirements
- [Azure Setup Guide](./azure-setup.md) - EU region deployment requirements for GDPR compliance

### Development
- [Test Documentation](../tests/README.md) - Integration and unit test specifications
- [API Documentation](./api.md) - Edge function API specifications

## Quick Start

### Privacy-First Development
1. **Data Anonymization**: Always filter PII before external API calls
2. **EU Region Requirement**: Deploy Azure resources only in EU regions
3. **Consent Management**: Require explicit user consent for AI processing
4. **Minimal Logging**: Store only response snippets, never prompts or PII

### Environment Setup
```bash
# Required for EU GDPR compliance
AZURE_OPENAI_ENDPOINT=https://your-service.openai.azure.com/  # Must be EU region
AZURE_OPENAI_KEY=your-access-key
AZURE_DEPLOYMENT_NAME=gpt-4o-mini
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### Verification Checklist
- [ ] Azure OpenAI deployed in EU region (westeurope/northeurope)
- [ ] Anonymization tests passing
- [ ] PII filtering verified
- [ ] User consent flow implemented
- [ ] Audit logging configured (response snippets only)

## Architecture

```
Patient Data → Anonymization → Azure OpenAI (EU) → AI Summary → Audit Log
     ↓              ↓              ↓              ↓          ↓
  Original       Filtered      EU Region      Medical     Response
   Tests         Tests          Only         Advice      Snippet
```

## Compliance Notes

- **GDPR Article 9**: Special category data (medical) requires explicit consent
- **Data Minimization**: Only process necessary medical test values
- **Purpose Limitation**: AI summaries for educational purposes only
- **Storage Limitation**: Response snippets for audit, full responses not stored
- **Accuracy**: Disclaimers required ("This is not a diagnosis; consult your GP")

## Support

For technical questions or compliance concerns, refer to the privacy policy contact information.