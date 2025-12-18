const axios = require('axios');

// Use the correct Page Access Token
const ACCESS_TOKEN = 'EAALXeRNJkWEBQHMDW8gec3wTtIMu7Gtmi6wPUnNbLWdIc41Y2PuJfrVZBcHYjGtynHiZC8S9aEJbUw0zWC9R6Q8WpyFz0OVjZABW2ICsQTO478SPN6BD9B8Xmiyqidbp77AjRLLfux2q4K2jhZAQZBXcg5yrOtw6YhZA3uEfpz6cGm6vOMZAVCZAinKg9cKdLvczbgZDZD';
const PAGE_ID = '923280350869125';

// Function to upload cover photo using different reliable sources
async function uploadCoverPhotoFixed() {
  // These are more reliable image sources that Facebook can definitely access
  const reliableUrls = [
    'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop', // Pexels city skyline
    'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop', // Pexels modern building
    'https://cdn.pixabay.com/photo/2017/01/14/12/59/iceland-1979445_1280.jpg', // Pixabay landscape
  ];
  
  for (let i = 0; i < reliableUrls.length; i++) {
    try {
      console.log(`📸 Attempting cover photo upload ${i + 1}/${reliableUrls.length}...`);
      console.log(`URL: ${reliableUrls[i]}`);
      
      const response = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}/picture`, {
        url: reliableUrls[i],
        access_token: ACCESS_TOKEN
      });
      
      console.log('✅ Cover photo uploaded successfully!');
      console.log('Response:', response.data);
      return response.data;
      
    } catch (error) {
      console.error(`❌ Attempt ${i + 1} failed:`, error.response?.data || error.message);
      
      if (i === reliableUrls.length - 1) {
        console.log('❌ All cover photo attempts failed');
        throw error;
      }
    }
  }
}

// Function to upload profile photo using different reliable sources
async function uploadProfilePhotoFixed() {
  const reliableUrls = [
    'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', // Pexels building
    'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', // Pexels architecture
    'https://cdn.pixabay.com/photo/2016/11/29/03/53/house-1867187_960_720.jpg', // Pixabay house
  ];
  
  for (let i = 0; i < reliableUrls.length; i++) {
    try {
      console.log(`👤 Attempting profile photo upload ${i + 1}/${reliableUrls.length}...`);
      console.log(`URL: ${reliableUrls[i]}`);
      
      const response = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}/picture`, {
        url: reliableUrls[i],
        access_token: ACCESS_TOKEN
      });
      
      console.log('✅ Profile photo uploaded successfully!');
      console.log('Response:', response.data);
      return response.data;
      
    } catch (error) {
      console.error(`❌ Attempt ${i + 1} failed:`, error.response?.data || error.message);
      
      if (i === reliableUrls.length - 1) {
        console.log('❌ All profile photo attempts failed');
        throw error;
      }
    }
  }
}

// Main function to fix photos
async function fixPagePhotos() {
  try {
    console.log('🔧 Fixing Facebook page photos...\n');
    
    // Try cover photo
    console.log('1️⃣ Fixing cover photo...');
    try {
      await uploadCoverPhotoFixed();
    } catch (error) {
      console.log('⚠️ Cover photo fix failed, continuing...\n');
    }
    
    // Try profile photo
    console.log('2️⃣ Fixing profile photo...');
    try {
      await uploadProfilePhotoFixed();
    } catch (error) {
      console.log('⚠️ Profile photo fix failed, continuing...\n');
    }
    
    console.log('🎉 Photo fix process completed!');
    
  } catch (error) {
    console.error('❌ Photo fix process failed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  fixPagePhotos();
}

module.exports = { uploadCoverPhotoFixed, uploadProfilePhotoFixed, fixPagePhotos };
