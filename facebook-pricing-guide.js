const axios = require('axios');

// Facebook Ads Pricing Guide for Real Estate
const USER_ACCESS_TOKEN = 'EAALXeRNJkWEBQHMDW8gec3wTtIMu7Gtmi6wPUnNbLWdIc41Y2PuJfrVZBcHYjGtynHiZC8S9aEJbUw0zWC9R6Q8WpyFz0OVjZABW2ICsQTO478SPN6BD9B8Xmiyqidbp77AjRLLfux2q4K2jhZAQZBXcg5yrOtw6YhZA3uEfpz6cGm6vOMZAVCZAinKg9cKdLvczbgZDZD';
const PAGE_ID = '923280350869125';
const ACCOUNT_ID = '1747779905752071';
const API_VERSION = 'v22.0';

// Pricing configurations for different budgets
const pricingOptions = {
  conservative: {
    name: 'שמרני - תקציב נמוך',
    daily_budget: 3000, // 30 NIS per day
    bid_amount: 800,    // 8 NIS per lead
    description: 'מתאים לבדיקה ראשונית'
  },
  
  moderate: {
    name: 'בינוני - מאוזן',
    daily_budget: 5000, // 50 NIS per day  
    bid_amount: 1000,   // 10 NIS per lead
    description: 'מאוזן בין עלות לתוצאות'
  },
  
  aggressive: {
    name: 'אגרסיבי - תקציב גבוה',
    daily_budget: 10000, // 100 NIS per day
    bid_amount: 1500,    // 15 NIS per lead
    description: 'למקסימום חשיפה ולידים'
  },
  
  premium: {
    name: 'פרימיום - איכות גבוהה',
    daily_budget: 15000, // 150 NIS per day
    bid_amount: 2000,    // 20 NIS per lead
    description: 'לידים איכותיים במחיר גבוה'
  }
};

