const axios = require('axios');

const USER_ACCESS_TOKEN = 'EAALXeRNJkWEBQLApgrROzVBtvrwPD7lfCQszZAfqv49Twzg3MZBCwMT6yF5f1UJOCwwYOBIsxxreZC8m9mwHyjuP0SbKa7u14DZBfdMmNXr5XUZAmKQK0prx4EmQufUEWctEWdFyOietxGDqOTjJsmUX1DNEXOJK6XWxzY1SnqBt80Kjt8ZAyR1YZAQdkvUZBMUNCwYSdpQnbfzGzuvC3ZBFkP70UZBlhy3k4LIXYeIQZDZD';
const PAGE_ID = '923280350869125';

// Function to get Page Access Token
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

// Multiple profile photo options
const profilePhotoOptions = [
  {
    name: 'Real Estate Building',
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop&crop=center'
  },
  {
    name: 'Modern Architecture',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop&crop=center'
  },
  {
    name: 'City Skyline',
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop&crop=center'
  },
  {
    name: 'Construction Site',
    url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=400&fit=crop&crop=center'
  }
];

// Function to try multiple methods for profile photo upload
async function uploadProfilePhoto(imageUrl, pageAccessToken) {
  const methods = [
    // Method 1: POST with JSON body
    async () => {
      return await axios.post(`https://graph.facebook.com/v22.0/${PAGE_ID}/picture`, {
        url: imageUrl,
        access_token: pageAccessToken
      });
    },
    
    // Method 2: POST with form data
    async () => {
      return await axios.post(`https://graph.facebook.com/v22.0/${PAGE_ID}/picture`, null, {
        params: {
          url: imageUrl,
          access_token: pageAccessToken
        }
      });
    },
    
    // Method 3: PUT method
    async () => {
      return await axios.put(`https://graph.facebook.com/v22.0/${PAGE_ID}/picture`, {
        url: imageUrl,
        access_token: pageAccessToken
      });
    }
  ];
  
  for (let i = 0; i < methods.length; i++) {
    try {
      console.log(`🔄 Trying method ${i + 1}...`);
      const response = await methods[i]();
      console.log(`✅ Success with method ${i + 1}!`);
      return response.data;
    } catch (error) {
      console.log(`❌ Method ${i + 1} failed:`, error.response?.data?.error?.message || error.message);
      if (i === methods.length - 1) {
        throw error;
      }
    }
  }
}

// Function to try all profile photo options
async function tryAllProfilePhotos() {
  try {
    console.log('🚀 Trying to Upload Profile Photo for קרקעות פרימיום...\n');
    
    const pageAccessToken = await getPageAccessToken();
    if (!pageAccessToken) {
      console.log('❌ Could not get Page Access Token');
      return;
    }
    
    for (let i = 0; i < profilePhotoOptions.length; i++) {
      const option = profilePhotoOptions[i];
      console.log(`\n📸 Trying ${option.name}...`);
      console.log(`🔗 URL: ${option.url}`);
      
      try {
        await uploadProfilePhoto(option.url, pageAccessToken);
        console.log(`🎉 SUCCESS! Profile photo uploaded: ${option.name}`);
        return;
      } catch (error) {
        console.log(`❌ Failed with ${option.name}`);
        if (i === profilePhotoOptions.length - 1) {
          console.log('\n💡 All automatic methods failed. Try manual upload:');
          console.log('   1. Go to your Facebook page');
          console.log('   2. Click on profile photo');
          console.log('   3. Upload a professional real estate image');
          console.log('   4. Suggested: Building, architecture, or company logo');
        }
      }
    }
    
  } catch (error) {
    console.error('\n❌ Profile photo upload failed:', error.message);
  }
}

// Function to upload cover photo as well
async function tryAllCoverPhotos() {
  const coverPhotoOptions = [
    {
      name: 'Tel Aviv Skyline',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=628&fit=crop&crop=center'
    },
    {
      name: 'Modern City',
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=628&fit=crop&crop=center'
    },
    {
      name: 'Construction Development',
      url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=628&fit=crop&crop=center'
    }
  ];
  
  try {
    console.log('\n🖼️ Trying to Upload Cover Photo...\n');
    
    const pageAccessToken = await getPageAccessToken();
    if (!pageAccessToken) return;
    
    for (const option of coverPhotoOptions) {
      console.log(`📸 Trying ${option.name}...`);
      
      try {
        const response = await axios.post(`https://graph.facebook.com/v22.0/${PAGE_ID}/picture`, {
          url: option.url,
          type: 'cover',
          access_token: pageAccessToken
        });
        
        console.log(`🎉 SUCCESS! Cover photo uploaded: ${option.name}`);
        return;
      } catch (error) {
        console.log(`❌ Failed with ${option.name}`);
      }
    }
    
    console.log('\n💡 Cover photo upload failed. Try manual upload.');
    
  } catch (error) {
    console.error('❌ Cover photo upload failed:', error.message);
  }
}

// Main function to try both
async function updateAllPhotos() {
  console.log('🎯 Updating All Photos for קרקעות פרימיום\n');
  console.log('═'.repeat(50));
  
  await tryAllProfilePhotos();
  await tryAllCoverPhotos();
  
  console.log('\n🏁 Photo update process completed!');
}

// Export functions
module.exports = {
  tryAllProfilePhotos,
  tryAllCoverPhotos,
  updateAllPhotos,
  getPageAccessToken
};

// Run if called directly
if (require.main === module) {
  updateAllPhotos();
}
