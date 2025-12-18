const axios = require('axios');

// Facebook configuration
const USER_ACCESS_TOKEN = 'EAALXeRNJkWEBQHMDW8gec3wTtIMu7Gtmi6wPUnNbLWdIc41Y2PuJfrVZBcHYjGtynHiZC8S9aEJbUw0zWC9R6Q8WpyFz0OVjZABW2ICsQTO478SPN6BD9B8Xmiyqidbp77AjRLLfux2q4K2jhZAQZBXcg5yrOtw6YhZA3uEfpz6cGm6vOMZAVCZAinKg9cKdLvczbgZDZD';
const PAGE_ID = '923280350869125';
const ACCOUNT_ID = '1747779905752071';
const API_VERSION = 'v22.0';

// Red background creative image URLs
const creativeImages = {
  redBanner: 'https://via.placeholder.com/1200x628/dc2626/ffffff?text=🔥+מציאה+חמה!+קרקע+בתל+אביב+849,000₪',
  redSquare: 'https://via.placeholder.com/1080x1080/dc2626/ffffff?text=השקעה+נדירה+בתל+אביב+💎+849K₪',
  redStory: 'https://via.placeholder.com/1080x1920/dc2626/ffffff?text=🏗️+קרקע+פרימיום+תל+אביב+💰+849,000₪'
};

// Function to create complete ad with creative
async function createCompleteAd() {
  try {
    console.log('🚀 Creating Complete Facebook Ad with Red Creative...\n');
    console.log('═'.repeat(60));
    
    // Step 1: Create Campaign
    console.log('1️⃣ Creating Campaign...');
    const campaignData = {
      name: 'קרקעות פרימיום - מודעה אדומה',
      objective: 'OUTCOME_LEADS',
      status: 'PAUSED',
      special_ad_categories: ['HOUSING'],
      special_ad_category_country: ['IL'], // Must match targeting countries
      access_token: USER_ACCESS_TOKEN
    };
    
    const campaignResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/campaigns`, campaignData);
    const campaignId = campaignResponse.data.id;
    console.log('✅ Campaign created:', campaignId);
    
    // Step 2: Create Ad Set
    console.log('\n2️⃣ Creating Ad Set...');
    const adSetData = {
      name: 'קרקעות תל אביב - קהל יעד',
      campaign_id: campaignId,
      daily_budget: 5000, // 50 NIS
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LEAD_GENERATION',
      bid_amount: 1000, // 10 NIS per lead
      status: 'PAUSED',
      special_ad_categories: ['HOUSING'],
      special_ad_category_country: ['IL'], // Must match targeting countries
      targeting: JSON.stringify({
        geo_locations: {
          countries: ['IL'],
          regions: [{ key: '3847' }] // Tel Aviv District
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
    
    const adSetResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/adsets`, adSetData);
    const adSetId = adSetResponse.data.id;
    console.log('✅ Ad Set created:', adSetId);
    
    // Step 3: Create Lead Form
    console.log('\n3️⃣ Creating Lead Form...');
    const leadFormData = {
      name: 'טופס ליד - קרקעות פרימיום',
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
      thank_you_message: 'תודה רבה! נחזור אליך תוך 24 שעות עם פרטים מלאים על ההזדמנות.',
      access_token: USER_ACCESS_TOKEN
    };
    
    const leadFormResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/leadgen_forms`, leadFormData);
    const leadFormId = leadFormResponse.data.id;
    console.log('✅ Lead Form created:', leadFormId);
    
    // Step 4: Upload Creative Image
    console.log('\n4️⃣ Uploading Creative Image...');
    const imageResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/adimages`, {
      url: creativeImages.redBanner,
      access_token: USER_ACCESS_TOKEN
    });
    const imageHash = Object.keys(imageResponse.data.images)[0];
    console.log('✅ Image uploaded, hash:', imageHash);
    
    // Step 5: Create Ad Creative
    console.log('\n5️⃣ Creating Ad Creative...');
    const creativeData = {
      name: 'קריאייטיב אדום - קרקעות פרימיום',
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
          image_hash: imageHash,
          message: `🔥 מציאה חמה! קרקע בתל אביב ללא מגבלת קומות!

💰 החל מ-849,000₪ בלבד
📍 מיקום פרימיום על קווי התחבורה
🚇 מטרו + רכבת קלה + רכבת ישראל
⏰ רק 3 יחידות נותרו!

🎯 למה עכשיו הזמן הנכון?
• פרויקטי התחבורה בעיצומם
• האזור במגמת פיתוח מואצת
• מחירים לפני הקפיצה הגדולה

📞 למלא את הטופס ונחזור אליך תוך שעה!`,
          name: 'קרקע פרימיום בתל אביב - השקעה נדירה'
        }
      }),
      access_token: USER_ACCESS_TOKEN
    };
    
    const creativeResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/adcreatives`, creativeData);
    const creativeId = creativeResponse.data.id;
    console.log('✅ Creative created:', creativeId);
    
    // Step 6: Create the Ad
    console.log('\n6️⃣ Creating Final Ad...');
    const adData = {
      name: 'קרקעות פרימיום - מודעה אדומה',
      adset_id: adSetId,
      creative: JSON.stringify({
        creative_id: creativeId
      }),
      status: 'PAUSED',
      special_ad_categories: ['HOUSING'],
      special_ad_category_country: ['IL'], // Must match targeting countries
      access_token: USER_ACCESS_TOKEN
    };
    
    const adResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/ads`, adData);
    const adId = adResponse.data.id;
    console.log('✅ Ad created:', adId);
    
    // Success Summary
    console.log('\n🎉 COMPLETE AD CREATED SUCCESSFULLY!');
    console.log('═'.repeat(60));
    console.log('📊 Summary:');
    console.log(`   🚀 Campaign ID: ${campaignId}`);
    console.log(`   📊 Ad Set ID: ${adSetId}`);
    console.log(`   📝 Lead Form ID: ${leadFormId}`);
    console.log(`   🎨 Creative ID: ${creativeId}`);
    console.log(`   📢 Ad ID: ${adId}`);
    console.log(`   🖼️ Image Hash: ${imageHash}`);
    
    console.log('\n🎨 Creative Details:');
    console.log('   🔴 Background: Red (#dc2626)');
    console.log('   ⚪ Text: White');
    console.log('   📏 Size: 1200x628 (Facebook recommended)');
    console.log('   💬 Message: Hebrew real estate copy');
    
    console.log('\n💰 Budget & Targeting:');
    console.log('   💵 Daily Budget: 50₪');
    console.log('   🎯 Cost per Lead: 10₪');
    console.log('   📍 Location: Tel Aviv District');
    console.log('   👥 Age: 25-65');
    console.log('   🏠 Interests: Real Estate, Investment');
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Go to Facebook Ads Manager');
    console.log('   2. Review the ad preview');
    console.log('   3. Test the lead form');
    console.log('   4. Activate when ready');
    console.log('   5. Monitor performance');
    
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
    
    // Specific error handling
    if (error.response?.data?.error?.message?.includes('bid_amount')) {
      console.log('\n🔧 Bid amount issue - try different values');
    }
    if (error.response?.data?.error?.message?.includes('special_ad_categories')) {
      console.log('\n🔧 Housing category required for real estate');
    }
    if (error.response?.data?.error?.message?.includes('image')) {
      console.log('\n🔧 Image upload issue - trying fallback...');
    }
    
    throw error;
  }
}

