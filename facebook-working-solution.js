const axios = require('axios');

// Facebook configuration - Working solution with mandatory special_ad_categories
const USER_ACCESS_TOKEN = 'EAALXeRNJkWEBQHMDW8gec3wTtIMu7Gtmi6wPUnNbLWdIc41Y2PuJfrVZBcHYjGtynHiZC8S9aEJbUw0zWC9R6Q8WpyFz0OVjZABW2ICsQTO478SPN6BD9B8Xmiyqidbp77AjRLLfux2q4K2jhZAQZBXcg5yrOtw6YhZA3uEfpz6cGm6vOMZAVCZAinKg9cKdLvczbgZDZD';
const PAGE_ID = '923280350869125';
const ACCOUNT_ID = '1747779905752071';
const API_VERSION = 'v22.0';

// Red creative URL
const RED_CREATIVE_URL = 'https://via.placeholder.com/1200x628/dc2626/ffffff?text=🔥+מציאה+חמה!+השקעה+בישראל+849,000₪';

// Function to create working campaign with required special_ad_categories
async function createWorkingRedAd() {
  try {
    console.log('🚀 Creating Working Red Ad (with required special categories)...\n');
    console.log('═'.repeat(70));
    
    // Step 1: Create Campaign with HOUSING category (required by account)
    console.log('1️⃣ Creating Campaign with HOUSING category...');
    const campaignData = {
      name: 'השקעות פרימיום - מודעה אדומה',
      objective: 'OUTCOME_LEADS',
      status: 'PAUSED',
      special_ad_categories: ['HOUSING'], // Required by this account
      special_ad_category_country: ['IL'], // Must match targeting
      access_token: USER_ACCESS_TOKEN
    };
    
    const campaignResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/campaigns`, campaignData);
    const campaignId = campaignResponse.data.id;
    console.log('✅ Campaign created:', campaignId);
    
    // Step 2: Create Ad Set with proper housing targeting
    console.log('\n2️⃣ Creating Ad Set...');
    const adSetData = {
      name: 'השקעות ישראל - קהל יעד',
      campaign_id: campaignId,
      daily_budget: 5000, // 50 NIS
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LEAD_GENERATION',
      bid_amount: 1000, // 10 NIS per lead
      status: 'PAUSED',
      special_ad_categories: ['HOUSING'],
      special_ad_category_country: ['IL'],
      targeting: JSON.stringify({
        geo_locations: {
          countries: ['IL']
        },
        age_min: 25,
        age_max: 65
        // Removed specific interests to avoid additional restrictions
      }),
      access_token: USER_ACCESS_TOKEN
    };
    
    const adSetResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/adsets`, adSetData);
    const adSetId = adSetResponse.data.id;
    console.log('✅ Ad Set created:', adSetId);
    
    // Step 3: Create Lead Form
    console.log('\n3️⃣ Creating Lead Form...');
    const leadFormData = {
      name: 'טופס השקעות - פרימיום',
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
        }
      ]),
      thank_you_message: 'תודה רבה! נחזור אליך תוך 24 שעות עם פרטים מלאים.',
      access_token: USER_ACCESS_TOKEN
    };
    
    const leadFormResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/leadgen_forms`, leadFormData);
    const leadFormId = leadFormResponse.data.id;
    console.log('✅ Lead Form created:', leadFormId);
    
    // Step 4: Upload Red Creative
    console.log('\n4️⃣ Uploading Red Creative Image...');
    const imageResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/adimages`, {
      url: RED_CREATIVE_URL,
      access_token: USER_ACCESS_TOKEN
    });
    const imageHash = Object.keys(imageResponse.data.images)[0];
    console.log('✅ Red image uploaded:', imageHash);
    
    // Step 5: Create Ad Creative
    console.log('\n5️⃣ Creating Red Ad Creative...');
    const creativeData = {
      name: 'קריאייטיב אדום - השקעות',
      object_story_spec: JSON.stringify({
        page_id: PAGE_ID,
        link_data: {
          call_to_action: {
            type: 'LEARN_MORE',
            value: {
              lead_gen_form_id: leadFormId
            }
          },
          description: 'הזדמנות השקעה ייחודית בישראל במיקום מעולה עם פוטנציאל עליית ערך גבוה.',
          image_hash: imageHash,
          message: `🔥 מציאה חמה! הזדמנות השקעה בישראל!

💰 החל מ-849,000₪
📍 מיקום מעולה בישראל
📈 פוטנציאל עליית ערך גבוה
⏰ הזדמנות מוגבלת!

🎯 למה עכשיו הזמן הנכון?
• שוק ההשקעות צומח
• מיקום אסטרטגי
• תשואה גבוהה צפויה

📞 מלא את הטופס לפרטים נוספים!`,
          name: 'השקעה פרימיום בישראל'
        }
      }),
      access_token: USER_ACCESS_TOKEN
    };
    
    const creativeResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/adcreatives`, creativeData);
    const creativeId = creativeResponse.data.id;
    console.log('✅ Creative created:', creativeId);
    
    // Step 6: Create Final Ad
    console.log('\n6️⃣ Creating Final Red Ad...');
    const adData = {
      name: 'מודעה אדומה - השקעות פרימיום',
      adset_id: adSetId,
      creative: JSON.stringify({
        creative_id: creativeId
      }),
      status: 'PAUSED',
      special_ad_categories: ['HOUSING'],
      special_ad_category_country: ['IL'],
      access_token: USER_ACCESS_TOKEN
    };
    
    const adResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/ads`, adData);
    const adId = adResponse.data.id;
    console.log('✅ Final ad created:', adId);
    
    // Success Summary
    console.log('\n🎉 RED AD CREATED SUCCESSFULLY!');
    console.log('═'.repeat(70));
    console.log('📊 Complete Summary:');
    console.log(`   🚀 Campaign ID: ${campaignId}`);
    console.log(`   📊 Ad Set ID: ${adSetId}`);
    console.log(`   📝 Lead Form ID: ${leadFormId}`);
    console.log(`   🎨 Creative ID: ${creativeId}`);
    console.log(`   📢 Ad ID: ${adId}`);
    console.log(`   🖼️ Image Hash: ${imageHash}`);
    
    console.log('\n🔴 Red Creative Details:');
    console.log('   • Background Color: Red (#dc2626)');
    console.log('   • Text Color: White (#ffffff)');
    console.log('   • Dimensions: 1200x628 pixels');
    console.log('   • Format: Facebook feed optimized');
    
    console.log('\n📋 Campaign Settings:');
    console.log('   • Objective: OUTCOME_LEADS');
    console.log('   • Daily Budget: 50₪');
    console.log('   • Cost per Lead: 10₪');
    console.log('   • Location: Israel');
    console.log('   • Age: 25-65');
    console.log('   • Special Category: HOUSING (required)');
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Go to Facebook Ads Manager');
    console.log('   2. Review the red creative preview');
    console.log('   3. Test the lead form functionality');
    console.log('   4. Activate campaign when ready');
    console.log('   5. Monitor performance and optimize');
    
    console.log('\n⚠️ Important Notes:');
    console.log('   • HOUSING category is mandatory for your account');
    console.log('   • All campaigns must include special_ad_categories');
    console.log('   • Content is optimized for housing compliance');
    console.log('   • Red background with white text as requested');
    
    return {
      campaign: { id: campaignId },
      adSet: { id: adSetId },
      leadForm: { id: leadFormId },
      creative: { id: creativeId },
      ad: { id: adId },
      imageHash,
      redCreativeUrl: RED_CREATIVE_URL
    };
    
  } catch (error) {
    console.error('\n❌ Red ad creation failed:', error.response?.data || error.message);
    
    // Detailed error analysis
    if (error.response?.data?.error) {
      const errorMsg = error.response.data.error.message;
      const errorCode = error.response.data.error.code;
      
      console.log('\n🔍 Detailed Error Analysis:');
      console.log(`   Code: ${errorCode}`);
      console.log(`   Message: ${errorMsg}`);
      
      if (errorMsg.includes('special_ad_categories')) {
        console.log('\n💡 Special Ad Categories Issue:');
        console.log('   • Your account requires HOUSING category');
        console.log('   • Cannot create campaigns without it');
        console.log('   • This is account-level restriction');
      }
      
      if (errorMsg.includes('bid_amount')) {
        console.log('\n💰 Bid Amount Issue:');
        console.log('   • Try different bid amounts');
        console.log('   • Current: 1000 (10₪)');
        console.log('   • Try: 500, 1500, 2000');
      }
      
      if (errorMsg.includes('targeting')) {
        console.log('\n🎯 Targeting Issue:');
        console.log('   • Simplified to Israel only');
        console.log('   • Removed specific interests');
        console.log('   • Age range: 25-65');
      }
    }
    
    throw error;
  }
}

// Quick test function
async function quickTest() {
  try {
    console.log('⚡ Quick Test - Creating Simple Campaign with HOUSING...\n');
    
    const campaignData = {
      name: 'Test - HOUSING Required',
      objective: 'OUTCOME_LEADS',
      status: 'PAUSED',
      special_ad_categories: ['HOUSING'],
      special_ad_category_country: ['IL'],
      access_token: USER_ACCESS_TOKEN
    };
    
    const response = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/campaigns`, campaignData);
    
    console.log('✅ SUCCESS! Campaign created with HOUSING category');
    console.log(`   ID: ${response.data.id}`);
    console.log('   This confirms HOUSING category works for your account');
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Quick test failed:', error.response?.data || error.message);
    throw error;
  }
}

// Export functions
module.exports = {
  createWorkingRedAd,
  quickTest,
  RED_CREATIVE_URL
};

// Run based on argument
if (require.main === module) {
  const action = process.argv[2] || 'create';
  
  switch (action) {
    case 'test':
      quickTest();
      break;
    case 'create':
      createWorkingRedAd();
      break;
    default:
      console.log('Available actions: test, create');
  }
}

