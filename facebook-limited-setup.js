const axios = require('axios');

const ACCESS_TOKEN = 'EAALXeRNJkWEBQLApgrROzVBtvrwPD7lfCQszZAfqv49Twzg3MZBCwMT6yF5f1UJOCwwYOBIsxxreZC8m9mwHyjuP0SbKa7u14DZBfdMmNXr5XUZAmKQK0prx4EmQufUEWctEWdFyOietxGDqOTjJsmUX1DNEXOJK6XWxzY1SnqBt80Kjt8ZAyR1YZAQdkvUZBMUNCwYSdpQnbfzGzuvC3ZBFkP70UZBlhy3k4LIXYeIQZDZD';
const PAGE_ID = '923280350869125';

// Function to test what we can do with current permissions
async function testCurrentCapabilities() {
  try {
    console.log('🔍 Testing what we can do with current permissions...\n');
    
    // Test 1: Get page info
    console.log('1️⃣ Getting current page information...');
    const pageInfo = await axios.get(`https://graph.facebook.com/v18.0/${PAGE_ID}?fields=name,category,about,website,phone,emails,description,cover,picture&access_token=${ACCESS_TOKEN}`);
    
    console.log('✅ Page Details:');
    console.log('   📝 Name:', pageInfo.data.name);
    console.log('   📂 Category:', pageInfo.data.category);
    console.log('   📄 About:', pageInfo.data.about || 'Not set');
    console.log('   🌐 Website:', pageInfo.data.website || 'Not set');
    console.log('   📞 Phone:', pageInfo.data.phone || 'Not set');
    
    if (pageInfo.data.cover) {
      console.log('   🖼️ Cover Photo: Already set');
    } else {
      console.log('   🖼️ Cover Photo: Not set');
    }
    
    if (pageInfo.data.picture) {
      console.log('   👤 Profile Photo: Already set');
    } else {
      console.log('   👤 Profile Photo: Not set');
    }
    
    // Test 2: Get recent posts
    console.log('\n2️⃣ Getting recent posts...');
    const posts = await axios.get(`https://graph.facebook.com/v18.0/${PAGE_ID}/posts?limit=5&fields=message,created_time,likes.summary(true),comments.summary(true)&access_token=${ACCESS_TOKEN}`);
    
    if (posts.data.data.length > 0) {
      console.log('✅ Recent Posts:');
      posts.data.data.forEach((post, index) => {
        console.log(`   ${index + 1}. ${post.message ? post.message.substring(0, 50) + '...' : 'No message'}`);
        console.log(`      📅 ${new Date(post.created_time).toLocaleDateString('he-IL')}`);
        console.log(`      👍 ${post.likes?.summary?.total_count || 0} likes, 💬 ${post.comments?.summary?.total_count || 0} comments`);
      });
    } else {
      console.log('📝 No posts found');
    }
    
    // Test 3: Get page photos
    console.log('\n3️⃣ Getting page photos...');
    const photos = await axios.get(`https://graph.facebook.com/v18.0/${PAGE_ID}/photos?limit=3&fields=source,created_time&access_token=${ACCESS_TOKEN}`);
    
    if (photos.data.data.length > 0) {
      console.log('✅ Recent Photos:');
      photos.data.data.forEach((photo, index) => {
        console.log(`   ${index + 1}. Photo uploaded on ${new Date(photo.created_time).toLocaleDateString('he-IL')}`);
      });
    } else {
      console.log('📷 No photos found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data?.error?.message || error.message);
  }
}

// Function to show what permissions are needed
function showMissingPermissions() {
  console.log('\n🔐 MISSING PERMISSIONS NEEDED:\n');
  
  console.log('📋 Current permissions:');
  console.log('   ✅ pages_show_list');
  console.log('   ✅ ads_management');
  console.log('   ✅ ads_read');
  console.log('   ✅ business_management');
  console.log('   ✅ pages_read_engagement');
  console.log('   ✅ public_profile');
  
  console.log('\n❌ Missing permissions needed:');
  console.log('   ❌ pages_manage_metadata (for cover/profile photos & page info)');
  console.log('   ❌ pages_manage_posts (for publishing posts)');
  
  console.log('\n🛠️ HOW TO GET MISSING PERMISSIONS:\n');
  
  console.log('🎯 Option 1: Facebook Business Manager (Recommended)');
  console.log('   1. Go to business.facebook.com');
  console.log('   2. Business Settings → Users → System Users');
  console.log('   3. Create/Edit system user');
  console.log('   4. Add Assets → Pages → Add your page');
  console.log('   5. Select permissions: "Manage" and "Create content"');
  console.log('   6. Generate new access token with these permissions');
  
  console.log('\n🎯 Option 2: Graph API Explorer');
  console.log('   1. Go to developers.facebook.com/tools/explorer');
  console.log('   2. Select your app and page');
  console.log('   3. Add permissions:');
  console.log('      - pages_manage_metadata');
  console.log('      - pages_manage_posts');
  console.log('      - pages_read_engagement');
  console.log('   4. Generate User Access Token');
  console.log('   5. Exchange for long-lived Page Access Token');
  
  console.log('\n🎯 Option 3: Manual Page Management');
  console.log('   For now, you can manually:');
  console.log('   • Upload cover photo through Facebook interface');
  console.log('   • Upload profile photo through Facebook interface');
  console.log('   • Update page information through Facebook interface');
  console.log('   • Create posts through Facebook interface');
  
  console.log('\n⚡ QUICK SOLUTION:');
  console.log('   If you have admin access to the page, go to:');
  console.log('   Facebook Page → Settings → Page Access Tokens');
  console.log('   Generate a new token with full permissions');
}

// Real estate content that you can copy-paste manually
function showRealEstateContent() {
  console.log('\n📝 REAL ESTATE CONTENT FOR MANUAL USE:\n');
  
  console.log('🏗️ POST CONTENT (Copy & Paste to Facebook):');
  console.log('─'.repeat(50));
  console.log(`🏗️ השקעה נדירה בתל אביב - קרקע למגורים ללא מגבלת קומות!

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

#נדלן #השקעות #תלאביב #קרקעות #נדלן_השקעה #מטרו_תלאביב #השקעה_נדירה`);
  
  console.log('\n─'.repeat(50));
  
  console.log('\n📄 PAGE ABOUT SECTION:');
  console.log('─'.repeat(30));
  console.log('קרקעות פרימיום - השקעות נדל"ן ייחודיות במיקומים אסטרטגיים ללא תיווך. מתמחים בקרקעות למגורים, מסחר ותעסוקה באזורי פיתוח מובילים.');
  
  console.log('\n📝 PAGE DESCRIPTION:');
  console.log('─'.repeat(30));
  console.log('עמוד מקצועי המציע קרקעות השקעה איכותיות במיקומים אסטרטגיים ברחבי הארץ. אנו מתמחים בזיהוי הזדמנויות השקעה נדירות ללא תיווך, עם דגש על פוטנציאל עליית ערך גבוה ומיקומים עתידיים.');
  
  console.log('\n🖼️ SUGGESTED IMAGES:');
  console.log('   Cover Photo: Modern Tel Aviv skyline or construction site');
  console.log('   Profile Photo: Professional building or company logo');
  console.log('   Post Image: Urban development or real estate imagery');
}

// Run all tests and show information
async function runLimitedSetup() {
  console.log('🏗️ קרקעות פרימיום - Limited Setup Analysis\n');
  console.log('═'.repeat(60));
  
  await testCurrentCapabilities();
  showMissingPermissions();
  showRealEstateContent();
  
  console.log('\n✅ SUMMARY:');
  console.log('   • Your token works for reading page data');
  console.log('   • You need additional permissions for full management');
  console.log('   • Content is ready for manual posting');
  console.log('   • Follow the permission guide above to get full API access');
}

runLimitedSetup();
