const axios = require('axios');

// Facebook configuration
const USER_ACCESS_TOKEN = 'EAALXeRNJkWEBQHMDW8gec3wTtIMu7Gtmi6wPUnNbLWdIc41Y2PuJfrVZBcHYjGtynHiZC8S9aEJbUw0zWC9R6Q8WpyFz0OVjZABW2ICsQTO478SPN6BD9B8Xmiyqidbp77AjRLLfux2q4K2jhZAQZBXcg5yrOtw6YhZA3uEfpz6cGm6vOMZAVCZAinKg9cKdLvczbgZDZD';
const API_VERSION = 'v22.0';

async function checkAccountAccess() {
  try {
    console.log('🔍 Checking Account Access...\n');
    console.log('═'.repeat(60));
    
    // Step 1: Check token info
    console.log('1️⃣ Checking Token Info...');
    try {
      const tokenResponse = await axios.get(`https://graph.facebook.com/${API_VERSION}/me`, {
        params: {
          access_token: USER_ACCESS_TOKEN,
          fields: 'id,name'
        }
      });
      console.log('✅ Token User:', tokenResponse.data);
    } catch (error) {
      console.log('❌ Token check failed:', error.response?.data || error.message);
    }
    
    // Step 2: Check ad accounts
    console.log('\n2️⃣ Checking Available Ad Accounts...');
    try {
      const accountsResponse = await axios.get(`https://graph.facebook.com/${API_VERSION}/me/adaccounts`, {
        params: {
          access_token: USER_ACCESS_TOKEN,
          fields: 'id,name,account_status,currency,timezone_name,business'
        }
      });
      
      console.log('✅ Available Ad Accounts:');
      if (accountsResponse.data.data && accountsResponse.data.data.length > 0) {
        accountsResponse.data.data.forEach((account, index) => {
          console.log(`   ${index + 1}. ID: ${account.id}`);
          console.log(`      Name: ${account.name || 'N/A'}`);
          console.log(`      Status: ${account.account_status || 'N/A'}`);
          console.log(`      Currency: ${account.currency || 'N/A'}`);
          console.log(`      Timezone: ${account.timezone_name || 'N/A'}`);
          console.log(`      Business: ${account.business?.name || 'N/A'}`);
          console.log('');
        });
      } else {
        console.log('   ⚠️ No ad accounts found or accessible');
      }
    } catch (error) {
      console.log('❌ Ad accounts check failed:', error.response?.data || error.message);
    }
    
    // Step 3: Check businesses
    console.log('\n3️⃣ Checking Available Businesses...');
    try {
      const businessResponse = await axios.get(`https://graph.facebook.com/${API_VERSION}/me/businesses`, {
        params: {
          access_token: USER_ACCESS_TOKEN,
          fields: 'id,name,verification_status'
        }
      });
      
      console.log('✅ Available Businesses:');
      if (businessResponse.data.data && businessResponse.data.data.length > 0) {
        businessResponse.data.data.forEach((business, index) => {
          console.log(`   ${index + 1}. ID: ${business.id}`);
          console.log(`      Name: ${business.name || 'N/A'}`);
          console.log(`      Status: ${business.verification_status || 'N/A'}`);
          console.log('');
        });
      } else {
        console.log('   ⚠️ No businesses found or accessible');
      }
    } catch (error) {
      console.log('❌ Business check failed:', error.response?.data || error.message);
    }
    
    // Step 4: Check pages
    console.log('\n4️⃣ Checking Available Pages...');
    try {
      const pagesResponse = await axios.get(`https://graph.facebook.com/${API_VERSION}/me/accounts`, {
        params: {
          access_token: USER_ACCESS_TOKEN,
          fields: 'id,name,category,access_token'
        }
      });
      
      console.log('✅ Available Pages:');
      if (pagesResponse.data.data && pagesResponse.data.data.length > 0) {
        pagesResponse.data.data.forEach((page, index) => {
          console.log(`   ${index + 1}. ID: ${page.id}`);
          console.log(`      Name: ${page.name || 'N/A'}`);
          console.log(`      Category: ${page.category || 'N/A'}`);
          console.log(`      Has Token: ${page.access_token ? 'Yes' : 'No'}`);
          console.log('');
        });
      } else {
        console.log('   ⚠️ No pages found or accessible');
      }
    } catch (error) {
      console.log('❌ Pages check failed:', error.response?.data || error.message);
    }
    
    // Step 5: Try to access the specific account
    console.log('\n5️⃣ Testing Specific Account Access...');
    const testAccountId = '1747779905752071';
    try {
      const specificResponse = await axios.get(`https://graph.facebook.com/${API_VERSION}/act_${testAccountId}`, {
        params: {
          access_token: USER_ACCESS_TOKEN,
          fields: 'id,name,account_status,currency'
        }
      });
      console.log('✅ Specific Account Access:', specificResponse.data);
    } catch (error) {
      console.log('❌ Specific account access failed:', error.response?.data?.error || error.message);
      
      if (error.response?.data?.error) {
        const errorMsg = error.response.data.error.message;
        console.log('\n💡 Possible Solutions:');
        
        if (errorMsg.includes('permissions')) {
          console.log('   • Request ads_management permission');
          console.log('   • Make sure you\'re admin of the ad account');
          console.log('   • Check if account is in Business Manager');
        }
        
        if (errorMsg.includes('does not exist')) {
          console.log('   • Verify the account ID is correct');
          console.log('   • Check if account was deleted or suspended');
        }
      }
    }
    
    console.log('\n📋 Summary & Next Steps:');
    console.log('═'.repeat(60));
    console.log('1. Check which ad accounts you have access to above');
    console.log('2. Use one of the accessible account IDs');
    console.log('3. Or request admin access to account 1747779905752071');
    console.log('4. Make sure ads_management permission is granted');
    console.log('5. If no accounts available, create one in Business Manager');
    
  } catch (error) {
    console.error('❌ Account access check failed:', error.message);
  }
}

// Export function
module.exports = { checkAccountAccess };

// Run if called directly
if (require.main === module) {
  checkAccountAccess();
}

