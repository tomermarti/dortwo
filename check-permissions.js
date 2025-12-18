const axios = require('axios');

const ACCESS_TOKEN = 'EAALXeRNJkWEBQHMDW8gec3wTtIMu7Gtmi6wPUnNbLWdIc41Y2PuJfrVZBcHYjGtynHiZC8S9aEJbUw0zWC9R6Q8WpyFz0OVjZABW2ICsQTO478SPN6BD9B8Xmiyqidbp77AjRLLfux2q4K2jhZAQZBXcg5yrOtw6YhZA3uEfpz6cGm6vOMZAVCZAinKg9cKdLvczbgZDZD';
const PAGE_ID = '923280350869125';

async function checkTokenPermissions() {
  try {
    console.log('🔍 Checking Page Access Token permissions...\n');
    
    // Check what permissions this token has
    const response = await axios.get(`https://graph.facebook.com/v18.0/me/permissions`, {
      params: {
        access_token: ACCESS_TOKEN
      }
    });
    
    console.log('📋 Token Permissions:');
    console.log('=====================');
    
    if (response.data.data) {
      response.data.data.forEach(permission => {
        console.log(`${permission.permission}: ${permission.status}`);
      });
    }
    
    // Also check token info
    console.log('\n🔍 Token Information:');
    console.log('=====================');
    
    const tokenInfo = await axios.get(`https://graph.facebook.com/v18.0/me`, {
      params: {
        access_token: ACCESS_TOKEN,
        fields: 'id,name,category'
      }
    });
    
    console.log('Token belongs to:', tokenInfo.data);
    
    // Try a simple test - check if we can read page info
    console.log('\n📄 Page Information Test:');
    console.log('=========================');
    
    const pageInfo = await axios.get(`https://graph.facebook.com/v18.0/${PAGE_ID}`, {
      params: {
        access_token: ACCESS_TOKEN,
        fields: 'id,name,about,description,picture'
      }
    });
    
    console.log('Page info:', pageInfo.data);
    
  } catch (error) {
    console.error('❌ Error checking permissions:', error.response?.data || error.message);
  }
}

// Try alternative photo upload method
async function tryAlternativePhotoUpload() {
  try {
    console.log('\n🔄 Trying alternative photo upload method...');
    
    // Try uploading to photos endpoint first, then setting as profile picture
    const photoResponse = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}/photos`, {
      url: 'https://picsum.photos/400/400?random=5',
      published: false,
      access_token: ACCESS_TOKEN
    });
    
    console.log('✅ Photo uploaded to photos:', photoResponse.data);
    
    // Now try to set it as profile picture
    const profileResponse = await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}/picture`, {
      picture: photoResponse.data.id,
      access_token: ACCESS_TOKEN
    });
    
    console.log('✅ Set as profile picture:', profileResponse.data);
    
  } catch (error) {
    console.error('❌ Alternative method failed:', error.response?.data || error.message);
  }
}

async function main() {
  await checkTokenPermissions();
  await tryAlternativePhotoUpload();
}

if (require.main === module) {
  main();
}

module.exports = { checkTokenPermissions, tryAlternativePhotoUpload };
