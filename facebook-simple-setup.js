const axios = require('axios');

const USER_ACCESS_TOKEN = 'EAALXeRNJkWEBQLApgrROzVBtvrwPD7lfCQszZAfqv49Twzg3MZBCwMT6yF5f1UJOCwwYOBIsxxreZC8m9mwHyjuP0SbKa7u14DZBfdMmNXr5XUZAmKQK0prx4EmQufUEWctEWdFyOietxGDqOTjJsmUX1DNEXOJK6XWxzY1SnqBt80Kjt8ZAyR1YZAQdkvUZBMUNCwYSdpQnbfzGzuvC3ZBFkP70UZBlhy3k4LIXYeIQZDZD';
const PAGE_ID = '923280350869125';

// Function to get Page Access Token from User Access Token
async function getPageAccessToken() {
  try {
    console.log('🔄 Getting Page Access Token...');
    
    const response = await axios.get(`https://graph.facebook.com/v22.0/me/accounts?access_token=${USER_ACCESS_TOKEN}`);
    
    const page = response.data.data.find(p => p.id === PAGE_ID);
    
    if (page) {
      console.log('✅ Found page:', page.name);
      return page.access_token;
    } else {
      console.log('❌ Page not found');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error getting Page Access Token:', error.response?.data || error.message);
    return null;
  }
}

// Function to publish post only (what's working)
async function publishRealEstatePost() {
  try {
    console.log('🚀 Publishing Real Estate Post to קרקעות פרימיום...\n');
    
    const pageAccessToken = await getPageAccessToken();
    
    if (!pageAccessToken) {
      console.log('❌ Could not get Page Access Token');
      return;
    }
    
    const postMessage = `🏗️ השקעה נדירה בתל אביב - קרקע למגורים ללא מגבלת קומות!

📍 מיקום אסטרטגי במפגש התחבורתי הלוהט בישראל:
🚇 מטרו תל אביב
🚊 רכבת קלה
🚂 רכבת ישראל  
🚌 מסוף אוטובוסים מרכזי

✨ מה מיוחד בהזדמנות הזו?
💎 קרקע למגורים ללא מגבלת קומות
🏢 אפשרות לפיתוח מסחר ותעסוקה
📈 פוטנציאל עליית ערך גבוה במיוחד
🎯 מיקום מרכזי באזור מתפתח

💰 החל מ-849,000 ₪

🔥 למה עכשיו הזמן הנכון?
• פרויקטי התחבורה בעיצומם
• האזור במגמת פיתוח מואצת  
• מחירים עדיין אטרקטיביים
• הזדמנות לפני הקפיצה הגדולה

📞 לפרטים נוספים ולתיאום סיור:
💬 שלחו הודעה או התקשרו
🌐 בקרו באתר שלנו

#נדלן #השקעות #תלאביב #קרקעות #נדלן_השקעה #מטרו_תלאביב #השקעה_נדירה`;

    console.log('📝 Publishing post...');
    
    // Publish text-only post (more reliable)
    const postResponse = await axios.post(`https://graph.facebook.com/v22.0/${PAGE_ID}/feed`, {
      message: postMessage,
      access_token: pageAccessToken
    });
    
    console.log('✅ Post published successfully!');
    console.log('🔗 Post ID:', postResponse.data.id);
    console.log('🌐 Post URL: https://facebook.com/' + postResponse.data.id);
    
    return postResponse.data;
    
  } catch (error) {
    console.error('❌ Error publishing post:', error.response?.data || error.message);
    throw error;
  }
}

// Function to update page info (what's working)
async function updatePageInfo() {
  try {
    console.log('🚀 Updating Page Information for קרקעות פרימיום...\n');
    
    const pageAccessToken = await getPageAccessToken();
    
    if (!pageAccessToken) {
      console.log('❌ Could not get Page Access Token');
      return;
    }
    
    const about = 'קרקעות פרימיום - השקעות נדל"ן ייחודיות במיקומים אסטרטגיים ללא תיווך. מתמחים בקרקעות למגורים, מסחר ותעסוקה באזורי פיתוח מובילים.';
    const description = 'עמוד מקצועי המציע קרקעות השקעה איכותיות במיקומים אסטרטגיים ברחבי הארץ. אנו מתמחים בזיהוי הזדמנויות השקעה נדירות ללא תיווך, עם דגש על פוטנציאל עליית ערך גבוה ומיקומים עתידיים.';
    
    console.log('📄 Updating page information...');
    
    const response = await axios.post(`https://graph.facebook.com/v22.0/${PAGE_ID}`, {
      about: about,
      description: description,
      access_token: pageAccessToken
    });
    
    console.log('✅ Page info updated successfully!');
    return response.data;
    
  } catch (error) {
    console.error('❌ Error updating page info:', error.response?.data || error.message);
    throw error;
  }
}

// Function to do both (what's working)
async function simpleSetup() {
  try {
    console.log('🎯 Simple Setup for קרקעות פרימיום\n');
    console.log('═'.repeat(50));
    
    // Step 1: Update page info
    await updatePageInfo();
    
    console.log('\n' + '─'.repeat(30) + '\n');
    
    // Step 2: Publish post
    await publishRealEstatePost();
    
    console.log('\n🎉 SIMPLE SETUP COMPLETED!');
    console.log('✅ Successfully completed:');
    console.log('   • Updated page information');
    console.log('   • Published real estate post');
    console.log('\n💡 For cover/profile photos:');
    console.log('   • Upload manually through Facebook interface');
    console.log('   • Or use different image URLs that Facebook can access');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
  }
}

// Export functions
module.exports = {
  simpleSetup,
  publishRealEstatePost,
  updatePageInfo,
  getPageAccessToken
};

// Run setup if called directly
if (require.main === module) {
  simpleSetup();
}
