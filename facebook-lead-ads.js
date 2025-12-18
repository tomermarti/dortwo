const axios = require('axios');

const USER_ACCESS_TOKEN = 'EAALXeRNJkWEBQHMDW8gec3wTtIMu7Gtmi6wPUnNbLWdIc41Y2PuJfrVZBcHYjGtynHiZC8S9aEJbUw0zWC9R6Q8WpyFz0OVjZABW2ICsQTO478SPN6BD9B8Xmiyqidbp77AjRLLfux2q4K2jhZAQZBXcg5yrOtw6YhZA3uEfpz6cGm6vOMZAVCZAinKg9cKdLvczbgZDZD';
const PAGE_ID = '923280350869125';
const ACCOUNT_ID = '1747779905752071';

// Function to get Page Access Token
async function getPageAccessToken() {
  try {
    const response = await axios.get(`https://graph.facebook.com/v22.0/me/accounts?access_token=${USER_ACCESS_TOKEN}`);
    const page = response.data.data.find(p => p.id === PAGE_ID);
    return page ? page.access_token : null;
  } catch (error) {
    console.error('❌ Error getting Page Access Token:', error.response?.data || error.message);
    return null;
  }
}

// מודעות ליד בסגנון "מציאה"
const leadAds = {
  simple: {
    message: `🔥 מציאה חמה!

קרקע בתל אביב ללא מגבלת קומות!

💰 החל מ-849,000₪ בלבד

✅ מטרו + רכבת קלה
✅ אזור מתפתח
✅ ללא תיווך
✅ פוטנציאל עליית ערך גבוה

⏰ רק 3 יחידות נותרו!

📞 לפרטים: שלחו הודעה פרטית
💬 מענה מיידי | ללא התחייבות

#נדלן #השקעות #תלאביב #מציאה`,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop'
  },

  urgent: {
    message: `🚨 אזהרה: מחירי הקרקעות בתל אביב עולים!

💎 הזדמנות אחרונה להשקיע במחיר של היום

🏗️ קרקע ללא מגבלות בנייה
📍 מיקום פרימיום על קווי התחבורה
💰 849,000₪ - מחיר לזמן מוגבל

⚡ רק 3 יחידות אחרונות במחיר הזה!

📲 שלח "מעוניין" ונחזור אליך תוך 5 דקות

#השקעה_חכמה #נדלן_תלאביב #מחיר_מיוחד`,
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=800&fit=crop'
  },

  investment: {
    message: `💼 למשקיעים חכמים בלבד!

השקעה נדירה בקרקע פרימיום בתל אביב

📊 נתונים:
• מחיר: 849,000₪
• ROI צפוי: 200-300%
• זמן החזר: 3-5 שנים
• מיקום: על קווי המטרו

🎯 למה עכשיו?
✓ פרויקטי התחבורה בעיצומם
✓ האזור במגמת פיתוח מואצת
✓ מחירים לפני הקפיצה הגדולה

📞 ייעוץ השקעות חינם
💡 מענה מקצועי תוך שעה

#השקעות_נדלן #תשואה_גבוהה #תלאביב`,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=800&fit=crop'
  },

  bargain: {
    message: `🔥 מבצע מיוחד - 48 שעות בלבד!

קרקע בתל אביב במחיר מציאה

💥 מה מקבלים:
• קרקע ללא מגבלת קומות
• מיקום על מטרו + רכבת קלה  
• אישורי בנייה מוכנים
• ללא עמלות תיווך

💰 מחיר מיוחד: 849,000₪
(במקום 950,000₪)

⏰ המבצע מסתיים ביום רביעי!

📱 לפרטים מלאים: 050-1234567
💬 או שלחו הודעה פרטית

#מבצע_מיוחד #קרקעות_תלאביב #חיסכון`,
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop'
  }
};

// Function to publish lead ad
async function publishLeadAd(adType = 'simple') {
  try {
    console.log(`🚀 Publishing ${adType} lead ad...`);
    
    const pageAccessToken = await getPageAccessToken();
    if (!pageAccessToken) {
      console.log('❌ Could not get Page Access Token');
      return;
    }
    
    const ad = leadAds[adType];
    if (!ad) {
      console.log('❌ Ad type not found');
      return;
    }
    
    // Upload image first
    console.log('📸 Uploading image...');
    const imageResponse = await axios.post(`https://graph.facebook.com/v22.0/${PAGE_ID}/photos`, {
      url: ad.imageUrl,
      published: false,
      access_token: pageAccessToken
    });
    
    const photoId = imageResponse.data.id;
    console.log('✅ Image uploaded, ID:', photoId);
    
    // Publish post with image
    console.log('📝 Publishing post...');
    const postResponse = await axios.post(`https://graph.facebook.com/v22.0/${PAGE_ID}/feed`, {
      message: ad.message,
      attached_media: JSON.stringify([{media_fbid: photoId}]),
      access_token: pageAccessToken
    });
    
    console.log('🎉 Lead ad published successfully!');
    console.log('🔗 Post ID:', postResponse.data.id);
    console.log('🌐 Post URL: https://facebook.com/' + postResponse.data.id);
    
    return postResponse.data;
    
  } catch (error) {
    console.error('❌ Error publishing lead ad:', error.response?.data || error.message);
    throw error;
  }
}

// Function to publish all lead ads (for testing)
async function publishAllLeadAds() {
  try {
    console.log('🎯 Publishing All Lead Ads for קרקעות פרימיום\n');
    console.log('═'.repeat(60));
    
    const adTypes = Object.keys(leadAds);
    
    for (let i = 0; i < adTypes.length; i++) {
      const adType = adTypes[i];
      console.log(`\n${i + 1}️⃣ Publishing ${adType} ad...`);
      
      try {
        await publishLeadAd(adType);
        console.log(`✅ ${adType} ad published successfully!`);
        
        // Wait between posts to avoid rate limiting
        if (i < adTypes.length - 1) {
          console.log('⏳ Waiting 30 seconds before next post...');
          await new Promise(resolve => setTimeout(resolve, 30000));
        }
        
      } catch (error) {
        console.log(`❌ Failed to publish ${adType} ad:`, error.message);
      }
    }
    
    console.log('\n🏁 All lead ads processing completed!');
    
  } catch (error) {
    console.error('❌ Error in batch publishing:', error.message);
  }
}

// Function to show available ads
function showAvailableAds() {
  console.log('📋 Available Lead Ad Types:\n');
  
  Object.keys(leadAds).forEach((type, index) => {
    console.log(`${index + 1}. ${type}:`);
    console.log(`   ${leadAds[type].message.split('\n')[0]}`);
    console.log('');
  });
  
  console.log('Usage examples:');
  console.log('• npm run facebook-lead-simple');
  console.log('• npm run facebook-lead-urgent');
  console.log('• npm run facebook-lead-investment');
  console.log('• npm run facebook-lead-bargain');
}

// Export functions
module.exports = {
  publishLeadAd,
  publishAllLeadAds,
  showAvailableAds,
  leadAds,
  getPageAccessToken
};

// Run if called directly
if (require.main === module) {
  const adType = process.argv[2] || 'simple';
  
  if (adType === 'all') {
    publishAllLeadAds();
  } else if (adType === 'show') {
    showAvailableAds();
  } else {
    publishLeadAd(adType);
  }
}
