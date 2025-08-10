# GDPR Compliance & Security Hardening Documentation

## Data Protection Impact Assessment (DPIA)

### Personal Data Categories

#### Special Category Data (Article 9 GDPR)
- **Health Data**: Medical test results, AI summaries, prescriptions, medical documents
- **Biometric Data**: Voice recordings (telemedicine), potentially photos in medical documents

#### Personal Data (Article 6 GDPR)
- **Identity Data**: Names, NHS numbers, date of birth, addresses
- **Contact Data**: Email addresses, phone numbers
- **Electronic Data**: User authentication tokens, IP addresses, device information
- **Professional Data**: Doctor qualifications, specialist information

### Data Storage Locations

```json
{
  "personal_data_mapping": {
    "supabase_database": {
      "categories": ["health", "identity", "contact", "professional"],
      "tables": [
        "profiles", "patient_profiles", "results", "test_results", 
        "medical_documents", "medications", "prescriptions", 
        "messages", "appointments", "consultations"
      ],
      "retention_period_days": 2555,
      "encryption": "at_rest_aes256"
    },
    "supabase_storage": {
      "categories": ["health", "biometric"],
      "buckets": ["medical-documents"],
      "retention_period_days": 2555,
      "encryption": "at_rest_aes256"
    },
    "browser_localStorage": {
      "categories": ["authentication"],
      "data": ["supabase_auth_session"],
      "retention_period_days": 30,
      "encryption": "none_client_side"
    },
    "audit_logs": {
      "categories": ["access_logs", "system_events"],
      "retention_period_days": 2555,
      "purpose": "compliance_security"
    }
  },
  "data_flows": {
    "ai_processing": {
      "source": "results.parsed_data",
      "destination": "azure_openai_eu",
      "anonymization": "true",
      "consent_required": "true",
      "retention": "no_retention_external"
    },
    "messaging": {
      "source": "messages.content",
      "encryption": "base64_encoding",
      "access_control": "sender_recipient_only"
    }
  },
  "legal_basis": {
    "health_data": "Article_9_2_h_healthcare",
    "consent_based": "Article_6_1_a_consent",
    "legitimate_interest": "Article_6_1_f_security_fraud_prevention"
  }
}
```

### Consent Management

#### Required Consents
1. **AI Processing Consent**: Explicit consent for AI analysis of medical data
2. **Data Storage Consent**: Consent for data retention beyond immediate treatment
3. **Marketing Consent**: Optional consent for health-related communications
4. **Research Consent**: Optional consent for anonymized research participation

#### Data Subject Rights Implementation
- **Right of Access**: Patient portal with full data export
- **Right to Rectification**: Profile editing capabilities
- **Right to Erasure**: "Delete My Data" functionality
- **Right to Data Portability**: JSON export of all personal data
- **Right to Object**: Consent withdrawal mechanisms

### Security Measures

#### Database Security
- Row-Level Security (RLS) enabled on all tables
- Encrypted storage for sensitive fields
- Audit logging for all data access
- Regular security scans and updates

#### Transport Security
- TLS 1.2+ encryption for all communications
- HTTPS enforcement
- Secure API endpoints with authentication

#### Access Controls
- Role-based access control (patients, doctors, admins)
- Multi-factor authentication available
- Session management and timeout controls

### Compliance Monitoring

#### Automated Scans
- Daily dependency vulnerability scans
- Weekly OWASP security assessments
- Monthly penetration testing
- Quarterly compliance audits

#### Incident Response
- Data breach notification procedures
- Incident escalation protocols
- Forensic logging capabilities
- Recovery and remediation processes