const axios = require('axios');

// Facebook configuration - Fixed solution with correct Lead Form creation
const ACCESS_TOKEN = 'EAALXeRNJkWEBQHMDW8gec3wTtIMu7Gtmi6wPUnNbLWdIc41Y2PuJfrVZBcHYjGtynHiZC8S9aEJbUw0zWC9R6Q8WpyFz0OVjZABW2ICsQTO478SPN6BD9B8Xmiyqidbp77AjRLLfux2q4K2jhZAQZBXcg5yrOtw6YhZA3uEfpz6cGm6vOMZAVCZAinKg9cKdLvczbgZDZD';
const PAGE_ID = '923280350869125';
const ACCOUNT_ID = '1747779905752071';
const API_VERSION = 'v22.0';

// Red creative URL
const RED_CREATIVE_URL = 'https://via.placeholder.com/1200x628/dc2626/ffffff?text=🔥+מציאה+חמה!+השקעה+בישראל+849,000₪';

// Function to create working red ad with fixed Lead Form
async function createFixedRedAd() {
  try {
    console.log('🚀 Creating Fixed Red Ad (with correct Lead Form)...\n');
    console.log('═'.repeat(70));
    
    // Step 1: Create Campaign with HOUSING category
    console.log('1️⃣ Creating Campaign with HOUSING category...');
    const campaignData = {
      name: 'השקעות פרימיום - מודעה אדומה מתוקנת',
      objective: 'OUTCOME_LEADS',
      status: 'PAUSED',
      special_ad_categories: ['HOUSING'],
      special_ad_category_country: ['IL'],
      access_token: ACCESS_TOKEN
    };
    
    const campaignResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/campaigns`, campaignData);
    const campaignId = campaignResponse.data.id;
    console.log('✅ Campaign created:', campaignId);
    
    // Step 2: Create Ad Set
    console.log('\n2️⃣ Creating Ad Set...');
    const adSetData = {
      name: 'השקעות ישראל - קהל יעד מתוקן',
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
      }),
      access_token: ACCESS_TOKEN
    };
    
    const adSetResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/adsets`, adSetData);
    const adSetId = adSetResponse.data.id;
    console.log('✅ Ad Set created:', adSetId);
    
    // Step 3: Create Lead Form (FIXED - using page endpoint with all required fields)
    console.log('\n3️⃣ Creating Lead Form (COMPLETE METHOD)...');
    const leadFormData = {
      name: `טופס השקעות - ${Date.now()}`,
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
      thank_you_message: 'תודה רבה! נחזור אליך תוך 24 שעות עם פרטים מלאים על ההשקעה.',
      privacy_policy: JSON.stringify({
        url: 'https://www.facebook.com/privacy/explanation',
        link_text: 'מדיניות פרטיות'
      }),
      follow_up_action_url: 'https://www.facebook.com/privacy/explanation',
      access_token: ACCESS_TOKEN
    };
    
    // Use PAGE endpoint instead of ad account endpoint for lead forms
    const leadFormResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/${PAGE_ID}/leadgen_forms`, leadFormData);
    const leadFormId = leadFormResponse.data.id;
    console.log('✅ Lead Form created:', leadFormId);
    
    // Step 4: Create Ad Creative (without custom image - using text only)
    console.log('\n4️⃣ Creating Text-Based Red Creative (No Image Upload)...');
    const creativeData = {
      name: 'קריאייטיב אדום - השקעות מתוקן (טקסט בלבד)',
      object_story_spec: JSON.stringify({
        page_id: PAGE_ID,
        link_data: {
          call_to_action: {
            type: 'LEARN_MORE',
            value: {
              lead_gen_form_id: leadFormId
            }
          },
          link: 'https://www.facebook.com/privacy/explanation',
          description: 'הזדמנות השקעה ייחודית בישראל במיקום מעולה עם פוטנציאל עליית ערך גבוה.',
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
      access_token: ACCESS_TOKEN
    };
    
    const creativeResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/adcreatives`, creativeData);
    const creativeId = creativeResponse.data.id;
    console.log('✅ Creative created:', creativeId);
    
    // Step 5: Create Final Ad (with tracking)
    console.log('\n5️⃣ Creating Final Red Ad...');
    const adData = {
      name: 'מודעה אדומה - השקעות פרימיום מתוקנת',
      adset_id: adSetId,
      creative: JSON.stringify({
        creative_id: creativeId
      }),
      status: 'PAUSED',
      special_ad_categories: ['HOUSING'],
      special_ad_category_country: ['IL'],
      access_token: ACCESS_TOKEN
    };
    
    const adResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/ads`, adData);
    const adId = adResponse.data.id;
    console.log('✅ Final ad created:', adId);
    
    // Success Summary
    console.log('\n🎉 RED AD CREATED SUCCESSFULLY! (FIXED VERSION)');
    console.log('═'.repeat(70));
    console.log('📊 Complete Summary:');
    console.log(`   🚀 Campaign ID: ${campaignId}`);
    console.log(`   📊 Ad Set ID: ${adSetId}`);
    console.log(`   📝 Lead Form ID: ${leadFormId}`);
    console.log(`   🎨 Creative ID: ${creativeId}`);
    console.log(`   📢 Ad ID: ${adId}`);
    console.log(`   🖼️ Creative Type: Text-based (no custom image)`);
    
    console.log('\n🔴 Creative Details:');
    console.log('   • Type: Text-based lead ad');
    console.log('   • Emojis: 🔥💰📍📈⏰🎯📞');
    console.log('   • Language: Hebrew');
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
    
    console.log('\n✅ Key Fixes Applied:');
    console.log('   • Lead Form created via PAGE endpoint (not ad account)');
    console.log('   • Added privacy policy and follow-up URL');
    console.log('   • Text-based creative (no image upload needed)');
    console.log('   • All HOUSING compliance requirements met');
    
    return {
      campaign: { id: campaignId },
      adSet: { id: adSetId },
      leadForm: { id: leadFormId },
      creative: { id: creativeId },
      ad: { id: adId },
      creativeType: 'text-based',
      redCreativeUrl: RED_CREATIVE_URL
    };
    
  } catch (error) {
    console.error('\n❌ Fixed red ad creation failed:', error.response?.data || error.message);
    
    // Detailed error analysis
    if (error.response?.data?.error) {
      const errorMsg = error.response.data.error.message;
      const errorCode = error.response.data.error.code;
      
      console.log('\n🔍 Detailed Error Analysis:');
      console.log(`   Code: ${errorCode}`);
      console.log(`   Message: ${errorMsg}`);
      
      if (errorMsg.includes('leadgen_forms')) {
        console.log('\n📝 Lead Form Issue:');
        console.log('   • Using PAGE endpoint for lead forms');
        console.log('   • Make sure page has lead ads permission');
        console.log('   • Check if page is connected to Business Manager');
      }
      
      if (errorMsg.includes('special_ad_categories')) {
        console.log('\n🏠 Housing Category Issue:');
        console.log('   • HOUSING category is mandatory for this account');
        console.log('   • Cannot create campaigns without it');
        console.log('   • This is account-level restriction');
      }
    }
    
    throw error;
  }
}

// Export functions
module.exports = {
  createFixedRedAd,
  RED_CREATIVE_URL
};

// Run if called directly
if (require.main === module) {
  createFixedRedAd();
}
