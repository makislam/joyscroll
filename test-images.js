/**
 * Test script to verify our new Unsplash psalm images system
 */

const { unsplashPsalmImages } = require('./data/unsplashPsalmImages.ts');

function testPsalmImages() {
    console.log('🎯 Testing the new 100% Unsplash psalm images system...\n');
    
    // Test a few specific psalms
    const testPsalms = [1, 23, 46, 91, 121, 150];
    
    console.log(`📊 Total images available: ${Object.keys(unsplashPsalmImages).length}`);
    console.log(`🎨 Testing psalms: ${testPsalms.join(', ')}\n`);
    
    testPsalms.forEach(psalmNumber => {
        const image = unsplashPsalmImages[psalmNumber];
        if (image) {
            console.log(`✅ Psalm ${psalmNumber}:`);
            console.log(`   📸 Photographer: ${image.photographer}`);
            console.log(`   🔗 URL: ${image.url.substring(0, 60)}...`);
            console.log(`   🎭 Attribution: ${image.attribution}`);
            console.log(`   📱 Source: ${image.source}\n`);
        } else {
            console.log(`❌ Psalm ${psalmNumber}: No image found\n`);
        }
    });
    
    // Check coverage
    const totalPsalms = 150;
    const availableImages = Object.keys(unsplashPsalmImages).length;
    const coverage = (availableImages / totalPsalms * 100).toFixed(1);
    
    console.log(`📈 Coverage Summary:`);
    console.log(`   Total Psalms: ${totalPsalms}`);
    console.log(`   Available Images: ${availableImages}`);
    console.log(`   Coverage: ${coverage}%`);
    console.log(`   Status: ${coverage === '100.0' ? '🎉 Complete!' : '⚠️  Incomplete'}`);
}

// Run the test
try {
    testPsalmImages();
} catch (error) {
    console.error('❌ Test failed:', error);
}