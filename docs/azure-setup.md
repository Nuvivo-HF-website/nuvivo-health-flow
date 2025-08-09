# Azure OpenAI Setup Guide

## Regional Compliance Requirements

**CRITICAL**: All Azure OpenAI resources MUST be deployed in EU regions for GDPR compliance.

### Approved EU Regions

| Region | Location | Recommended |
|--------|----------|-------------|
| `westeurope` | Netherlands | ✅ Primary |
| `northeurope` | Ireland | ✅ Primary |
| `francecentral` | France | ✅ Secondary |
| `germanywestcentral` | Germany | ✅ Secondary |

### Azure CLI Setup

```bash
# 1. Create Resource Group in EU region
az group create \
  --name "medical-ai-rg" \
  --location "westeurope"

# 2. Create OpenAI Service in EU region
az cognitiveservices account create \
  --name "medical-ai-openai" \
  --resource-group "medical-ai-rg" \
  --location "westeurope" \
  --kind "OpenAI" \
  --sku "S0" \
  --custom-domain "medical-ai-openai"

# 3. Create deployment
az cognitiveservices account deployment create \
  --name "medical-ai-openai" \
  --resource-group "medical-ai-rg" \
  --deployment-name "gpt-4o-mini" \
  --model-name "gpt-4o-mini" \
  --model-version "2024-07-18" \
  --model-format "OpenAI" \
  --sku-capacity 10 \
  --sku-name "Standard"
```

### Azure Portal Setup

1. **Create OpenAI Resource**
   - Navigate to Azure Portal → Create Resource → OpenAI
   - **Region**: Select West Europe or North Europe
   - **Pricing Tier**: Standard (S0)
   - **Network**: Configure as needed

2. **Deploy Model**
   - Go to Azure OpenAI Studio
   - Navigate to Deployments
   - Create new deployment with `gpt-4o-mini` model
   - Set TPM (Tokens Per Minute) based on usage needs

3. **Get Configuration**
   ```bash
   # Get endpoint
   az cognitiveservices account show \
     --name "medical-ai-openai" \
     --resource-group "medical-ai-rg" \
     --query "properties.endpoint"
   
   # Get access key
   az cognitiveservices account keys list \
     --name "medical-ai-openai" \
     --resource-group "medical-ai-rg" \
     --query "key1"
   ```

### Environment Variables

Set these in your Supabase Edge Functions secrets:

```bash
AZURE_OPENAI_ENDPOINT=https://your-service.openai.azure.com/
AZURE_OPENAI_KEY=your-access-key
AZURE_DEPLOYMENT_NAME=gpt-4o-mini
```

### Verification Script

```bash
#!/bin/bash
# verify-azure-region.sh

RESOURCE_NAME="medical-ai-openai"
RESOURCE_GROUP="medical-ai-rg"

LOCATION=$(az cognitiveservices account show \
  --name "$RESOURCE_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query "location" -o tsv)

EU_REGIONS=("westeurope" "northeurope" "francecentral" "germanywestcentral")

if [[ " ${EU_REGIONS[@]} " =~ " ${LOCATION} " ]]; then
    echo "✅ Azure OpenAI resource is in EU region: $LOCATION"
    exit 0
else
    echo "❌ ERROR: Azure OpenAI resource is NOT in EU region: $LOCATION"
    echo "   Please redeploy in an EU region for GDPR compliance"
    exit 1
fi
```

### Network Security

```bash
# Configure network access (optional)
az cognitiveservices account network-rule add \
  --name "medical-ai-openai" \
  --resource-group "medical-ai-rg" \
  --subnet "/subscriptions/{subscription-id}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vnet}/subnets/{subnet}"
```

### Monitoring & Compliance

```bash
# Enable diagnostic logging
az monitor diagnostic-settings create \
  --resource "/subscriptions/{subscription-id}/resourceGroups/medical-ai-rg/providers/Microsoft.CognitiveServices/accounts/medical-ai-openai" \
  --name "medical-ai-logs" \
  --logs '[{"category":"Audit","enabled":true},{"category":"RequestResponse","enabled":true}]' \
  --workspace "/subscriptions/{subscription-id}/resourceGroups/{rg}/providers/Microsoft.OperationalInsights/workspaces/{workspace}"
```

## Security Best Practices

### Access Control
- Use Managed Identity when possible
- Rotate access keys regularly (90 days)
- Implement least-privilege access
- Monitor usage through Azure Monitor

### Data Protection
- All data sent to Azure OpenAI is anonymized
- No PII ever transmitted
- Request/response logging disabled for privacy
- EU data residency maintained

### Compliance Checklist

- [ ] Azure OpenAI resource created in EU region
- [ ] Access keys secured in Supabase secrets
- [ ] Network access restricted if required
- [ ] Diagnostic logging configured
- [ ] Regular access key rotation scheduled
- [ ] Data anonymization tested
- [ ] Privacy impact assessment completed

---

**Warning**: Deploying Azure OpenAI outside EU regions may violate GDPR requirements for medical data processing. Always verify region selection before deployment.