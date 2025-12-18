const axios = require('axios');

// Facebook Ads configuration - Updated for API v22.0
const USER_ACCESS_TOKEN = 'EAALXeRNJkWEBQHMDW8gec3wTtIMu7Gtmi6wPUnNbLWdIc41Y2PuJfrVZBcHYjGtynHiZC8S9aEJbUw0zWC9R6Q8WpyFz0OVjZABW2ICsQTO478SPN6BD9B8Xmiyqidbp77AjRLLfux2q4K2jhZAQZBXcg5yrOtw6YhZA3uEfpz6cGm6vOMZAVCZAinKg9cKdLvczbgZDZD';
const PAGE_ID = '923280350869125';
const ACCOUNT_ID = '1747779905752071';

// Updated API endpoints for v22.0
const API_VERSION = 'v22.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

// Function to get account info
async function getAccountInfo() {
  try {
    console.log('🔍 Getting Facebook Ad Account information...');
    
    const response = await axios.get(`${BASE_URL}/act_${ACCOUNT_ID}`, {
      params: {
        fields: 'name,account_status,currency,timezone_name,business',
        access_token: USER_ACCESS_TOKEN
      }
    });
    
    console.log('✅ Account Details:');
    console.log('   📝 Name:', response.data.name);
    console.log('   📊 Status:', response.data.account_status);
    console.log('   💰 Currency:', response.data.currency);
    console.log('   🌍 Timezone:', response.data.timezone_name);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error getting account info:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create a lead generation campaign (v22.0 compatible)
async function createLeadCampaign() {
  try {
    console.log('🚀 Creating Lead Generation Campaign (API v22.0)...');
    
    const campaignData = {
      name: 'קרקעות פרימיום - מודעות ליד v22',
      objective: 'OUTCOME_LEADS', // Updated for v22.0
      status: 'PAUSED',
      special_ad_categories: ['HOUSING'], // Required for real estate
      special_ad_category_country: ['IL'], // Must match targeting countries
      access_token: USER_ACCESS_TOKEN
    };
    
    const response = await axios.post(`${BASE_URL}/act_${ACCOUNT_ID}/campaigns`, campaignData);
    
    console.log('✅ Campaign created successfully!');
    console.log('🆔 Campaign ID:', response.data.id);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error creating campaign:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create ad set (v22.0 compatible)
async function createAdSet(campaignId) {
  try {
    console.log('📊 Creating Ad Set (API v22.0)...');
    
    const adSetData = {
      name: 'קרקעות תל אביב - קהל יעד v22',
      campaign_id: campaignId,
      daily_budget: 5000, // 50 NIS in agorot
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LEAD_GENERATION',
      bid_amount: 1000, // 10 NIS per lead (required for bid strategy)
      status: 'PAUSED',
      special_ad_categories: ['HOUSING'],
      special_ad_category_country: ['IL'], // Must match targeting countries
      targeting: JSON.stringify({
        geo_locations: {
          countries: ['IL'],
          regions: [
            { key: '3847' } // Tel Aviv District
          ]
        },
        age_min: 25,
        age_max: 65,
        interests: [
          { id: '6003107902433', name: 'Real estate' },
          { id: '6003020834693', name: 'Investment' }
        ]
      }),
      access_token: USER_ACCESS_TOKEN
    };
    
    const response = await axios.post(`${BASE_URL}/act_${ACCOUNT_ID}/adsets`, adSetData);
    
    console.log('✅ Ad Set created successfully!');
    console.log('🆔 Ad Set ID:', response.data.id);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error creating ad set:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create lead form (v22.0 compatible)
async function createLeadForm() {
  try {
    console.log('📝 Creating Lead Form (API v22.0)...');
    
    const leadFormData = {
      name: 'טופס ליד - קרקעות פרימיום v22',
      page_id: PAGE_ID,
      locale: 'he_IL',
      questions: JSON.stringify([
        {
          type: 'FULL_NAME',
          key: 'full_name'
        },
        {
          type: 'EMAIL', 
          key: 'email'
        },
        {
          type: 'PHONE',
          key: 'phone'
        },
        {
          type: 'CUSTOM',
          key: 'budget',
          label: 'תקציב השקעה',
          options: [
            'עד 500,000₪',
            '500,000-1,000,000₪', 
            'מעל 1,000,000₪'
          ]
        }
      ]),
      thank_you_message: 'תודה רבה! נחזור אליך תוך 24 שעות עם פרטים מלאים.',
      access_token: USER_ACCESS_TOKEN
    };
    
    const response = await axios.post(`${BASE_URL}/act_${ACCOUNT_ID}/leadgen_forms`, leadFormData);
    
    console.log('✅ Lead Form created successfully!');
    console.log('🆔 Lead Form ID:', response.data.id);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error creating lead form:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create ad creative (v22.0 compatible)
async function createAdCreative(leadFormId) {
  try {
    console.log('🎨 Creating Ad Creative (API v22.0)...');
    
    const creativeData = {
      name: 'קרקעות פרימיום - קריאייטיב v22',
      object_story_spec: JSON.stringify({
        page_id: PAGE_ID,
        link_data: {
          call_to_action: {
            type: 'LEARN_MORE',
            value: {
              lead_gen_form_id: leadFormId
            }
          },
          description: 'השקעה נדירה בקרקע בתל אביב ללא מגבלת קומות. מיקום אסטרטגי על קווי המטרו והרכבת הקלה.',
          message: `🔥 מציאה חמה! קרקע בתל אביב ללא מגבלת קומות

💰 החל מ-849,000₪ בלבד
📍 מיקום פרימיום על קווי התחבורה
⏰ רק 3 יחידות נותרו!

למלא את הטופס ונחזור אליך תוך שעה`,
          name: 'קרקע פרימיום בתל אביב - השקעה נדירה'
        }
      }),
      access_token: USER_ACCESS_TOKEN
    };
    
    const response = await axios.post(`${BASE_URL}/act_${ACCOUNT_ID}/adcreatives`, creativeData);
    
    console.log('✅ Ad Creative created successfully!');
    console.log('🆔 Creative ID:', response.data.id);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error creating ad creative:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create the actual ad (v22.0 compatible)
async function createAd(adSetId, creativeId) {
  try {
    console.log('📢 Creating Ad (API v22.0)...');
    
    const adData = {
      name: 'קרקעות פרימיום - מודעה v22',
      adset_id: adSetId,
      creative: JSON.stringify({
        creative_id: creativeId
      }),
      status: 'PAUSED',
      special_ad_categories: ['HOUSING'],
      special_ad_category_country: ['IL'], // Must match targeting countries
      access_token: USER_ACCESS_TOKEN
    };
    
    const response = await axios.post(`${BASE_URL}/act_${ACCOUNT_ID}/ads`, adData);
    
    console.log('✅ Ad created successfully!');
    console.log('🆔 Ad ID:', response.data.id);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error creating ad:', error.response?.data || error.message);
    throw error;
  }
}

// Function to get leads from form
async function getLeads(leadFormId) {
  try {
    console.log('📋 Getting leads from form...');
    
    const response = await axios.get(`${BASE_URL}/${leadFormId}/leads`, {
      params: {
        access_token: USER_ACCESS_TOKEN
      }
    });
    
    console.log(`✅ Found ${response.data.data.length} leads`);
    
    response.data.data.forEach((lead, index) => {
      console.log(`\n📝 Lead ${index + 1}:`);
      console.log('   🆔 ID:', lead.id);
      console.log('   📅 Created:', new Date(lead.created_time).toLocaleString('he-IL'));
      
      if (lead.field_data) {
        lead.field_data.forEach(field => {
          console.log(`   ${field.name}: ${field.values[0]}`);
        });
      }
    });
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error getting leads:', error.response?.data || error.message);
    throw error;
  }
}

// Main function to create complete campaign (v22.0)
async function createCompleteCampaignV22() {
  try {
    console.log('🎯 Creating Complete Lead Campaign (API v22.0)\n');
    console.log('═'.repeat(60));
    
    // Step 1: Get account info
    await getAccountInfo();
    
    // Step 2: Create campaign
    console.log('\n' + '─'.repeat(30));
    const campaign = await createLeadCampaign();
    
    // Step 3: Create ad set
    console.log('\n' + '─'.repeat(30));
    const adSet = await createAdSet(campaign.id);
    
    // Step 4: Create lead form
    console.log('\n' + '─'.repeat(30));
    const leadForm = await createLeadForm();
    
    // Step 5: Create ad creative
    console.log('\n' + '─'.repeat(30));
    const creative = await createAdCreative(leadForm.id);
    
    // Step 6: Create ad
    console.log('\n' + '─'.repeat(30));
    const ad = await createAd(adSet.id, creative.id);
    
    console.log('\n🎉 CAMPAIGN CREATED SUCCESSFULLY (API v22.0)!');
    console.log('📊 Summary:');
    console.log(`   🚀 Campaign ID: ${campaign.id}`);
    console.log(`   📊 Ad Set ID: ${adSet.id}`);
    console.log(`   📝 Lead Form ID: ${leadForm.id}`);
    console.log(`   🎨 Creative ID: ${creative.id}`);
    console.log(`   📢 Ad ID: ${ad.id}`);
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Review campaign in Facebook Ads Manager');
    console.log('   2. Add images to the ad creative');
    console.log('   3. Test the lead form');
    console.log('   4. Activate when ready');
    
    return {
      campaign,
      adSet,
      leadForm,
      creative,
      ad
    };
    
  } catch (error) {
    console.error('\n❌ Campaign creation failed:', error.message);
    console.log('\n🔧 Common issues:');
    console.log('   • Check access token permissions');
    console.log('   • Verify account has HOUSING category approval');
    console.log('   • Ensure sufficient account balance');
    throw error;
  }
}

// Export functions
module.exports = {
  getAccountInfo,
  createLeadCampaign,
  createAdSet,
  createLeadForm,
  createAdCreative,
  createAd,
  getLeads,
  createCompleteCampaignV22,
  ACCOUNT_ID,
  PAGE_ID,
  API_VERSION
};

// Run if called directly
if (require.main === module) {
  const action = process.argv[2] || 'info';
  
  switch (action) {
    case 'info':
      getAccountInfo();
      break;
    case 'campaign':
      createCompleteCampaignV22();
      break;
    case 'leads':
      const leadFormId = process.argv[3];
      if (leadFormId) {
        getLeads(leadFormId);
      } else {
        console.log('❌ Please provide lead form ID');
      }
      break;
    default:
      console.log('Available actions: info, campaign, leads');
  }
}
