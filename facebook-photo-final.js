const axios = require('axios');

const ACCESS_TOKEN = 'EAALXeRNJkWEBQHMDW8gec3wTtIMu7Gtmi6wPUnNbLWdIc41Y2PuJfrVZBcHYjGtynHiZC8S9aEJbUw0zWC9R6Q8WpyFz0OVjZABW2ICsQTO478SPN6BD9B8Xmiyqidbp77AjRLLfux2q4K2jhZAQZBXcg5yrOtw6YhZA3uEfpz6cGm6vOMZAVCZAinKg9cKdLvczbgZDZD';
const PAGE_ID = '923280350869125';

async function uploadAndSetProfilePhoto() {
  try {
    console.log('📸 Step 1: Uploading photo to page album...');
    
    // First upload the photo to the page's photos
    const photoResponse = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}/photos`, {
      url: 'https://picsum.photos/400/400?random=6',
      published: false, // Don't publish to timeline
      access_token: ACCESS_TOKEN
    });
    
    const photoId = photoResponse.data.id;
    console.log('✅ Photo uploaded successfully! Photo ID:', photoId);
    
    console.log('👤 Step 2: Setting as profile picture...');
    
    // Now set it as profile picture using the photo ID
    const profileResponse = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}/picture`, {
      photo: photoId, // Use 'photo' instead of 'picture'
      access_token: ACCESS_TOKEN
    });
    
    console.log('✅ Profile picture set successfully!');
    console.log('Response:', profileResponse.data);
    
    return { photoId, profileResponse: profileResponse.data };
    
  } catch (error) {
    console.error('❌ Error in profile photo process:', error.response?.data || error.message);
    
    if (error.response?.data?.error?.message?.includes('photo')) {
      console.log('\n🔄 Trying with different parameter name...');
      
      try {
        // Try with 'picture' parameter and the photo URL
        const altResponse = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}/picture`, {
          picture: `https://graph.facebook.com/v18.0/${photoId}/picture`,
          access_token: ACCESS_TOKEN
        });
        
        console.log('✅ Alternative method worked!');
        console.log('Response:', altResponse.data);
        
      } catch (altError) {
        console.error('❌ Alternative method also failed:', altError.response?.data || altError.message);
      }
    }
  }
}

async function uploadAndSetCoverPhoto() {
  try {
    console.log('🖼️ Step 1: Uploading cover photo to page album...');
    
    // Upload a landscape photo for cover
    const photoResponse = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}/photos`, {
      url: 'https://picsum.photos/1200/630?random=7',
      published: false,
      access_token: ACCESS_TOKEN
    });
    
    const photoId = photoResponse.data.id;
    console.log('✅ Cover photo uploaded successfully! Photo ID:', photoId);
    
    console.log('🖼️ Step 2: Setting as cover photo...');
    
    // Try different approaches for cover photo
    const coverMethods = [
      { photo: photoId },
      { cover: photoId },
      { picture: photoId }
    ];
    
    for (let i = 0; i < coverMethods.length; i++) {
      try {
        const method = coverMethods[i];
        console.log(`Trying method ${i + 1}:`, method);
        
        const coverResponse = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}/picture`, {
          ...method,
          access_token: ACCESS_TOKEN
        });
        
        console.log('✅ Cover photo set successfully!');
        console.log('Response:', coverResponse.data);
        return { photoId, coverResponse: coverResponse.data };
        
      } catch (methodError) {
        console.log(`❌ Method ${i + 1} failed:`, methodError.response?.data?.error?.message || methodError.message);
      }
    }
    
    console.log('❌ All cover photo methods failed');
    
  } catch (error) {
    console.error('❌ Error in cover photo process:', error.response?.data || error.message);
  }
}

async function fixAllPhotos() {
  console.log('🎨 Starting comprehensive photo fix...\n');
  
  // Try profile photo
  console.log('=== PROFILE PHOTO ===');
  await uploadAndSetProfilePhoto();
  
  console.log('\n=== COVER PHOTO ===');
  await uploadAndSetCoverPhoto();
  
  console.log('\n🎉 Photo fix process completed!');
}

if (require.main === module) {
  fixAllPhotos();
}

module.exports = { uploadAndSetProfilePhoto, uploadAndSetCoverPhoto, fixAllPhotos };
