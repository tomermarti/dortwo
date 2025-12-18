const axios = require('axios');

// Your current User Access Token
const USER_ACCESS_TOKEN = 'EAALXeRNJkWEBQLApgrROzVBtvrwPD7lfCQszZAfqv49Twzg3MZBCwMT6yF5f1UJOCwwYOBIsxxreZC8m9mwHyjuP0SbKa7u14DZBfdMmNXr5XUZAmKQK0prx4EmQufUEWctEWdFyOietxGDqOTjJsmUX1DNEXOJK6XWxzY1SnqBt80Kjt8ZAyR1YZAQdkvUZBMUNCwYSdpQnbfzGzuvC3ZBFkP70UZBlhy3k4LIXYeIQZDZD';

async function getPageAccessToken() {
  try {
    console.log('🔍 Getting your pages and their access tokens...\n');
    
    // Get all pages the user manages
    const response = await axios.get(`https://graph.facebook.com/v18.0/me/accounts`, {
      params: {
        access_token: USER_ACCESS_TOKEN
      }
    });
    
    console.log('📄 Your Facebook Pages:');
    console.log('========================');
    
    if (response.data.data && response.data.data.length > 0) {
      response.data.data.forEach((page, index) => {
        console.log(`${index + 1}. ${page.name}`);
        console.log(`   Page ID: ${page.id}`);
        console.log(`   Category: ${page.category}`);
        console.log(`   Page Access Token: ${page.access_token}`);
        console.log('   ---');
      });
      
      // Find the specific page
      const targetPage = response.data.data.find(page => page.id === '923280350869125');
      
      if (targetPage) {
        console.log('\n🎯 Found your target page!');
        console.log(`Page Name: ${targetPage.name}`);
        console.log(`Page ID: ${targetPage.id}`);
        console.log(`\n📝 Update your facebook-real-estate-api.js with this Page Access Token:`);
        console.log(`const ACCESS_TOKEN = '${targetPage.access_token}';`);
        
        return targetPage.access_token;
      } else {
        console.log('\n❌ Target page (923280350869125) not found in your managed pages.');
        console.log('Make sure you are an admin of this page.');
      }
    } else {
      console.log('❌ No pages found. Make sure you have admin access to Facebook pages.');
    }
    
  } catch (error) {
    console.error('❌ Error getting page access token:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Your User Access Token might be expired');
      console.log('2. Make sure you have "pages_manage_metadata" permission');
      console.log('3. Regenerate your token with proper permissions');
    }
  }
}

// Run the function
if (require.main === module) {
  getPageAccessToken();
}

module.exports = { getPageAccessToken };
