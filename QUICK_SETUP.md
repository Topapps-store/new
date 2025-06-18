# Quick Google Ads API Setup

## Get Your 5 Credentials

### 1. Google Cloud Console (Client ID & Secret)
- Go to: https://console.cloud.google.com/apis/credentials
- Create project → Enable "Google Ads API" 
- Create OAuth 2.0 Client ID (Web application)
- Add redirect: `https://developers.google.com/oauthplayground`
- Copy **Client ID** and **Client Secret**

### 2. OAuth Playground (Refresh Token)
- Go to: https://developers.google.com/oauthplayground/
- Settings → Use your own OAuth credentials (paste Client ID/Secret)
- Select "Google Ads API v15" scope
- Authorize → Exchange code for tokens
- Copy **refresh_token**

### 3. Google Ads (Customer ID)
- Go to: https://ads.google.com/
- Top-right corner: 10-digit number (e.g., 123-456-7890)
- Copy **without dashes**: 1234567890

### 4. Google Ads API Center (Developer Token)
- In Google Ads: Tools → API Center
- Create Developer Token → Wait for approval
- Copy **Developer Token**

## Configure in Replit

1. Go to Replit Secrets tab
2. Add these 5 variables:

```
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
GOOGLE_ADS_CUSTOMER_ID=1234567890
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
```

3. Restart your Replit
4. Test at `/admin/google-ads`

## Test Campaign Creation

Once configured, you can:
- Select any app from your catalog
- Set budget (minimum €50/day recommended)
- Choose language (Spanish/English/French)
- Generate optimized campaigns with 10-15 keywords
- Track conversions automatically