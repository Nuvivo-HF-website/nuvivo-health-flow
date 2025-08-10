# Staging Test Plan Documentation

## Overview
This comprehensive staging test plan ensures GDPR compliance, security, and access control before production deployment with real patient data.

## Prerequisites

### 1. Environment Setup
Create a staging Supabase project in EU region with these environment variables:

```bash
export STAGING_SUPABASE_URL="https://your-staging-project.supabase.co"
export STAGING_SUPABASE_ANON_KEY="your-staging-anon-key"
export STAGING_SUPABASE_SERVICE_ROLE_KEY="your-staging-service-role-key"
export STAGING_URL="https://your-staging-app.lovable.app"
```

### 2. Deploy to Lovable Preview
1. Click "Publish" in Lovable editor
2. Deploy to staging environment
3. Configure custom domain if needed

## Test Execution

### Quick Start
```bash
# Run complete staging test plan
npm run staging:full
```

### Manual Steps
1. **Setup Environment**:
   ```bash
   chmod +x scripts/staging-setup.sh
   ./scripts/staging-setup.sh
   ```

2. **Create Test Users** (Manual):
   Create these users in Supabase Auth dashboard:
   - `test-patient-1@staging.com` through `test-patient-5@staging.com`
   - `test-doctor-1@staging.com`, `test-nurse-1@staging.com`, `test-specialist-1@staging.com`
   - `test-admin-1@staging.com`
   
   All passwords: `TestPass123!`

3. **Seed Test Data**:
   - Run `scripts/staging-seed-data.sql` in Supabase SQL Editor
   - Update UUIDs with actual user IDs from Auth

4. **Run Tests**:
   ```bash
   node scripts/staging-test-plan.js
   ```

## Test Categories

### 1. Access Control Testing ✅
- **Patient Cross-Access**: Verify patients cannot access other patients' data
- **Own Data Access**: Confirm patients can access their own data
- **Staff Access**: Verify doctors can access assigned patients only
- **Admin Access**: Confirm admins have full access for compliance

### 2. Consent & Data Rights Testing ✅
- **AI Consent Required**: Verify AI processing requires explicit consent
- **Consent Withdrawal**: Test consent withdrawal functionality
- **Consent Effectiveness**: Confirm withdrawal stops AI processing

### 3. Data Subject Rights Testing ✅
- **Data Export**: Test GDPR data portability (JSON export)
- **Deletion Requests**: Verify GDPR deletion request creation
- **Deletion Processing**: Test complete data deletion workflow

### 4. Audit Logging Testing ✅
- **Log Creation**: Verify all actions create audit entries
- **Append-Only**: Confirm logs cannot be modified
- **Comprehensive Coverage**: Check login, access, AI requests, messages

### 5. Security Scanning ✅
- **NPM Audit**: Check for dependency vulnerabilities
- **Snyk Scanning**: Advanced security vulnerability detection
- **HTTPS Enforcement**: Verify secure transport
- **Environment Security**: Check configuration security

### 6. Compliance Export ✅
- **GDPR Data Mapping**: Export complete data categorization
- **Test Results**: Include staging test outcomes
- **Compliance Status**: Overall compliance assessment

## Test Data Structure

### Patient Profiles (5 patients)
- Realistic NHS-style data with anonymized content
- Multiple test results per patient
- Various medical conditions and medications
- Different consent statuses for testing

### Staff Users (3 staff + 1 admin)
- Doctor, nurse, specialist roles
- Assigned to specific patients via care_team
- Different access levels for testing

### Test Results
- NHS-style blood tests (FBC, Lipids, HbA1c, etc.)
- Reference ranges and status flags
- Multiple results per patient for comprehensive testing

### Messages
- Encrypted patient-staff communications
- Test consent-based access controls
- Verify audit logging

## Expected Output

### Pass/Fail Report
The test generates detailed reports in `compliance_exports/`:

- `staging_test_report.json` - Complete test results
- `preview_data_mapping.json` - GDPR compliance mapping
- `test_summary.md` - Human-readable summary

### Compliance Levels
- **FULL_COMPLIANCE**: All tests passed, ready for production
- **MINOR_ISSUES**: <3 failed tests, review and fix
- **MAJOR_ISSUES**: ≥3 failed tests, do not deploy

### Security Scan Results
- NPM audit results in `staging-npm-audit.log`
- Snyk results in `staging-snyk.log` (if available)
- Summary of critical/high vulnerabilities

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Verify test users exist in Supabase Auth
   - Check password requirements
   - Confirm environment variables

2. **RLS Policy Errors**
   - Verify RLS is enabled on all tables
   - Check policy definitions match test expectations
   - Review user role assignments

3. **Missing Test Data**
   - Ensure seed data SQL was executed
   - Update UUIDs in seed file with actual Auth user IDs
   - Check data was inserted correctly

4. **Security Scan Failures**
   - Run `npm audit fix` for fixable vulnerabilities
   - Review Snyk recommendations
   - Check HTTPS configuration

### Debug Mode
Add verbose logging:
```bash
DEBUG=true node scripts/staging-test-plan.js
```

## Production Readiness Checklist

✅ All access control tests pass  
✅ Consent management working correctly  
✅ GDPR data rights functional  
✅ Audit logging comprehensive  
✅ No critical/high security vulnerabilities  
✅ HTTPS enforced everywhere  
✅ EU region compliance verified  
✅ Compliance documentation exported  

## Next Steps

1. **If Tests Pass**: Ready for production deployment
2. **If Tests Fail**: Review detailed report, fix issues, re-run tests
3. **Production Deployment**: Use same process with production Supabase
4. **Ongoing Monitoring**: Schedule regular security scans and compliance audits

## Support

For issues with the staging test plan:
1. Check logs in `compliance_exports/` directory
2. Review Supabase project configuration
3. Verify all environment variables are correct
4. Ensure test users and data are properly created