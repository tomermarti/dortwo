// Simple execution script for Facebook page setup
import { setupRealEstatePage, publishPost, alternativePosts } from './facebook-real-estate-api.js';

console.log('🚀 Starting Facebook page setup for קרקעות פרימיום...\n');

// Run the complete setup
setupRealEstatePage()
  .then(() => {
    console.log('\n🎉 All done! Your Facebook page is now set up with:');
    console.log('   ✅ Cover photo');
    console.log('   ✅ Profile photo');  
    console.log('   ✅ Page information');
    console.log('   ✅ Welcome post');
    console.log('\n📝 You can also publish alternative posts using:');
    console.log('   - alternativePosts.post1');
    console.log('   - alternativePosts.post2');
  })
  .catch((error) => {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Check your ACCESS_TOKEN is valid');
    console.log('   2. Ensure you have admin rights to the page');
    console.log('   3. Verify the PAGE_ID is correct');
    console.log('   4. Check your internet connection');
  });
