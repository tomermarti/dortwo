const axios = require('axios');

const USER_ACCESS_TOKEN = 'EAALXeRNJkWEBQLApgrROzVBtvrwPD7lfCQszZAfqv49Twzg3MZBCwMT6yF5f1UJOCwwYOBIsxxreZC8m9mwHyjuP0SbKa7u14DZBfdMmNXr5XUZAmKQK0prx4EmQufUEWctEWdFyOietxGDqOTjJsmUX1DNEXOJK6XWxzY1SnqBt80Kjt8ZAyR1YZAQdkvUZBMUNCwYSdpQnbfzGzuvC3ZBFkP70UZBlhy3k4LIXYeIQZDZD';
const PAGE_ID = '923280350869125';

// Function to get Page Access Token from User Access Token
async function getPageAccessToken() {
  try {
    console.log('🔄 Converting User Access Token to Page Access Token...');
    
    const response = await axios.get(`https://graph.facebook.com/v18.0/me/accounts?access_token=${USER_ACCESS_TOKEN}`);
    
    const page = response.data.data.find(p => p.id === PAGE_ID);
    
    if (page) {
      console.log('✅ Found page:', page.name);
      console.log('✅ Page Access Token obtained');
      return page.access_token;
    } else {
      console.log('❌ Page not found in your accounts');
      console.log('Available pages:');
      response.data.data.forEach(p => {
        console.log(`   - ${p.name} (ID: ${p.id})`);
      });
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error getting Page Access Token:', error.response?.data || error.message);
    return null;
  }
}

// Function to upload cover photo using User Token
async function uploadCoverPhotoWithUserToken(imageUrl, pageAccessToken) {
  try {
    console.log('📸 Uploading cover photo...');
    
    const response = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}/picture`, {
      url: imageUrl,
      type: 'cover',
      access_token: pageAccessToken
    });
    
    console.log('✅ Cover photo uploaded successfully!');
    return response.data;
    
  } catch (error) {
    console.error('❌ Error uploading cover photo:', error.response?.data || error.message);
    throw error;
  }
}

// Function to upload profile photo using User Token
async function uploadProfilePhotoWithUserToken(imageUrl, pageAccessToken) {
  try {
    console.log('👤 Uploading profile photo...');
    
    const response = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}/picture`, {
      url: imageUrl,
      type: 'square',
      access_token: pageAccessToken
    });
    
    console.log('✅ Profile photo uploaded successfully!');
    return response.data;
    
  } catch (error) {
    console.error('❌ Error uploading profile photo:', error.response?.data || error.message);
    throw error;
  }
}

