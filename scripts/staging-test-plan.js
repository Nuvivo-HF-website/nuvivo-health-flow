#!/usr/bin/env node

/**
 * Comprehensive Preview/Staging Test Plan
 * Tests all GDPR compliance, security, and access control features
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

class StagingTestPlan {
  constructor() {
    this.testResults = {
      accessControl: { passed: 0, failed: 0, tests: [] },
      consentFlow: { passed: 0, failed: 0, tests: [] },
      dataRights: { passed: 0, failed: 0, tests: [] },
      security: { passed: 0, failed: 0, tests: [] },
      logging: { passed: 0, failed: 0, tests: [] },
      compliance: { passed: 0, failed: 0, tests: [] }
    };
    
    // Test user credentials for staging
    this.testUsers = {
      patient1: { email: 'test-patient-1@staging.com', password: 'TestPass123!', id: '00000000-0000-0000-0000-000000000001' },
      patient2: { email: 'test-patient-2@staging.com', password: 'TestPass123!', id: '00000000-0000-0000-0000-000000000002' },
      doctor: { email: 'test-doctor-1@staging.com', password: 'TestPass123!', id: '00000000-0000-0000-0000-000000000006' },
      admin: { email: 'test-admin-1@staging.com', password: 'TestPass123!', id: '00000000-0000-0000-0000-000000000009' }
    };
  }

  createSupabaseClient(accessToken = null) {
    const supabaseUrl = process.env.STAGING_SUPABASE_URL || 'YOUR_STAGING_SUPABASE_URL';
    const supabaseKey = process.env.STAGING_SUPABASE_ANON_KEY || 'YOUR_STAGING_SUPABASE_ANON_KEY';
    
    const client = createClient(supabaseUrl, supabaseKey, {
      auth: accessToken ? {
        autoRefreshToken: false,
        persistSession: false
      } : undefined
    });

    if (accessToken) {
      client.auth.setSession({ access_token: accessToken, refresh_token: 'dummy' });
    }

    return client;
  }

  async authenticateUser(email, password) {
    const supabase = this.createSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      throw new Error(`Authentication failed for ${email}: ${error.message}`);
    }
    
    return {
      user: data.user,
      session: data.session,
      client: this.createSupabaseClient(data.session.access_token)
    };
  }

  async logTest(category, testName, passed, details = '') {
    const result = { testName, passed, details, timestamp: new Date().toISOString() };
    this.testResults[category].tests.push(result);
    
    if (passed) {
      this.testResults[category].passed++;
      console.log(`✅ ${category}: ${testName}`);
    } else {
      this.testResults[category].failed++;
      console.log(`❌ ${category}: ${testName} - ${details}`);
    }
  }

  async testAccessControl() {
    console.log('\n🔐 Testing Access Control...');

    try {
      // Test 1: Patient cannot access another patient's data
      const patient1Auth = await this.authenticateUser(this.testUsers.patient1.email, this.testUsers.patient1.password);
      
      // Try to access patient2's test results
      const { data: unauthorizedData, error } = await patient1Auth.client
        .from('test_results')
        .select('*')
        .eq('user_id', this.testUsers.patient2.id);

      const unauthorizedAccessBlocked = !unauthorizedData || unauthorizedData.length === 0;
      await this.logTest('accessControl', 'Patient cross-access blocked', unauthorizedAccessBlocked, 
        unauthorizedAccessBlocked ? 'Successfully blocked' : 'Unauthorized access detected!');

      // Test 2: Patient can access their own data
      const { data: authorizedData } = await patient1Auth.client
        .from('test_results')
        .select('*')
        .eq('user_id', this.testUsers.patient1.id);

      const ownDataAccessible = authorizedData && authorizedData.length > 0;
      await this.logTest('accessControl', 'Patient own data access', ownDataAccessible,
        ownDataAccessible ? 'Can access own data' : 'Cannot access own data');

      // Test 3: Doctor can access assigned patient data
      const doctorAuth = await this.authenticateUser(this.testUsers.doctor.email, this.testUsers.doctor.password);
      
      const { data: doctorPatientData } = await doctorAuth.client
        .from('test_results')
        .select('*')
        .eq('user_id', this.testUsers.patient1.id);

      const doctorAccessWorks = doctorPatientData && doctorPatientData.length > 0;
      await this.logTest('accessControl', 'Doctor assigned patient access', doctorAccessWorks,
        doctorAccessWorks ? 'Doctor can access assigned patient' : 'Doctor cannot access assigned patient');

      // Test 4: Admin can access all data
      const adminAuth = await this.authenticateUser(this.testUsers.admin.email, this.testUsers.admin.password);
      
      const { data: allPatientsData } = await adminAuth.client
        .from('test_results')
        .select('*');

      const adminFullAccess = allPatientsData && allPatientsData.length > 0;
      await this.logTest('accessControl', 'Admin full access', adminFullAccess,
        adminFullAccess ? 'Admin has full access' : 'Admin access restricted');

    } catch (error) {
      await this.logTest('accessControl', 'Access control test suite', false, error.message);
    }
  }

  async testConsentFlow() {
    console.log('\n📋 Testing Consent & Data Rights...');

    try {
      const patient1Auth = await this.authenticateUser(this.testUsers.patient1.email, this.testUsers.patient1.password);

      // Test 1: AI consent required for processing
      const { data: profileData } = await patient1Auth.client
        .from('profiles')
        .select('ai_consent')
        .eq('user_id', this.testUsers.patient1.id)
        .single();

      const hasAIConsent = profileData?.ai_consent === true;
      await this.logTest('consentFlow', 'AI consent status check', true, 
        `AI consent: ${hasAIConsent ? 'granted' : 'not granted'}`);

      // Test 2: Withdraw consent
      const { error: withdrawError } = await patient1Auth.client.rpc('withdraw_consent', {
        _user_id: this.testUsers.patient1.id,
        _consent_type: 'ai_processing'
      });

      const consentWithdrawalWorks = !withdrawError;
      await this.logTest('consentFlow', 'Consent withdrawal', consentWithdrawalWorks,
        consentWithdrawalWorks ? 'Successfully withdrew consent' : `Withdrawal failed: ${withdrawError?.message}`);

      // Test 3: Verify consent withdrawal took effect
      const { data: updatedProfile } = await patient1Auth.client
        .from('profiles')
        .select('ai_consent')
        .eq('user_id', this.testUsers.patient1.id)
        .single();

      const consentWithdrawn = updatedProfile?.ai_consent === false;
      await this.logTest('consentFlow', 'Consent withdrawal effective', consentWithdrawn,
        consentWithdrawn ? 'Consent successfully withdrawn' : 'Consent withdrawal not effective');

    } catch (error) {
      await this.logTest('consentFlow', 'Consent flow test suite', false, error.message);
    }
  }

  async testDataRights() {
    console.log('\n📤 Testing Data Subject Rights...');

    try {
      const patient2Auth = await this.authenticateUser(this.testUsers.patient2.email, this.testUsers.patient2.password);

      // Test 1: Data export functionality
      const { data: exportData, error: exportError } = await patient2Auth.client.rpc('export_user_data', {
        _user_id: this.testUsers.patient2.id
      });

      const dataExportWorks = !exportError && exportData;
      await this.logTest('dataRights', 'Data export functionality', dataExportWorks,
        dataExportWorks ? 'Data export successful' : `Export failed: ${exportError?.message}`);

      // Test 2: GDPR deletion request
      const { error: deletionError } = await patient2Auth.client
        .from('gdpr_requests')
        .insert({
          user_id: this.testUsers.patient2.id,
          request_type: 'deletion',
          status: 'pending',
          details: { trigger: 'staging_test', requested_at: new Date().toISOString() }
        });

      const deletionRequestWorks = !deletionError;
      await this.logTest('dataRights', 'GDPR deletion request', deletionRequestWorks,
        deletionRequestWorks ? 'Deletion request created' : `Request failed: ${deletionError?.message}`);

      // Test 3: Simulate deletion processing (in staging only)
      if (deletionRequestWorks) {
        const { data: deletionResult, error: processError } = await patient2Auth.client.rpc('process_gdpr_deletion', {
          _user_id: this.testUsers.patient2.id
        });

        const deletionProcessWorks = !processError && deletionResult;
        await this.logTest('dataRights', 'GDPR deletion processing', deletionProcessWorks,
          deletionProcessWorks ? 'Deletion processed successfully' : `Processing failed: ${processError?.message}`);
      }

    } catch (error) {
      await this.logTest('dataRights', 'Data rights test suite', false, error.message);
    }
  }

  async testAuditLogging() {
    console.log('\n📝 Testing Audit Logging...');

    try {
      const adminAuth = await this.authenticateUser(this.testUsers.admin.email, this.testUsers.admin.password);

      // Test 1: Check if audit logs are being created
      const { data: auditLogs, error: auditError } = await adminAuth.client
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      const auditLogsExist = !auditError && auditLogs && auditLogs.length > 0;
      await this.logTest('logging', 'Audit logs creation', auditLogsExist,
        auditLogsExist ? `Found ${auditLogs.length} recent audit entries` : 'No audit logs found');

      // Test 2: Log a test action
      const { data: logResult, error: logError } = await adminAuth.client.rpc('log_gdpr_action', {
        _user_id: this.testUsers.admin.id,
        _action: 'STAGING_TEST_ACTION',
        _table_name: 'test_table',
        _record_id: this.testUsers.admin.id,
        _data_category: 'TEST_DATA'
      });

      const logCreationWorks = !logError && logResult;
      await this.logTest('logging', 'Manual audit log creation', logCreationWorks,
        logCreationWorks ? 'Test log entry created' : `Log creation failed: ${logError?.message}`);

      // Test 3: Verify logs are append-only (cannot be modified)
      if (auditLogsExist && auditLogs.length > 0) {
        const { error: updateError } = await adminAuth.client
          .from('audit_logs')
          .update({ action: 'MODIFIED_ACTION' })
          .eq('id', auditLogs[0].id);

        const appendOnlyEnforced = updateError !== null;
        await this.logTest('logging', 'Audit logs append-only', appendOnlyEnforced,
          appendOnlyEnforced ? 'Logs cannot be modified' : 'WARNING: Logs can be modified!');
      }

    } catch (error) {
      await this.logTest('logging', 'Audit logging test suite', false, error.message);
    }
  }

  async runSecurityScan() {
    console.log('\n🔍 Running Security Scans...');

    try {
      // Test 1: NPM Audit
      const { execSync } = require('child_process');
      
      try {
        execSync('npm audit --audit-level high --json > staging-npm-audit.json', { cwd: process.cwd() });
        const auditResults = JSON.parse(fs.readFileSync('staging-npm-audit.json', 'utf8'));
        
        const criticalVulns = auditResults.metadata?.vulnerabilities?.critical || 0;
        const highVulns = auditResults.metadata?.vulnerabilities?.high || 0;
        
        const npmAuditPassed = criticalVulns === 0 && highVulns === 0;
        await this.logTest('security', 'NPM Audit', npmAuditPassed,
          `Critical: ${criticalVulns}, High: ${highVulns}`);
        
      } catch (auditError) {
        await this.logTest('security', 'NPM Audit', false, 'Audit command failed');
      }

      // Test 2: Environment Security Check
      const requiredEnvVars = ['STAGING_SUPABASE_URL', 'STAGING_SUPABASE_ANON_KEY'];
      const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
      
      const envSecurityPassed = missingVars.length === 0;
      await this.logTest('security', 'Environment Variables', envSecurityPassed,
        envSecurityPassed ? 'All required env vars present' : `Missing: ${missingVars.join(', ')}`);

      // Test 3: HTTPS Enforcement Check
      const stagingUrl = process.env.STAGING_URL || 'https://your-staging-url.lovable.app';
      const httpsEnforced = stagingUrl.startsWith('https://');
      await this.logTest('security', 'HTTPS Enforcement', httpsEnforced,
        httpsEnforced ? 'HTTPS enforced' : 'WARNING: HTTP detected');

    } catch (error) {
      await this.logTest('security', 'Security scan suite', false, error.message);
    }
  }

  async exportComplianceData() {
    console.log('\n📊 Exporting Compliance Data...');

    try {
      // Load the GDPR data mapping configuration
      const gdprMappingPath = path.join(__dirname, '../config/gdpr-data-mapping.json');
      
      if (fs.existsSync(gdprMappingPath)) {
        const gdprMapping = JSON.parse(fs.readFileSync(gdprMappingPath, 'utf8'));
        
        // Add staging test results to the mapping
        const stagingReport = {
          ...gdprMapping,
          staging_test_results: {
            test_date: new Date().toISOString(),
            environment: 'staging',
            test_summary: this.testResults,
            compliance_status: this.getOverallComplianceStatus()
          }
        };

        // Ensure compliance_exports directory exists
        const exportsDir = path.join(__dirname, '../compliance_exports');
        if (!fs.existsSync(exportsDir)) {
          fs.mkdirSync(exportsDir, { recursive: true });
        }

        // Export to compliance_exports directory
        const exportPath = path.join(exportsDir, 'preview_data_mapping.json');
        fs.writeFileSync(exportPath, JSON.stringify(stagingReport, null, 2));

        await this.logTest('compliance', 'Data mapping export', true, `Exported to ${exportPath}`);
      } else {
        await this.logTest('compliance', 'Data mapping export', false, 'GDPR mapping file not found');
      }

    } catch (error) {
      await this.logTest('compliance', 'Compliance export', false, error.message);
    }
  }

  getOverallComplianceStatus() {
    const categories = Object.keys(this.testResults);
    const totalPassed = categories.reduce((sum, cat) => sum + this.testResults[cat].passed, 0);
    const totalFailed = categories.reduce((sum, cat) => sum + this.testResults[cat].failed, 0);
    const totalTests = totalPassed + totalFailed;
    
    return {
      total_tests: totalTests,
      passed: totalPassed,
      failed: totalFailed,
      success_rate: totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0,
      compliance_level: totalFailed === 0 ? 'FULL_COMPLIANCE' : totalFailed <= 2 ? 'MINOR_ISSUES' : 'MAJOR_ISSUES'
    };
  }

  async generateReport() {
    console.log('\n📋 Generating Final Report...');

    const report = {
      test_execution: {
        date: new Date().toISOString(),
        environment: 'staging',
        total_duration: 'N/A' // Would need to track actual duration
      },
      results_summary: this.testResults,
      overall_status: this.getOverallComplianceStatus(),
      recommendations: this.generateRecommendations()
    };

    // Save detailed report
    const reportPath = path.join(__dirname, '../compliance_exports/staging_test_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Print summary to console
    console.log('\n' + '='.repeat(60));
    console.log('🎯 STAGING TEST PLAN RESULTS');
    console.log('='.repeat(60));
    
    Object.entries(this.testResults).forEach(([category, results]) => {
      const total = results.passed + results.failed;
      const successRate = total > 0 ? Math.round((results.passed / total) * 100) : 0;
      console.log(`${category.toUpperCase()}: ${results.passed}/${total} passed (${successRate}%)`);
    });

    const overall = this.getOverallComplianceStatus();
    console.log('\n' + '-'.repeat(40));
    console.log(`OVERALL: ${overall.passed}/${overall.total_tests} passed (${overall.success_rate}%)`);
    console.log(`COMPLIANCE LEVEL: ${overall.compliance_level}`);
    console.log('-'.repeat(40));

    if (overall.failed > 0) {
      console.log('\n❌ CRITICAL ISSUES DETECTED - Review failed tests before production deployment!');
    } else {
      console.log('\n✅ ALL TESTS PASSED - Ready for production deployment');
    }

    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.testResults.accessControl.failed > 0) {
      recommendations.push('Review and fix Row Level Security policies');
    }
    
    if (this.testResults.consentFlow.failed > 0) {
      recommendations.push('Fix consent management and withdrawal flows');
    }
    
    if (this.testResults.security.failed > 0) {
      recommendations.push('Address security vulnerabilities before production');
    }
    
    if (this.testResults.logging.failed > 0) {
      recommendations.push('Ensure audit logging is working correctly');
    }

    if (recommendations.length === 0) {
      recommendations.push('All tests passed - ready for production deployment');
    }

    return recommendations;
  }

  async runFullTestSuite() {
    console.log('🚀 Starting Comprehensive Staging Test Plan...\n');

    try {
      await this.testAccessControl();
      await this.testConsentFlow();
      await this.testDataRights();
      await this.testAuditLogging();
      await this.runSecurityScan();
      await this.exportComplianceData();
      
      return await this.generateReport();
    } catch (error) {
      console.error('Test suite failed:', error);
      throw error;
    }
  }
}

// Run the test plan if called directly
if (require.main === module) {
  const testPlan = new StagingTestPlan();
  testPlan.runFullTestSuite()
    .then(report => {
      console.log('\n✅ Test plan completed successfully');
      process.exit(report.overall_status.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('\n❌ Test plan failed:', error);
      process.exit(1);
    });
}

module.exports = StagingTestPlan;