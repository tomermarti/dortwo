# Vercel Environment Variables Setup

## Required Environment Variables

Add the following environment variables to your Vercel project for production:

### Mixpanel Analytics

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_MIXPANEL_TOKEN` | `ee6195be0edcd61f1ba52b68a98ba5ea` | Production, Preview, Development |
| `MIXPANEL_PROJECT_ID` | `3895684` | Production, Preview, Development |
| `MIXPANEL_SECRET` | `671063817881815313b9c99875b2407d` | Production, Preview, Development |

### Important Notes:

- **`NEXT_PUBLIC_MIXPANEL_TOKEN`** - This variable is prefixed with `NEXT_PUBLIC_` because it needs to be accessible in the browser (client-side). This is required for Mixpanel to work.

- **`MIXPANEL_PROJECT_ID`** and **`MIXPANEL_SECRET`** - These are server-side only variables (not prefixed with `NEXT_PUBLIC_`) for any potential server-side Mixpanel operations or API calls.

- After adding the variables, **redeploy** your application for the changes to take effect.

## Quick Setup via Vercel CLI

Alternatively, you can add them via the Vercel CLI:

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add NEXT_PUBLIC_MIXPANEL_TOKEN
# When prompted, enter: ee6195be0edcd61f1ba52b68a98ba5ea

vercel env add MIXPANEL_PROJECT_ID
# When prompted, enter: 3895684

vercel env add MIXPANEL_SECRET
# When prompted, enter: 671063817881815313b9c99875b2407d
```

## Verify Setup

After deployment, check the browser console for any Mixpanel-related errors. You should see successful tracking events in your Mixpanel dashboard at:
https://mixpanel.com/project/3895684

## Local Development

For local development, the `.env.local` file has been created with all the necessary variables. This file is gitignored for security.

