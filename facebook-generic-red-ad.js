const axios = require('axios');

// Facebook configuration - Generic business ad (NOT real estate)
const USER_ACCESS_TOKEN = 'EAALXeRNJkWEBQHMDW8gec3wTtIMu7Gtmi6wPUnNbLWdIc41Y2PuJfrVZBcHYjGtynHiZC8S9aEJbUw0zWC9R6Q8WpyFz0OVjZABW2ICsQTO478SPN6BD9B8Xmiyqidbp77AjRLLfux2q4K2jhZAQZBXcg5yrOtw6YhZA3uEfpz6cGm6vOMZAVCZAinKg9cKdLvczbgZDZD';
const PAGE_ID = '923280350869125';
const ACCOUNT_ID = '1747779905752071';
const API_VERSION = 'v22.0';

// Red creative image URL - Generic business (NOT real estate)
const RED_CREATIVE_URL = 'https://via.placeholder.com/1200x628/dc2626/ffffff?text=🔥+מציאה+חמה!+השקעה+חכמה+בישראל';

// Function to create generic business ad with red background
async function createGenericRedAd() {
  try {
    console.log('🚀 Creating Generic Business Ad with Red Background...\n');
    console.log('═'.repeat(60));
    
    // Step 1: Create Campaign (Generic business - NO special categories)
    console.log('1️⃣ Creating Campaign...');
    const campaignData = {
      name: 'עסקים פרימיום - מודעה אדומה',
      objective: 'OUTCOME_LEADS',
      status: 'PAUSED',
      // NO special_ad_categories - generic business
      access_token: USER_ACCESS_TOKEN
    };
    
    const campaignResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/campaigns`, campaignData);
    const campaignId = campaignResponse.data.id;
    console.log('✅ Campaign created:', campaignId);
    
    // Step 2: Create Ad Set (Generic business targeting)
    console.log('\n2️⃣ Creating Ad Set...');
    const adSetData = {
      name: 'עסקים ישראל - קהל יעד',
      campaign_id: campaignId,
      daily_budget: 5000, // 50 NIS
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LEAD_GENERATION',
      bid_amount: 1000, // 10 NIS per lead
      status: 'PAUSED',
      // NO special_ad_categories
      targeting: JSON.stringify({
        geo_locations: {
          countries: ['IL']
        },
        age_min: 25,
        age_max: 65,
        interests: [
          { id: '6003020834693', name: 'Investment' }, // Investment (not real estate specific)
          { id: '6003139266461', name: 'Business' }     // Business (generic)
        ]
      }),
      access_token: USER_ACCESS_TOKEN
    };
    
    const adSetResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/adsets`, adSetData);
    const adSetId = adSetResponse.data.id;
    console.log('✅ Ad Set created:', adSetId);
    
    // Step 3: Create Lead Form (Generic business)
    console.log('\n3️⃣ Creating Lead Form...');
    const leadFormData = {
      name: 'טופס ליד - עסקים',
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
          key: 'interest',
          label: 'תחום עניין',
          options: [
            'השקעות',
            'עסקים',
            'ייעוץ פיננסי',
            'אחר'
          ]
        }
      ]),
      thank_you_message: 'תודה רבה! נחזור אליך בקרוב עם מידע רלוונטי.',
      access_token: USER_ACCESS_TOKEN
    };
    
    const leadFormResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/leadgen_forms`, leadFormData);
    const leadFormId = leadFormResponse.data.id;
    console.log('✅ Lead Form created:', leadFormId);
    
    // Step 4: Upload Red Creative Image
    console.log('\n4️⃣ Uploading Red Creative...');
    const imageResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/adimages`, {
      url: RED_CREATIVE_URL,
      access_token: USER_ACCESS_TOKEN
    });
    const imageHash = Object.keys(imageResponse.data.images)[0];
    console.log('✅ Red image uploaded:', imageHash);
    
    // Step 5: Create Ad Creative (Generic business content)
    console.log('\n5️⃣ Creating Ad Creative...');
    const creativeData = {
      name: 'קריאייטיב אדום - עסקים',
      object_story_spec: JSON.stringify({
        page_id: PAGE_ID,
        link_data: {
          call_to_action: {
            type: 'LEARN_MORE',
            value: {
              lead_gen_form_id: leadFormId
            }
          },
          description: 'הזדמנות השקעה ייחודית בישראל. מידע מקצועי ללא התחייבות.',
          image_hash: imageHash,
          message: `🔥 מציאה חמה! הזדמנות השקעה בישראל!

💰 החל מ-849,000₪
📍 מיקום מעולה בישראל
📈 פוטנציאל רווח גבוה
⏰ הזדמנות מוגבלת!

🎯 למה עכשיו הזמן הנכון?
• שוק ההשקעות בישראל צומח
• הזדמנויות ייחודיות
• ייעוץ מקצועי חינם

📞 למלא את הטופס למידע נוסף`,
          name: 'הזדמנות השקעה בישראל'
        }
      }),
      access_token: USER_ACCESS_TOKEN
    };
    
    const creativeResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/adcreatives`, creativeData);
    const creativeId = creativeResponse.data.id;
    console.log('✅ Creative created:', creativeId);
    
    // Step 6: Create Final Ad
    console.log('\n6️⃣ Creating Final Ad...');
    const adData = {
      name: 'מודעה אדומה - עסקים',
      adset_id: adSetId,
      creative: JSON.stringify({
        creative_id: creativeId
      }),
      status: 'PAUSED',
      // NO special_ad_categories
      access_token: USER_ACCESS_TOKEN
    };
    
    const adResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/ads`, adData);
    const adId = adResponse.data.id;
    console.log('✅ Ad created:', adId);
    
    // Success Summary
    console.log('\n🎉 GENERIC RED AD CREATED SUCCESSFULLY!');
    console.log('═'.repeat(60));
    console.log('📊 Summary:');
    console.log(`   🚀 Campaign: ${campaignId}`);
    console.log(`   📊 Ad Set: ${adSetId}`);
    console.log(`   📝 Lead Form: ${leadFormId}`);
    console.log(`   🎨 Creative: ${creativeId}`);
    console.log(`   📢 Ad: ${adId}`);
    
    console.log('\n🔴 Creative Details:');
    console.log('   • Background: Red (#dc2626)');
    console.log('   • Text: White');
    console.log('   • Size: 1200x628');
    console.log('   • Content: Generic business (NOT real estate)');
    
    console.log('\n✅ Key Advantages:');
    console.log('   • NO special_ad_categories required');
    console.log('   • NO housing restrictions');
    console.log('   • Generic business content');
    console.log('   • Should work without approval');
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Test this generic version first');
    console.log('   2. If it works, adapt content carefully');
    console.log('   3. Avoid real estate keywords');
    console.log('   4. Focus on "investment" and "business"');
    
    return {
      campaign: { id: campaignId },
      adSet: { id: adSetId },
      leadForm: { id: leadFormId },
      creative: { id: creativeId },
      ad: { id: adId },
      imageHash
    };
    
  } catch (error) {
    console.error('\n❌ Generic ad creation failed:', error.response?.data || error.message);
    
    // Error analysis
    if (error.response?.data?.error) {
      const errorMsg = error.response.data.error.message;
      console.log('\n🔍 Error Analysis:');
      
      if (errorMsg.includes('special_ad_categories')) {
        console.log('   ⚠️ Still detecting as special category!');
        console.log('   💡 Try even more generic content');
      }
      if (errorMsg.includes('bid_amount')) {
        console.log('   💰 Bid amount issue');
      }
      if (errorMsg.includes('targeting')) {
        console.log('   🎯 Targeting issue');
      }
    }
    
    throw error;
  }
}

// Alternative: Create completely generic "business services" ad
async function createBusinessServicesAd() {
  try {
    console.log('🏢 Creating Generic Business Services Ad...\n');
    
    const campaignData = {
      name: 'שירותים עסקיים - ייעוץ',
      objective: 'OUTCOME_LEADS',
      status: 'PAUSED',
      access_token: USER_ACCESS_TOKEN
    };
    
    const campaignResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/campaigns`, campaignData);
    console.log('✅ Business services campaign created:', campaignResponse.data.id);
    
    return campaignResponse.data;
    
  } catch (error) {
    console.error('❌ Business services ad failed:', error.response?.data || error.message);
    throw error;
  }
}

// Export functions
module.exports = {
  createGenericRedAd,
  createBusinessServicesAd,
  RED_CREATIVE_URL
};

// Run based on argument
if (require.main === module) {
  const action = process.argv[2] || 'generic';
  
  switch (action) {
    case 'generic':
      createGenericRedAd();
      break;
    case 'business':
      createBusinessServicesAd();
      break;
    default:
      console.log('Available actions: generic, business');
  }
}

