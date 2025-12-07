import axios from 'axios';

// Facebook API configuration for קרקעות פרימיום
const ACCESS_TOKEN = 'EAFlflr7BXfwBQM0GnQA8toaf6TVBzWlJJZBBUryWmOZBu9rqpvJbHiPyxcSHj3Ha9KuIxzJdbEiZCdopwzKz2DkMw0i5hK3KKlTV42LsTlwGNYZAtvzqDKnnrcxFPUwEUMFHweWcf0E6B5dmEsbDhDJDGPj9ds8DRxUZB6DitBkYtAvAC4sBVJDGAuaVF7ZAiKTB0uvqRwgRaFhZCcRr9EXVIFtkHJ4IR0HxpmsfSkpib9Ys0rZBfBthn2PCFXXZCX8fRPLDJjXrHIzXIQZBxpWgZDZD';
const PAGE_ID = '923280350869125'; // קרקעות פרימיום page ID

// Function to upload cover photo
async function uploadCoverPhoto(imageUrl) {
  try {
    console.log('Uploading cover photo to Facebook page...');
    
    const response = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}/picture`, {
      url: imageUrl,
      type: 'cover',
      access_token: ACCESS_TOKEN
    });
    
    console.log('Cover photo uploaded successfully!');
    console.log('Response:', response.data);
    
    return response.data;
    
  } catch (error) {
    console.error('Error uploading cover photo:', error.response?.data || error.message);
    throw error;
  }
}

// Function to upload profile photo
async function uploadProfilePhoto(imageUrl) {
  try {
    console.log('Uploading profile photo to Facebook page...');
    
    const response = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}/picture`, {
      url: imageUrl,
      type: 'square',
      access_token: ACCESS_TOKEN
    });
    
    console.log('Profile photo uploaded successfully!');
    console.log('Response:', response.data);
    
    return response.data;
    
  } catch (error) {
    console.error('Error uploading profile photo:', error.response?.data || error.message);
    throw error;
  }
}

// Function to publish a post with image
async function publishPost(message, imageUrl) {
  try {
    console.log('Publishing post to Facebook...');
    
    // First, upload the image
    const imageResponse = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}/photos`, {
      url: imageUrl,
      published: false,
      access_token: ACCESS_TOKEN
    });
    
    const photoId = imageResponse.data.id;
    console.log('Image uploaded successfully, ID:', photoId);
    
    // Then publish the post with the uploaded image
    const postResponse = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}/feed`, {
      message: message,
      attached_media: JSON.stringify([{media_fbid: photoId}]),
      access_token: ACCESS_TOKEN
    });
    
    console.log('Post published successfully!');
    console.log('Post ID:', postResponse.data.id);
    console.log('Post URL: https://facebook.com/' + postResponse.data.id);
    
    return postResponse.data;
    
  } catch (error) {
    console.error('Error publishing post:', error.response?.data || error.message);
    throw error;
  }
}

// Function to update page info
async function updatePageInfo(about, description) {
  try {
    console.log('Updating page information...');
    
    const response = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}`, {
      about: about,
      description: description,
      access_token: ACCESS_TOKEN
    });
    
    console.log('Page info updated successfully!');
    console.log('Response:', response.data);
    
    return response.data;
    
  } catch (error) {
    console.error('Error updating page info:', error.response?.data || error.message);
    throw error;
  }
}

// Real estate page content for קרקעות פרימיום
const realEstateContent = {
  // Cover photo - should be a wide landscape image showing premium land/development
  coverPhoto: {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', // Modern city skyline
    description: 'תמונת כיסוי - נוף עירוני מודרני המייצג השקעות נדל"ן איכותיות'
  },
  
  // Profile photo - should be a logo or professional real estate image
  profilePhoto: {
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', // Modern building/architecture
    description: 'תמונת פרופיל - בניין מודרני המייצג איכות ומקצועיות'
  },
  
  // Page information
  pageInfo: {
    about: 'קרקעות פרימיום - השקעות נדל"ן ייחודיות במיקומים אסטרטגיים ללא תיווך. מתמחים בקרקעות למגורים, מסחר ותעסוקה באזורי פיתוח מובילים.',
    description: 'עמוד מקצועי המציע קרקעות השקעה איכותיות במיקומים אסטרטגיים ברחבי הארץ. אנו מתמחים בזיהוי הזדמנויות השקעה נדירות ללא תיווך, עם דגש על פוטנציאל עליית ערך גבוה ומיקומים עתידיים.'
  },
  
  // Sample post content
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
    
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80' // Tel Aviv skyline or construction site
  }
};

// Function to setup the complete page
async function setupRealEstatePage() {
  try {
    console.log('🏗️ Setting up קרקעות פרימיום Facebook page...\n');
    
    // 1. Update page information
    console.log('1️⃣ Updating page information...');
    await updatePageInfo(realEstateContent.pageInfo.about, realEstateContent.pageInfo.description);
    
    // 2. Upload cover photo
    console.log('\n2️⃣ Uploading cover photo...');
    await uploadCoverPhoto(realEstateContent.coverPhoto.url);
    
    // 3. Upload profile photo
    console.log('\n3️⃣ Uploading profile photo...');
    await uploadProfilePhoto(realEstateContent.profilePhoto.url);
    
    // 4. Publish welcome post
    console.log('\n4️⃣ Publishing welcome post...');
    await publishPost(realEstateContent.post.message, realEstateContent.post.imageUrl);
    
    console.log('\n✅ Page setup completed successfully!');
    console.log('🎉 קרקעות פרימיום page is now ready with:');
    console.log('   • Updated page information');
    console.log('   • Professional cover photo');
    console.log('   • Profile photo');
    console.log('   • Welcome post with real estate content');
    
  } catch (error) {
    console.error('❌ Error setting up page:', error);
    throw error;
  }
}

// Alternative post variations for A/B testing
const alternativePosts = {
  post1: {
    message: `🏙️ הזדמנות זהב בתל אביב!

קרקע למגורים במיקום פרימיום - ללא תיווך!

📍 במפגש התחבורתי החדש:
מטרו | רכבת קלה | רכבת ישראל

💡 למה זה חכם עכשיו?
✅ ללא מגבלת קומות
✅ פוטנציאל עליית ערך עצום
✅ מחירים לפני הקפיצה
✅ מיקום אסטרטגי

💰 החל מ-849,000 ₪

📞 לפרטים: שלחו הודעה

#נדלן_תלאביב #השקעות_חכמות`,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  
  post2: {
    message: `💎 קרקעות פרימיום בתל אביב

🎯 למשקיעים חכמים בלבד!

מה מקבלים:
🏗️ קרקע למגורים ללא מגבלת קומות
🚇 מיקום על קווי התחבורה החדשים
📈 פוטנציאל עליית ערך של עשרות אחוזים
⚡ ללא תיווך - חיסכון משמעותי

החל מ-849,000 ₪

זמן מוגבל - המלאי מתמעט!

📱 לפרטים נוספים: הודעה פרטית

#השקעות_נדלן #תלאביב #קרקעות_פרימיום`,
    imageUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  }
};

// Export functions for use
export { 
  uploadCoverPhoto, 
  uploadProfilePhoto, 
  publishPost, 
  updatePageInfo,
  setupRealEstatePage,
  realEstateContent,
  alternativePosts
};

// Run the complete setup
if (require.main === module) {
  setupRealEstatePage()
    .then(() => {
      console.log('🎊 Setup completed successfully!');
    })
    .catch((error) => {
      console.error('💥 Setup failed:', error);
    });
}
