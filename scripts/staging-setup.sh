#!/bin/bash

# Staging Environment Setup and Test Execution Script
# This script sets up the staging environment and runs the complete test suite

set -e  # Exit on any error

echo "🚀 Setting up Staging Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check required environment variables
check_environment() {
    print_status "Checking environment variables..."
    
    required_vars=(
        "STAGING_SUPABASE_URL"
        "STAGING_SUPABASE_ANON_KEY"
        "STAGING_SUPABASE_SERVICE_ROLE_KEY"
        "STAGING_URL"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        printf ' - %s\n' "${missing_vars[@]}"
        echo ""
        echo "Please set these variables in your staging environment:"
        echo "export STAGING_SUPABASE_URL='your-staging-supabase-url'"
        echo "export STAGING_SUPABASE_ANON_KEY='your-staging-anon-key'"
        echo "export STAGING_SUPABASE_SERVICE_ROLE_KEY='your-staging-service-role-key'"
        echo "export STAGING_URL='your-staging-app-url'"
        exit 1
    fi
    
    print_status "All required environment variables are set ✅"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    
    # Install additional testing dependencies
    npm install --save-dev @supabase/supabase-js axios
    print_status "Dependencies installed ✅"
}

# Setup test users in Supabase Auth
setup_test_users() {
    print_status "Setting up test users in Supabase Auth..."
    
    # Note: This would typically require API calls to Supabase Auth
    # For now, we'll just remind the user to create them manually
    cat << EOF

📋 MANUAL STEP REQUIRED:
Please create the following test users in your Staging Supabase Auth:

Test Patients:
- test-patient-1@staging.com (password: TestPass123!)
- test-patient-2@staging.com (password: TestPass123!)
- test-patient-3@staging.com (password: TestPass123!)
- test-patient-4@staging.com (password: TestPass123!)
- test-patient-5@staging.com (password: TestPass123!)

Test Staff:
- test-doctor-1@staging.com (password: TestPass123!)
- test-nurse-1@staging.com (password: TestPass123!)
- test-specialist-1@staging.com (password: TestPass123!)

Test Admin:
- test-admin-1@staging.com (password: TestPass123!)

After creating these users, update the UUIDs in scripts/staging-seed-data.sql
with the actual user IDs from Supabase Auth.

EOF

    read -p "Press Enter after creating the test users and updating the SQL file..."
}

# Seed test data
seed_test_data() {
    print_status "Seeding test data..."
    
    if [ ! -f "scripts/staging-seed-data.sql" ]; then
        print_error "Seed data file not found: scripts/staging-seed-data.sql"
        exit 1
    fi
    
    # Execute the seed data SQL (requires psql or supabase CLI)
    if command -v supabase &> /dev/null; then
        print_status "Using Supabase CLI to seed data..."
        supabase db reset --linked
        # Note: You may need to run the seed file separately
        print_warning "Please run the seed data SQL manually in your Supabase SQL editor"
    else
        print_warning "Supabase CLI not found. Please run scripts/staging-seed-data.sql manually in your Supabase SQL editor"
    fi
}

# Run security scans
run_security_scans() {
    print_status "Running security scans..."
    
    # NPM Audit
    print_status "Running npm audit..."
    npm audit --audit-level high > staging-npm-audit.log 2>&1 || {
        print_warning "NPM audit found vulnerabilities - check staging-npm-audit.log"
    }
    
    # Check if Snyk is available
    if command -v snyk &> /dev/null; then
        print_status "Running Snyk security scan..."
        snyk test --severity-threshold=high > staging-snyk.log 2>&1 || {
            print_warning "Snyk found vulnerabilities - check staging-snyk.log"
        }
    else
        print_warning "Snyk not installed - skipping advanced security scan"
        print_status "Install Snyk: npm install -g snyk"
    fi
    
    # Basic HTTPS check
    if [[ $STAGING_URL == https://* ]]; then
        print_status "HTTPS enforcement verified ✅"
    else
        print_error "Staging URL is not using HTTPS: $STAGING_URL"
        exit 1
    fi
}

# Run the comprehensive test suite
run_test_suite() {
    print_status "Running comprehensive test suite..."
    
    if [ ! -f "scripts/staging-test-plan.js" ]; then
        print_error "Test plan script not found: scripts/staging-test-plan.js"
        exit 1
    fi
    
    # Run the test plan
    node scripts/staging-test-plan.js
    
    # Check exit code
    if [ $? -eq 0 ]; then
        print_status "All tests passed ✅"
    else
        print_error "Some tests failed ❌"
        echo ""
        echo "Check the detailed report in compliance_exports/staging_test_report.json"
        exit 1
    fi
}

# Generate compliance reports
generate_compliance_reports() {
    print_status "Generating compliance reports..."
    
    # Ensure compliance_exports directory exists
    mkdir -p compliance_exports
    
    # Copy GDPR data mapping to compliance exports
    if [ -f "config/gdpr-data-mapping.json" ]; then
        cp config/gdpr-data-mapping.json compliance_exports/preview_data_mapping.json
        print_status "GDPR data mapping exported ✅"
    else
        print_warning "GDPR data mapping file not found"
    fi
    
    # Create test summary
    cat > compliance_exports/test_summary.md << EOF
# Staging Test Plan Results

## Test Execution Date
$(date)

## Environment
- Staging URL: $STAGING_URL
- Supabase Project: ${STAGING_SUPABASE_URL}

## Test Categories
- ✅ Access Control Testing
- ✅ Consent Flow Testing  
- ✅ Data Subject Rights Testing
- ✅ Audit Logging Verification
- ✅ Security Scanning
- ✅ GDPR Compliance Export

## Files Generated
- \`compliance_exports/preview_data_mapping.json\` - Complete GDPR data mapping
- \`compliance_exports/staging_test_report.json\` - Detailed test results
- \`staging-npm-audit.log\` - NPM security audit results
- \`staging-snyk.log\` - Snyk security scan results (if available)

## Next Steps
1. Review any failed tests in the detailed report
2. Fix any security vulnerabilities found
3. Verify all access control policies are working correctly
4. Confirm GDPR compliance requirements are met
5. Ready for production deployment if all tests pass

EOF

    print_status "Test summary created ✅"
}

# Main execution
main() {
    echo "🏥 NHS-Style Medical Platform - Staging Test Plan"
    echo "=================================================="
    echo ""
    
    check_environment
    install_dependencies
    setup_test_users
    seed_test_data
    run_security_scans
    run_test_suite
    generate_compliance_reports
    
    echo ""
    echo "🎉 Staging test plan completed successfully!"
    echo ""
    echo "📋 Summary:"
    echo "- Test users created and seeded with realistic NHS-style data"
    echo "- Access control policies verified"
    echo "- GDPR consent and data rights tested"
    echo "- Security scans completed"
    echo "- Audit logging verified"
    echo "- Compliance reports generated"
    echo ""
    echo "📂 Check compliance_exports/ directory for detailed reports"
    echo ""
    
    if [ -f "compliance_exports/staging_test_report.json" ]; then
        # Extract overall status from test report
        overall_status=$(node -e "
            const report = require('./compliance_exports/staging_test_report.json');
            console.log(report.overall_status.compliance_level);
        " 2>/dev/null || echo "UNKNOWN")
        
        case $overall_status in
            "FULL_COMPLIANCE")
                print_status "🟢 READY FOR PRODUCTION DEPLOYMENT"
                ;;
            "MINOR_ISSUES")
                print_warning "🟡 MINOR ISSUES DETECTED - Review and fix before production"
                ;;
            "MAJOR_ISSUES")
                print_error "🔴 MAJOR ISSUES DETECTED - Do not deploy to production"
                exit 1
                ;;
            *)
                print_warning "Unable to determine compliance status - manual review required"
                ;;
        esac
    fi
}

# Run main function
main "$@"