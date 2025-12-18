const axios = require('axios');

// Facebook configuration - Test only
const USER_ACCESS_TOKEN = 'EAALXeRNJkWEBQHMDW8gec3wTtIMu7Gtmi6wPUnNbLWdIc41Y2PuJfrVZBcHYjGtynHiZC8S9aEJbUw0zWC9R6Q8WpyFz0OVjZABW2ICsQTO478SPN6BD9B8Xmiyqidbp77AjRLLfux2q4K2jhZAQZBXcg5yrOtw6YhZA3uEfpz6cGm6vOMZAVCZAinKg9cKdLvczbgZDZD';
const PAGE_ID = '923280350869125';
const ACCOUNT_ID = '1747779905752071';
const API_VERSION = 'v22.0';

// Test different campaign objectives
async function testCampaignObjectives() {
  const objectives = [
    'OUTCOME_TRAFFIC',
    'OUTCOME_ENGAGEMENT', 
    'OUTCOME_AWARENESS',
    'OUTCOME_LEADS'
  ];
  
  console.log('🧪 Testing Different Campaign Objectives...\n');
  
  for (const objective of objectives) {
    try {
      console.log(`Testing: ${objective}`);
      
      const campaignData = {
        name: `Test - ${objective}`,
        objective: objective,
        status: 'PAUSED',
        access_token: USER_ACCESS_TOKEN
      };
      
      const response = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/campaigns`, campaignData);
      console.log(`✅ ${objective} - SUCCESS! ID: ${response.data.id}`);
      
      // Clean up - delete test campaign
      try {
        await axios.delete(`https://graph.facebook.com/${API_VERSION}/${response.data.id}`, {
          params: { access_token: USER_ACCESS_TOKEN }
        });
        console.log(`🗑️ Cleaned up test campaign`);
      } catch (deleteError) {
        console.log(`⚠️ Could not delete test campaign`);
      }
      
    } catch (error) {
      console.log(`❌ ${objective} - FAILED: ${error.response?.data?.error?.message || error.message}`);
    }
    
    console.log(''); // Empty line
  }
}

// Test simple campaign creation
async function testSimplestCampaign() {
  try {
    console.log('🎯 Testing Simplest Possible Campaign...\n');
    
    const campaignData = {
      name: 'Test Campaign - Simple',
      objective: 'OUTCOME_TRAFFIC', // Simplest objective
      status: 'PAUSED',
      access_token: USER_ACCESS_TOKEN
    };
    
    const response = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/campaigns`, campaignData);
    
    console.log('✅ SUCCESS! Simplest campaign created:');
    console.log(`   ID: ${response.data.id}`);
    console.log(`   Name: ${campaignData.name}`);
    console.log(`   Objective: ${campaignData.objective}`);
    
    console.log('\n💡 This means basic campaign creation works!');
    console.log('   The issue is likely with:');
    console.log('   • Ad Set parameters');
    console.log('   • Creative content');
    console.log('   • Lead form setup');
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Even simplest campaign failed:', error.response?.data || error.message);
    
    if (error.response?.data?.error?.code === 190) {
      console.log('\n🔧 Token issue:');
      console.log('   • Access token may be expired');
      console.log('   • Check token permissions');
    }
    
    if (error.response?.data?.error?.code === 100) {
      console.log('\n🔧 Parameter issue:');
      console.log('   • Check required parameters');
      console.log('   • Verify account access');
    }
    
    throw error;
  }
}

// Test ad set creation (after successful campaign)
async function testSimpleAdSet(campaignId) {
  try {
    console.log('\n📊 Testing Simple Ad Set Creation...');
    
    const adSetData = {
      name: 'Test Ad Set - Simple',
      campaign_id: campaignId,
      daily_budget: 1000, // Minimal budget - 10 NIS
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'IMPRESSIONS', // Simplest goal
      status: 'PAUSED',
      targeting: JSON.stringify({
        geo_locations: {
          countries: ['IL']
        },
        age_min: 18,
        age_max: 65
      }),
      access_token: USER_ACCESS_TOKEN
    };
    
    const response = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/adsets`, adSetData);
    
    console.log('✅ SUCCESS! Simple ad set created:');
    console.log(`   ID: ${response.data.id}`);
    console.log(`   Budget: 10 NIS/day`);
    console.log(`   Goal: IMPRESSIONS`);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Ad set creation failed:', error.response?.data || error.message);
    
    if (error.response?.data?.error?.message?.includes('bid_amount')) {
      console.log('\n💡 Need to add bid_amount parameter');
    }
    
    throw error;
  }
}

// Test complete simple flow
async function testCompleteSimpleFlow() {
  try {
    console.log('🔄 Testing Complete Simple Flow...\n');
    console.log('═'.repeat(50));
    
    // Step 1: Create campaign
    const campaign = await testSimplestCampaign();
    
    // Step 2: Create ad set
    const adSet = await testSimpleAdSet(campaign.id);
    
    console.log('\n🎉 COMPLETE SIMPLE FLOW SUCCESS!');
    console.log('📊 Results:');
    console.log(`   Campaign: ${campaign.id}`);
    console.log(`   Ad Set: ${adSet.id}`);
    
    console.log('\n💡 Next steps to add:');
    console.log('   • Creative with red background');
    console.log('   • Lead form');
    console.log('   • Final ad');
    
    return { campaign, adSet };
    
  } catch (error) {
    console.error('\n❌ Complete flow failed at some step');
    throw error;
  }
}

// Export functions
module.exports = {
  testCampaignObjectives,
  testSimplestCampaign,
  testSimpleAdSet,
  testCompleteSimpleFlow
};

// Run based on argument
if (require.main === module) {
  const action = process.argv[2] || 'flow';
  
  switch (action) {
    case 'objectives':
      testCampaignObjectives();
      break;
    case 'campaign':
      testSimplestCampaign();
      break;
    case 'flow':
      testCompleteSimpleFlow();
      break;
    default:
      console.log('Available actions: objectives, campaign, flow');
  }
}