// Function to create campaign with specific pricing
async function createCampaignWithPricing(pricingType = 'moderate') {
  try {
    const pricing = pricingOptions[pricingType];
    
    console.log(`🎯 Creating Campaign: ${pricing.name}`);
    console.log(`💰 Daily Budget: ${pricing.daily_budget/100} NIS`);
    console.log(`🎯 Bid Amount: ${pricing.bid_amount/100} NIS per lead`);
    console.log(`📝 Description: ${pricing.description}\n`);
    
    // Step 1: Create campaign
    const campaignData = {
      name: `קרקעות פרימיום - ${pricing.name}`,
      objective: 'OUTCOME_LEADS',
      status: 'PAUSED',
      special_ad_categories: ['HOUSING'],
      special_ad_category_country: ['IL'], // Must match targeting countries
      access_token: USER_ACCESS_TOKEN
    };
    
    const campaignResponse = await axios.post(`https://graph.facebook.com/${API_VERSION}/act_${ACCOUNT_ID}/campaigns`, campaignData);
    console.log('✅ Campaign created:', campaignResponse.data.id);
    
    // Step 2: Create ad set with pricing
    const adSetData = {
      name: `Ad Set - ${pricing.name}`,
      campaign_id: campaignResponse.data.id,
      daily_budget: pricing.daily_budget,
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LEAD_GENERATION',
      bid_amount: pricing.bid_amount,
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
    console.log('✅ Ad Set created:', adSetResponse.data.id);
    
    console.log('\n📊 Campaign Summary:');
    console.log(`   🚀 Campaign ID: ${campaignResponse.data.id}`);
    console.log(`   📊 Ad Set ID: ${adSetResponse.data.id}`);
    console.log(`   💰 Daily Budget: ${pricing.daily_budget/100} NIS`);
    console.log(`   🎯 Cost per Lead: ${pricing.bid_amount/100} NIS`);
    console.log(`   📈 Expected Leads/Day: ~${Math.floor(pricing.daily_budget/pricing.bid_amount)}`);
    
    return {
      campaign: campaignResponse.data,
      adSet: adSetResponse.data,
      pricing
    };
    
  } catch (error) {
    console.error('❌ Campaign creation failed:', error.response?.data || error.message);
    throw error;
  }
}

// Function to show pricing comparison
function showPricingComparison() {
  console.log('💰 Facebook Ads Pricing Options for Real Estate\n');
  console.log('═'.repeat(70));
  
  Object.keys(pricingOptions).forEach((key, index) => {
    const pricing = pricingOptions[key];
    const expectedLeads = Math.floor(pricing.daily_budget / pricing.bid_amount);
    const monthlyBudget = (pricing.daily_budget * 30) / 100;
    const monthlyCost = (pricing.bid_amount * expectedLeads * 30) / 100;
    
    console.log(`\n${index + 1}️⃣ ${pricing.name.toUpperCase()}`);
    console.log('─'.repeat(40));
    console.log(`📅 תקציב יומי: ${pricing.daily_budget/100} ₪`);
    console.log(`📅 תקציב חודשי: ~${monthlyBudget} ₪`);
    console.log(`🎯 עלות לליד: ${pricing.bid_amount/100} ₪`);
    console.log(`📈 לידים צפויים ליום: ~${expectedLeads}`);
    console.log(`📈 לידים צפויים לחודש: ~${expectedLeads * 30}`);
    console.log(`💡 ${pricing.description}`);
  });
  
  console.log('\n🎯 המלצות:');
  console.log('   • התחל עם "בינוני" לבדיקה');
  console.log('   • עבור ל"אגרסיבי" אם התוצאות טובות');
  console.log('   • השתמש ב"פרימיום" לקמפיינים חשובים');
  console.log('   • "שמרני" רק לבדיקות ראשוניות');
}

// Function to calculate ROI
function calculateROI() {
  console.log('📊 ROI Calculator for Real Estate Leads\n');
  console.log('═'.repeat(50));
  
  const avgDealValue = 849000; // Average property price
  const commission = 0.02; // 2% commission
  const conversionRate = 0.05; // 5% of leads become sales
  
  Object.keys(pricingOptions).forEach((key) => {
    const pricing = pricingOptions[key];
    const dailyLeads = Math.floor(pricing.daily_budget / pricing.bid_amount);
    const monthlyLeads = dailyLeads * 30;
    const monthlyCost = (pricing.daily_budget * 30) / 100;
    
    const expectedSales = monthlyLeads * conversionRate;
    const revenue = expectedSales * avgDealValue * commission;
    const roi = ((revenue - monthlyCost) / monthlyCost) * 100;
    
    console.log(`\n💎 ${pricing.name}:`);
    console.log(`   💰 עלות חודשית: ${monthlyCost} ₪`);
    console.log(`   📈 לידים חודשיים: ${monthlyLeads}`);
    console.log(`   🏠 מכירות צפויות: ${expectedSales.toFixed(1)}`);
    console.log(`   💵 הכנסה צפויה: ${revenue.toLocaleString()} ₪`);
    console.log(`   📊 ROI: ${roi.toFixed(0)}%`);
  });
  
  console.log('\n💡 הנחות:');
  console.log('   • מחיר נכס ממוצע: 849,000 ₪');
  console.log('   • עמלה: 2%');
  console.log('   • שיעור המרה: 5% מהלידים');
}

// Export functions
module.exports = {
  createCampaignWithPricing,
  showPricingComparison,
  calculateROI,
  pricingOptions
};

// Run based on argument
if (require.main === module) {
  const action = process.argv[2] || 'pricing';
  const pricingType = process.argv[3] || 'moderate';
  
  switch (action) {
    case 'pricing':
      showPricingComparison();
      break;
    case 'roi':
      calculateROI();
      break;
    case 'create':
      createCampaignWithPricing(pricingType);
      break;
    default:
      console.log('Available actions:');
      console.log('  pricing - Show pricing options');
      console.log('  roi - Calculate ROI');
      console.log('  create [conservative|moderate|aggressive|premium] - Create campaign');
  }
}