// Function to publish post using User Token
async function publishPostWithUserToken(message, imageUrl, pageAccessToken) {
  try {
    console.log('📝 Publishing post...');
    
    // First, upload the image
    const imageResponse = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}/photos`, {
      url: imageUrl,
      published: false,
      access_token: pageAccessToken
    });
    
    const photoId = imageResponse.data.id;
    console.log('📷 Image uploaded, ID:', photoId);
    
    // Then publish the post with the uploaded image
    const postResponse = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}/feed`, {
      message: message,
      attached_media: JSON.stringify([{media_fbid: photoId}]),
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

// Function to update page info using User Token
async function updatePageInfoWithUserToken(about, description, pageAccessToken) {
  try {
    console.log('📄 Updating page information...');
    
    const response = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}`, {
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

// Real estate content
const realEstateContent = {
  coverPhoto: {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'תמונת כיסוי - נוף עירוני מודרני'
  },
  
  profilePhoto: {
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'תמונת פרופיל - בניין מודרני'
  },
  
  pageInfo: {
    about: 'קרקעות פרימיום - השקעות נדל"ן ייחודיות במיקומים אסטרטגיים ללא תיווך. מתמחים בקרקעות למגורים, מסחר ותעסוקה באזורי פיתוח מובילים.',
    description: 'עמוד מקצועי המציע קרקעות השקעה איכותיות במיקומים אסטרטגיים ברחבי הארץ. אנו מתמחים בזיהוי הזדמנויות השקעה נדירות ללא תיווך, עם דגש על פוטנציאל עליית ערך גבוה ומיקומים עתידיים.'
  },
  
  post: {
    message: `🏗️ השקעה נדירה בתל אביב - קרקע למגורים ללא מגבלת קומות!

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

#נדלן #השקעות #תלאביב #קרקעות #נדלן_השקעה #מטרו_תלאביב #השקעה_נדירה`,
    
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
  }
};

// Main setup function using User Token
async function setupWithUserToken() {
  try {
    console.log('🚀 Setting up קרקעות פרימיום with User Access Token...\n');
    console.log('═'.repeat(60));
    
    // Step 1: Get Page Access Token
    const pageAccessToken = await getPageAccessToken();
    
    if (!pageAccessToken) {
      console.log('\n❌ Could not get Page Access Token');
      console.log('💡 Make sure you have admin access to the page');
      return;
    }
    
    console.log('\n🎯 Starting page setup...\n');
    
    // Step 2: Update page information
    console.log('1️⃣ Updating page information...');
    await updatePageInfoWithUserToken(
      realEstateContent.pageInfo.about, 
      realEstateContent.pageInfo.description, 
      pageAccessToken
    );
    
    // Step 3: Upload cover photo
    console.log('\n2️⃣ Uploading cover photo...');
    await uploadCoverPhotoWithUserToken(realEstateContent.coverPhoto.url, pageAccessToken);
    
    // Step 4: Upload profile photo
    console.log('\n3️⃣ Uploading profile photo...');
    await uploadProfilePhotoWithUserToken(realEstateContent.profilePhoto.url, pageAccessToken);
    
    // Step 5: Publish welcome post
    console.log('\n4️⃣ Publishing welcome post...');
    await publishPostWithUserToken(
      realEstateContent.post.message, 
      realEstateContent.post.imageUrl, 
      pageAccessToken
    );
    
    console.log('\n🎉 SUCCESS! Page setup completed successfully!');
    console.log('✅ קרקעות פרימיום page is now ready with:');
    console.log('   • Updated page information');
    console.log('   • Professional cover photo');
    console.log('   • Profile photo');
    console.log('   • Welcome post with real estate content');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    
    // Provide specific troubleshooting based on error
    if (error.message.includes('permissions')) {
      console.log('\n🔧 Permission issue detected:');
      console.log('   1. Make sure you have admin rights to the page');
      console.log('   2. Check that your User Access Token has these permissions:');
      console.log('      - pages_manage_metadata');
      console.log('      - pages_manage_posts');
      console.log('      - pages_read_engagement');
    } else if (error.message.includes('190')) {
      console.log('\n🔧 Token issue detected:');
      console.log('   1. Your access token may have expired');
      console.log('   2. Generate a new User Access Token');
      console.log('   3. Make sure the token has the required permissions');
    }
  }
}

// Alternative: Just publish a post (simpler test)
async function justPublishPost() {
  try {
    console.log('📝 Testing: Publishing a single post...\n');
    
    const pageAccessToken = await getPageAccessToken();
    
    if (!pageAccessToken) {
      console.log('❌ Could not get Page Access Token');
      return;
    }
    
    await publishPostWithUserToken(
      realEstateContent.post.message, 
      realEstateContent.post.imageUrl, 
      pageAccessToken
    );
    
    console.log('\n✅ Post published successfully!');
    
  } catch (error) {
    console.error('\n❌ Failed to publish post:', error.message);
  }
}

// Export functions
module.exports = {
  setupWithUserToken,
  justPublishPost,
  getPageAccessToken,
  uploadCoverPhotoWithUserToken,
  uploadProfilePhotoWithUserToken,
  publishPostWithUserToken,
  updatePageInfoWithUserToken,
  realEstateContent
};

// Run setup if called directly
if (require.main === module) {
  setupWithUserToken();
}
