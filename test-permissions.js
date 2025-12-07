const axios = require('axios');

const ACCESS_TOKEN = 'EAALXeRNJkWEBQLApgrROzVBtvrwPD7lfCQszZAfqv49Twzg3MZBCwMT6yF5f1UJOCwwYOBIsxxreZC8m9mwHyjuP0SbKa7u14DZBfdMmNXr5XUZAmKQK0prx4EmQufUEWctEWdFyOietxGDqOTjJsmUX1DNEXOJK6XWxzY1SnqBt80Kjt8ZAyR1YZAQdkvUZBMUNCwYSdpQnbfzGzuvC3ZBFkP70UZBlhy3k4LIXYeIQZDZD';
const PAGE_ID = '923280350869125';

async function testPageCapabilities() {
  try {
    console.log('🔍 Testing Facebook Page API capabilities...\n');
    
    // Test 1: Check what type of token this is
    console.log('1️⃣ Checking access token type...');
    const tokenInfo = await axios.get(`https://graph.facebook.com/v18.0/me?access_token=${ACCESS_TOKEN}`);
    console.log('✅ Token is for:', tokenInfo.data.name);
    console.log('📝 Token type: Page Access Token');
    
    // Test 2: Check page basic info
    console.log('\n2️⃣ Checking page information...');
    const pageInfo = await axios.get(`https://graph.facebook.com/v18.0/${PAGE_ID}?fields=name,category,about,website&access_token=${ACCESS_TOKEN}`);
    console.log('✅ Page name:', pageInfo.data.name);
    console.log('📂 Category:', pageInfo.data.category || 'Not set');
    console.log('📝 About:', pageInfo.data.about || 'Not set');
    
    // Test 3: Test posting capability (dry run)
    console.log('\n3️⃣ Testing post capability...');
    try {
      // Try to get page posts to see if we have read access
      const posts = await axios.get(`https://graph.facebook.com/v18.0/${PAGE_ID}/posts?limit=1&access_token=${ACCESS_TOKEN}`);
      console.log('✅ Can read page posts');
    } catch (postError) {
      console.log('❌ Cannot read page posts:', postError.response?.data?.error?.message);
    }
    
    // Test 4: Test photo upload capability (dry run)
    console.log('\n4️⃣ Testing photo upload capability...');
    try {
      // Try to get page photos to see if we have access
      const photos = await axios.get(`https://graph.facebook.com/v18.0/${PAGE_ID}/photos?limit=1&access_token=${ACCESS_TOKEN}`);
      console.log('✅ Can access page photos');
    } catch (photoError) {
      console.log('❌ Cannot access page photos:', photoError.response?.data?.error?.message);
    }
    
    // Test 5: Check token scopes (if available)
    console.log('\n5️⃣ Checking token details...');
    try {
      const debugToken = await axios.get(`https://graph.facebook.com/v18.0/debug_token?input_token=${ACCESS_TOKEN}&access_token=${ACCESS_TOKEN}`);
      if (debugToken.data.data.scopes) {
        console.log('📋 Token scopes:', debugToken.data.data.scopes);
      }
      console.log('⏰ Token expires:', debugToken.data.data.expires_at ? new Date(debugToken.data.data.expires_at * 1000) : 'Never');
    } catch (debugError) {
      console.log('ℹ️ Could not get detailed token info');
    }
    
    console.log('\n🎯 What you can try:');
    console.log('   1. Try running the main setup script');
    console.log('   2. If it fails, you may need additional permissions');
    console.log('   3. Check Facebook Business Manager for page roles');
    
  } catch (error) {
    console.error('❌ Error testing capabilities:', error.response?.data || error.message);
    
    if (error.response?.data?.error?.code === 190) {
      console.log('\n🔧 Token issue detected. You may need to:');
      console.log('   1. Generate a new access token');
      console.log('   2. Ensure you have admin rights to the page');
      console.log('   3. Use Facebook Business Manager to create a proper token');
    }
    
    if (error.response?.data?.error?.code === 100) {
      console.log('\n💡 This appears to be a Page Access Token (which is good!)');
      console.log('   Try running the main setup script - it might work!');
    }
  }
}

testPageCapabilities();
