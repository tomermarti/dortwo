const axios = require('axios');

// Facebook configuration - Simple version WITHOUT housing category
const USER_ACCESS_TOKEN = 'EAALXeRNJkWEBQHMDW8gec3wTtIMu7Gtmi6wPUnNbLWdIc41Y2PuJfrVZBcHYjGtynHiZC8S9aEJbUw0zWC9R6Q8WpyFz0OVjZABW2ICsQTO478SPN6BD9B8Xmiyqidbp77AjRLLfux2q4K2jhZAQZBXcg5yrOtw6YhZA3uEfpz6cGm6vOMZAVCZAinKg9cKdLvczbgZDZD';
const PAGE_ID = '923280350869125';
const ACCOUNT_ID = '1747779905752071';
const API_VERSION = 'v22.0';

// Red creative image URL
const RED_CREATIVE_URL = 'https://via.placeholder.com/1200x628/dc2626/ffffff?text=🔥+מציאה+חמה!+קרקע+בתל+אביב+849,000₪';

// Function to create simple campaign WITHOUT housing restrictions
async function createSimpleAdWithoutHousing() {
  try {
    console.log('🚀 Creating Simple Ad WITHOUT Housing Category...\n');
    console.log('═'.repeat(60));
    
    // Step 1: Create Campaign (NO special_ad_categories)
    console.log('1️⃣ Creating Campaign...');
    const campaignData = {
      name: 'קרקעות פרימיום - פשוט',
      objective: 'OUTCOME_LEADS',
      status: 'PAUSED',
      // NO special_ad_categories - avoiding housing restrictions
      access_token: USER_ACCESS_TOKEN
    };
    
    const campaignResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/campaigns`, campaignData);
    const campaignId = campaignResponse.data.id;
    console.log('✅ Campaign created:', campaignId);
    
    // Step 2: Create Ad Set (NO special_ad_categories)
    console.log('\n2️⃣ Creating Ad Set...');
    const adSetData = {
      name: 'קרקעות תל אביב - פשוט',
      campaign_id: campaignId,
      daily_budget: 5000, // 50 NIS
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LEAD_GENERATION',
      bid_amount: 1000, // 10 NIS per lead
      status: 'PAUSED',
      // NO special_ad_categories - avoiding restrictions
      targeting: JSON.stringify({
        geo_locations: {
          countries: ['IL']
        },
        age_min: 25,
        age_max: 65
      }),
      access_token: USER_ACCESS_TOKEN
    };
    
    const adSetResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/adsets`, adSetData);
    const adSetId = adSetResponse.data.id;
    console.log('✅ Ad Set created:', adSetId);
    
    // Step 3: Create Lead Form
    console.log('\n3️⃣ Creating Lead Form...');
    const leadFormData = {
      name: 'טופס ליד - פשוט',
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
      thank_you_message: 'תודה! נחזור אליך בקרוב.',
      access_token: USER_ACCESS_TOKEN
    };
    
    const leadFormResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/leadgen_forms`, leadFormData);
    const leadFormId = leadFormResponse.data.id;
    console.log('✅ Lead Form created:', leadFormId);
    
    // Step 4: Upload Image
    console.log('\n4️⃣ Uploading Red Creative...');
    const imageResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/adimages`, {
      url: RED_CREATIVE_URL,
      access_token: USER_ACCESS_TOKEN
    });
    const imageHash = Object.keys(imageResponse.data.images)[0];
    console.log('✅ Red image uploaded:', imageHash);
    
    // Step 5: Create Creative
    console.log('\n5️⃣ Creating Ad Creative...');
    const creativeData = {
      name: 'קריאייטיב אדום פשוט',
      object_story_spec: JSON.stringify({
        page_id: PAGE_ID,
        link_data: {
          call_to_action: {
            type: 'LEARN_MORE',
            value: {
              lead_gen_form_id: leadFormId
            }
          },
          description: 'השקעה חכמה בקרקע בתל אביב. מיקום מעולה עם פוטנציאל עליית ערך גבוה.',
          image_hash: imageHash,
          message: `🔥 מציאה חמה! קרקע בתל אביב!

💰 החל מ-849,000₪
📍 מיקום מעולה בתל אביב
📈 פוטנציאל עליית ערך גבוה
⏰ הזדמנות מוגבלת!

📞 למלא את הטופס לפרטים נוספים`,
          name: 'השקעה חכמה בתל אביב'
        }
      }),
      access_token: USER_ACCESS_TOKEN
    };
    
    const creativeResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/adcreatives`, creativeData);
    const creativeId = creativeResponse.data.id;
    console.log('✅ Creative created:', creativeId);
    
    // Step 6: Create Ad
    console.log('\n6️⃣ Creating Final Ad...');
    const adData = {
      name: 'מודעה אדומה פשוטה',
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
    console.log('\n🎉 SIMPLE AD CREATED SUCCESSFULLY!');
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
    console.log('   • Message: Hebrew real estate');
    
    console.log('\n⚠️ Important Notes:');
    console.log('   • NO housing category restrictions');
    console.log('   • Simpler targeting (Israel only)');
    console.log('   • Basic lead form (name, email, phone)');
    console.log('   • Should work without approval issues');
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Check Facebook Ads Manager');
    console.log('   2. Review ad preview');
    console.log('   3. Test lead form');
    console.log('   4. Activate when ready');
    
    return {
      campaign: { id: campaignId },
      adSet: { id: adSetId },
      leadForm: { id: leadFormId },
      creative: { id: creativeId },
      ad: { id: adId },
      imageHash
    };
    
  } catch (error) {
    console.error('\n❌ Ad creation failed:', error.response?.data || error.message);
    
    // Detailed error analysis
    if (error.response?.data?.error) {
      const errorMsg = error.response.data.error.message;
      console.log('\n🔍 Error Analysis:');
      
      if (errorMsg.includes('special_ad_categories')) {
        console.log('   • Housing category issue - this version should avoid it');
      }
      if (errorMsg.includes('bid_amount')) {
        console.log('   • Bid amount issue - try different values');
      }
      if (errorMsg.includes('targeting')) {
        console.log('   • Targeting issue - simplified to Israel only');
      }
      if (errorMsg.includes('image')) {
        console.log('   • Image issue - using simple placeholder');
      }
    }
    
    throw error;
  }
}

// Test function to check what works
async function testBasicFunctionality() {
  try {
    console.log('🧪 Testing Basic Facebook API Functionality...\n');
    
    // Test 1: Account access
    console.log('1️⃣ Testing account access...');
    const accountResponse = await axios.get(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}`, {
      params: {
        fields: 'name,account_status',
        access_token: USER_ACCESS_TOKEN
      }
    });
    console.log('✅ Account:', accountResponse.data.name);
    console.log('✅ Status:', accountResponse.data.account_status);
    
    // Test 2: Page access
    console.log('\n2️⃣ Testing page access...');
    const pageResponse = await axios.get(`https://graph.facebook.com/${API_VERSION}/${PAGE_ID}`, {
      params: {
        fields: 'name',
        access_token: USER_ACCESS_TOKEN
      }
    });
    console.log('✅ Page:', pageResponse.data.name);
    
    console.log('\n✅ All basic tests passed! Ready to create ads.');
    
  } catch (error) {
    console.error('❌ Basic test failed:', error.response?.data || error.message);
  }
}

// Export functions
module.exports = {
  createSimpleAdWithoutHousing,
  testBasicFunctionality,
  RED_CREATIVE_URL
};

// Run based on argument
if (require.main === module) {
  const action = process.argv[2] || 'create';
  
  switch (action) {
    case 'test':
      testBasicFunctionality();
      break;
    case 'create':
      createSimpleAdWithoutHousing();
      break;
    default:
      console.log('Available actions: test, create');
  }
}
