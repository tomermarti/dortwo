const axios = require('axios');

// Facebook Ads configuration
const USER_ACCESS_TOKEN = 'EAALXeRNJkWEBQHMDW8gec3wTtIMu7Gtmi6wPUnNbLWdIc41Y2PuJfrVZBcHYjGtynHiZC8S9aEJbUw0zWC9R6Q8WpyFz0OVjZABW2ICsQTO478SPN6BD9B8Xmiyqidbp77AjRLLfux2q4K2jhZAQZBXcg5yrOtw6YhZA3uEfpz6cGm6vOMZAVCZAinKg9cKdLvczbgZDZD';
const PAGE_ID = '923280350869125';
const ACCOUNT_ID = '1747779905752071';

// Function to get account info
async function getAccountInfo() {
  try {
    console.log('🔍 Getting Facebook Ad Account information...');
    
    const response = await axios.get(`https://graph.facebook.com/v22.0/act_${ACCOUNT_ID}`, {
      params: {
        fields: 'name,account_status,currency,timezone_name,business,funding_source_details',
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

// Function to create a campaign
async function createLeadCampaign() {
  try {
    console.log('🚀 Creating Lead Generation Campaign...');
    
    const campaignData = {
      name: 'קרקעות פרימיום - מודעות ליד',
      objective: 'OUTCOME_LEADS', // Updated objective name
      status: 'PAUSED', // Start paused for review
      special_ad_categories: ['HOUSING'], // Required for real estate ads
      access_token: USER_ACCESS_TOKEN
    };
    
    const response = await axios.post(`https://graph.facebook.com/v22.0/act_${ACCOUNT_ID}/campaigns`, campaignData);
    
    console.log('✅ Campaign created successfully!');
    console.log('🆔 Campaign ID:', response.data.id);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error creating campaign:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create ad set
async function createAdSet(campaignId) {
  try {
    console.log('📊 Creating Ad Set...');
    
    const adSetData = {
      name: 'קרקעות תל אביב - קהל יעד',
      campaign_id: campaignId,
      daily_budget: 5000, // 50 NIS in agorot
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LEAD_GENERATION',
      bid_amount: 1000, // 10 NIS per lead (required for bid strategy)
      status: 'PAUSED',
      special_ad_categories: ['HOUSING'], // Required for real estate ads
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
          { id: '6003020834693', name: 'Investment' },
          { id: '6003139266461', name: 'Real estate investing' }
        ]
      }),
      access_token: USER_ACCESS_TOKEN
    };
    
    const response = await axios.post(`https://graph.facebook.com/v22.0/act_${ACCOUNT_ID}/adsets`, adSetData);
    
    console.log('✅ Ad Set created successfully!');
    console.log('🆔 Ad Set ID:', response.data.id);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error creating ad set:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create lead form
async function createLeadForm() {
  try {
    console.log('📝 Creating Lead Form...');
    
    const leadFormData = {
      name: 'טופס ליד - קרקעות פרימיום',
      page_id: PAGE_ID,
      locale: 'he_IL',
      privacy_policy_url: 'https://your-website.com/privacy', // Replace with actual URL
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
          key: 'investment_budget',
          label: 'תקציב השקעה משוער',
          options: [
            'עד 500,000₪',
            '500,000-1,000,000₪',
            'מעל 1,000,000₪'
          ]
        }
      ]),
      thank_you_message: 'תודה על פנייתך! נחזור אליך תוך 24 שעות עם פרטים מלאים על ההזדמנות.',
      access_token: USER_ACCESS_TOKEN
    };
    
    const response = await axios.post(`https://graph.facebook.com/v22.0/act_${ACCOUNT_ID}/leadgen_forms`, leadFormData);
    
    console.log('✅ Lead Form created successfully!');
    console.log('🆔 Lead Form ID:', response.data.id);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error creating lead form:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create ad creative
async function createAdCreative(leadFormId) {
  try {
    console.log('🎨 Creating Ad Creative...');
    
    const creativeData = {
      name: 'קרקעות פרימיום - קריאייטיב',
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
          image_hash: '', // Will be updated with actual image
          link: 'https://your-website.com', // Replace with actual URL
          message: `🔥 מציאה חמה! קרקע בתל אביב ללא מגבלת קומות

💰 החל מ-849,000₪ בלבד
📍 מיקום פרימיום על קווי התחבורה
⏰ רק 3 יחידות נותרו!

לפרטים מלאים - מלא את הטופס ונחזור אליך תוך שעה`,
          name: 'קרקע פרימיום בתל אביב - השקעה נדירה'
        }
      }),
      access_token: USER_ACCESS_TOKEN
    };
    
    const response = await axios.post(`https://graph.facebook.com/v22.0/act_${ACCOUNT_ID}/adcreatives`, creativeData);
    
    console.log('✅ Ad Creative created successfully!');
    console.log('🆔 Creative ID:', response.data.id);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error creating ad creative:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create the actual ad
async function createAd(adSetId, creativeId) {
  try {
    console.log('📢 Creating Ad...');
    
    const adData = {
      name: 'קרקעות פרימיום - מודעה ראשית',
      adset_id: adSetId,
      creative: JSON.stringify({
        creative_id: creativeId
      }),
      status: 'PAUSED',
      special_ad_categories: ['HOUSING'], // Required for real estate ads
      access_token: USER_ACCESS_TOKEN
    };
    
    const response = await axios.post(`https://graph.facebook.com/v22.0/act_${ACCOUNT_ID}/ads`, adData);
    
    console.log('✅ Ad created successfully!');
    console.log('🆔 Ad ID:', response.data.id);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error creating ad:', error.response?.data || error.message);
    throw error;
  }
}

// Function to get lead form submissions
async function getLeadFormSubmissions(leadFormId) {
  try {
    console.log('📋 Getting lead form submissions...');
    
    const response = await axios.get(`https://graph.facebook.com/v22.0/${leadFormId}/leads`, {
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

// Main function to create complete campaign
async function createCompleteCampaign() {
  try {
    console.log('🎯 Creating Complete Lead Generation Campaign\n');
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
    
    console.log('\n🎉 CAMPAIGN CREATED SUCCESSFULLY!');
    console.log('📊 Summary:');
    console.log(`   🚀 Campaign ID: ${campaign.id}`);
    console.log(`   📊 Ad Set ID: ${adSet.id}`);
    console.log(`   📝 Lead Form ID: ${leadForm.id}`);
    console.log(`   🎨 Creative ID: ${creative.id}`);
    console.log(`   📢 Ad ID: ${ad.id}`);
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Review campaign in Facebook Ads Manager');
    console.log('   2. Upload images to the ad creative');
    console.log('   3. Test the lead form');
    console.log('   4. Activate the campaign when ready');
    
    return {
      campaign,
      adSet,
      leadForm,
      creative,
      ad
    };
    
  } catch (error) {
    console.error('\n❌ Campaign creation failed:', error.message);
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
  getLeadFormSubmissions,
  createCompleteCampaign,
  ACCOUNT_ID,
  PAGE_ID
};

// Run if called directly
if (require.main === module) {
  const action = process.argv[2] || 'info';
  
  switch (action) {
    case 'info':
      getAccountInfo();
      break;
    case 'campaign':
      createCompleteCampaign();
      break;
    case 'leads':
      const leadFormId = process.argv[3];
      if (leadFormId) {
        getLeadFormSubmissions(leadFormId);
      } else {
        console.log('❌ Please provide lead form ID: node facebook-ads-manager.js leads FORM_ID');
      }
      break;
    default:
      console.log('Available actions: info, campaign, leads');
  }
}
