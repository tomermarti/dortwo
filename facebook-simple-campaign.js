const axios = require('axios');

// Facebook configuration - Simple and working
const USER_ACCESS_TOKEN = 'EAALXeRNJkWEBQHMDW8gec3wTtIMu7Gtmi6wPUnNbLWdIc41Y2PuJfrVZBcHYjGtynHiZC8S9aEJbUw0zWC9R6Q8WpyFz0OVjZABW2ICsQTO478SPN6BD9B8Xmiyqidbp77AjRLLfux2q4K2jhZAQZBXcg5yrOtw6YhZA3uEfpz6cGm6vOMZAVCZAinKg9cKdLvczbgZDZD';
const PAGE_ID = '923280350869125';
const ACCOUNT_ID = '1747779905752071';
const API_VERSION = 'v22.0';

// Simple campaign creation that works
async function createSimpleCampaign() {
  try {
    console.log('🚀 Creating Simple Lead Campaign...');
    
    const campaignData = {
      name: 'קרקעות פרימיום - קמפיין פשוט',
      objective: 'OUTCOME_LEADS',
      status: 'PAUSED',
      special_ad_categories: ['HOUSING'],
      special_ad_category_country: ['IL'], // Must match targeting countries
      access_token: USER_ACCESS_TOKEN
    };
    
    const response = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/campaigns`, campaignData);
    
    console.log('✅ Campaign created!');
    console.log('🆔 Campaign ID:', response.data.id);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Campaign creation failed:', error.response?.data || error.message);
    throw error;
  }
}

// Simple ad set creation
async function createSimpleAdSet(campaignId) {
  try {
    console.log('📊 Creating Simple Ad Set...');
    
    const adSetData = {
      name: 'קרקעות תל אביב - סט פשוט',
      campaign_id: campaignId,
      daily_budget: 5000, // 50 NIS
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LEAD_GENERATION',
      bid_amount: 1000, // 10 NIS per lead (required!)
      status: 'PAUSED',
      special_ad_categories: ['HOUSING'],
      special_ad_category_country: ['IL'], // Must match targeting countries
      targeting: JSON.stringify({
        geo_locations: {
          countries: ['IL']
        },
        age_min: 25,
        age_max: 65
      }),
      access_token: USER_ACCESS_TOKEN
    };
    
    const response = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/adsets`, adSetData);
    
    console.log('✅ Ad Set created!');
    console.log('🆔 Ad Set ID:', response.data.id);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Ad Set creation failed:', error.response?.data || error.message);
    throw error;
  }
}

// Test account access first
async function testAccountAccess() {
  try {
    console.log('🔍 Testing account access...');
    
    const response = await axios.get(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}`, {
      params: {
        fields: 'name,account_status,currency',
        access_token: USER_ACCESS_TOKEN
      }
    });
    
    console.log('✅ Account access successful!');
    console.log('📝 Account:', response.data.name);
    console.log('📊 Status:', response.data.account_status);
    console.log('💰 Currency:', response.data.currency);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Account access failed:', error.response?.data || error.message);
    throw error;
  }
}

// Step by step campaign creation
async function createStepByStep() {
  try {
    console.log('🎯 Step-by-Step Campaign Creation\n');
    console.log('═'.repeat(50));
    
    // Step 1: Test access
    console.log('\n1️⃣ Testing account access...');
    await testAccountAccess();
    
    // Step 2: Create campaign
    console.log('\n2️⃣ Creating campaign...');
    const campaign = await createSimpleCampaign();
    
    // Step 3: Create ad set
    console.log('\n3️⃣ Creating ad set...');
    const adSet = await createSimpleAdSet(campaign.id);
    
    console.log('\n🎉 SUCCESS!');
    console.log('📊 Results:');
    console.log(`   🚀 Campaign: ${campaign.id}`);
    console.log(`   📊 Ad Set: ${adSet.id}`);
    
    console.log('\n💡 Next steps:');
    console.log('   1. Go to Facebook Ads Manager');
    console.log('   2. Add creative and lead form');
    console.log('   3. Review and activate');
    
    return { campaign, adSet };
    
  } catch (error) {
    console.error('\n❌ Process failed:', error.message);
    
    // Specific error handling
    if (error.message.includes('optimization_goal')) {
      console.log('\n🔧 Optimization goal issue:');
      console.log('   Try: LEAD_GENERATION, QUALITY_LEAD, or IMPRESSIONS');
    }
    
    if (error.message.includes('special_ad_categories')) {
      console.log('\n🔧 Special ad categories issue:');
      console.log('   Real estate ads require HOUSING category');
    }
    
    if (error.message.includes('objective')) {
      console.log('\n🔧 Objective issue:');
      console.log('   Try: OUTCOME_LEADS for lead generation');
    }
    
    throw error;
  }
}

// Just test different optimization goals
async function testOptimizationGoals() {
  const goals = [
    'LEAD_GENERATION',
    'QUALITY_LEAD', 
    'IMPRESSIONS',
    'LINK_CLICKS',
    'REACH'
  ];
  
  console.log('🧪 Testing different optimization goals...\n');
  
  for (const goal of goals) {
    try {
      console.log(`Testing: ${goal}`);
      
      // Create a test campaign first
      const campaign = await createSimpleCampaign();
      
      const adSetData = {
        name: `Test - ${goal}`,
        campaign_id: campaign.id,
        daily_budget: 1000, // Minimal budget
        billing_event: 'IMPRESSIONS',
        optimization_goal: goal,
        bid_amount: 500, // 5 NIS - required for all bid strategies
        status: 'PAUSED',
        special_ad_categories: ['HOUSING'],
        special_ad_category_country: ['IL'], // Must match targeting countries
        targeting: JSON.stringify({
          geo_locations: { countries: ['IL'] },
          age_min: 25,
          age_max: 65
        }),
        access_token: USER_ACCESS_TOKEN
      };
      
      await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/adsets`, adSetData);
      console.log(`✅ ${goal} - WORKS!`);
      
    } catch (error) {
      console.log(`❌ ${goal} - Failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

// Export functions
module.exports = {
  testAccountAccess,
  createSimpleCampaign,
  createSimpleAdSet,
  createStepByStep,
  testOptimizationGoals
};

// Run based on argument
if (require.main === module) {
  const action = process.argv[2] || 'step';
  
  switch (action) {
    case 'test':
      testAccountAccess();
      break;
    case 'step':
      createStepByStep();
      break;
    case 'goals':
      testOptimizationGoals();
      break;
    default:
      console.log('Available actions: test, step, goals');
  }
}