// Function to create multiple creative variations
async function createMultipleCreatives() {
  try {
    console.log('🎨 Creating Multiple Red Creative Variations...\n');
    
    const variations = [
      {
        name: 'Banner - מציאה חמה',
        image: creativeImages.redBanner,
        message: '🔥 מציאה חמה! קרקע בתל אביב 849,000₪'
      },
      {
        name: 'Square - השקעה נדירה', 
        image: creativeImages.redSquare,
        message: '💎 השקעה נדירה בתל אביב! קרקע פרימיום 849K₪'
      },
      {
        name: 'Story - קרקע פרימיום',
        image: creativeImages.redStory,
        message: '🏗️ קרקע פרימיום בתל אביב! החל מ-849,000₪'
      }
    ];
    
    for (let i = 0; i < variations.length; i++) {
      const variation = variations[i];
      console.log(`${i + 1}️⃣ Creating: ${variation.name}`);
      
      try {
        // Upload image
        const imageResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/adimages`, {
          url: variation.image,
          access_token: USER_ACCESS_TOKEN
        });
        
        const imageHash = Object.keys(imageResponse.data.images)[0];
        console.log(`✅ Image uploaded: ${imageHash}`);
        
      } catch (error) {
        console.log(`❌ Failed: ${variation.name}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Multiple creatives failed:', error.message);
  }
}

// Export functions
module.exports = {
  createCompleteAd,
  createMultipleCreatives,
  creativeImages
};

// Run based on argument
if (require.main === module) {
  const action = process.argv[2] || 'complete';
  
  switch (action) {
    case 'complete':
      createCompleteAd();
      break;
    case 'creatives':
      createMultipleCreatives();
      break;
    default:
      console.log('Available actions: complete, creatives');
  }
}
