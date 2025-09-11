/**
 * Test script to demonstrate the Psalm generation approach
 * This creates a sample of 10 Psalms to show the concept
 */

const fs = require('fs');
const path = require('path');

// Sample ESV data for demonstration (first 10 Psalms with key verses)
const samplePsalmsData = [
  {
    number: 1,
    title: "The Way of the Righteous and the Wicked",
    verses: [
      {
        id: "psalm-1-1",
        text: "Blessed is the man who walks not in the counsel of the wicked, nor stands in the way of sinners, nor sits in the seat of scoffers;",
        verseNumber: 1
      },
      {
        id: "psalm-1-2",
        text: "but his delight is in the law of the Lord, and on his law he meditates day and night.",
        verseNumber: 2
      },
      {
        id: "psalm-1-3",
        text: "He is like a tree planted by streams of water that yields its fruit in its season, and its leaf does not wither. In all that he does, he prospers.",
        verseNumber: 3
      },
      {
        id: "psalm-1-4",
        text: "The wicked are not so, but are like chaff that the wind drives away.",
        verseNumber: 4
      },
      {
        id: "psalm-1-5",
        text: "Therefore the wicked will not stand in the judgment, nor sinners in the congregation of the righteous;",
        verseNumber: 5
      },
      {
        id: "psalm-1-6",
        text: "for the Lord knows the way of the righteous, but the way of the wicked will perish.",
        verseNumber: 6
      }
    ]
  },
  {
    number: 2,
    title: "Why Do the Nations Rage?",
    verses: [
      {
        id: "psalm-2-1",
        text: "Why do the nations rage and the peoples plot in vain?",
        verseNumber: 1
      },
      {
        id: "psalm-2-2",
        text: "The kings of the earth set themselves, and the rulers take counsel together, against the Lord and against his Anointed, saying,",
        verseNumber: 2
      },
      {
        id: "psalm-2-7",
        text: "I will tell of the decree: The Lord said to me, \"You are my Son; today I have begotten you.\"",
        verseNumber: 7
      },
      {
        id: "psalm-2-11",
        text: "Serve the Lord with fear, and rejoice with trembling.",
        verseNumber: 11
      },
      {
        id: "psalm-2-12",
        text: "Kiss the Son, lest he be angry, and you perish in the way, for his wrath is quickly kindled. Blessed are all who take refuge in him.",
        verseNumber: 12
      }
    ]
  },
  {
    number: 8,
    title: "How Majestic Is Your Name",
    verses: [
      {
        id: "psalm-8-1",
        text: "O Lord, our Lord, how majestic is your name in all the earth! You have set your glory above the heavens.",
        verseNumber: 1
      },
      {
        id: "psalm-8-3",
        text: "When I look at your heavens, the work of your fingers, the moon and the stars, which you have set in place,",
        verseNumber: 3
      },
      {
        id: "psalm-8-4",
        text: "what is man that you are mindful of him, and the son of man that you care for him?",
        verseNumber: 4
      },
      {
        id: "psalm-8-5",
        text: "Yet you have made him a little lower than the heavenly beings and crowned him with glory and honor.",
        verseNumber: 5
      },
      {
        id: "psalm-8-9",
        text: "O Lord, our Lord, how majestic is your name in all the earth!",
        verseNumber: 9
      }
    ]
  },
  {
    number: 19,
    title: "The Heavens Declare the Glory of God",
    verses: [
      {
        id: "psalm-19-1",
        text: "The heavens declare the glory of God, and the sky above proclaims his handiwork.",
        verseNumber: 1
      },
      {
        id: "psalm-19-7",
        text: "The law of the Lord is perfect, reviving the soul; the testimony of the Lord is sure, making wise the simple;",
        verseNumber: 7
      },
      {
        id: "psalm-19-8",
        text: "the precepts of the Lord are right, rejoicing the heart; the commandment of the Lord is pure, enlightening the eyes;",
        verseNumber: 8
      },
      {
        id: "psalm-19-14",
        text: "Let the words of my mouth and the meditation of my heart be acceptable in your sight, O Lord, my rock and my redeemer.",
        verseNumber: 14
      }
    ]
  },
  {
    number: 51,
    title: "Create in Me a Clean Heart",
    verses: [
      {
        id: "psalm-51-1",
        text: "Have mercy on me, O God, according to your steadfast love; according to your abundant mercy blot out my transgressions.",
        verseNumber: 1
      },
      {
        id: "psalm-51-2",
        text: "Wash me thoroughly from my iniquity, and cleanse me from my sin!",
        verseNumber: 2
      },
      {
        id: "psalm-51-10",
        text: "Create in me a clean heart, O God, and renew a right spirit within me.",
        verseNumber: 10
      },
      {
        id: "psalm-51-12",
        text: "Restore to me the joy of your salvation, and uphold me with a willing spirit.",
        verseNumber: 12
      },
      {
        id: "psalm-51-17",
        text: "The sacrifices of God are a broken spirit; a broken and contrite heart, O God, you will not despise.",
        verseNumber: 17
      }
    ]
  },
  {
    number: 96,
    title: "Sing to the Lord a New Song",
    verses: [
      {
        id: "psalm-96-1",
        text: "Oh sing to the Lord a new song; sing to the Lord, all the earth!",
        verseNumber: 1
      },
      {
        id: "psalm-96-2",
        text: "Sing to the Lord, bless his name; tell of his salvation from day to day.",
        verseNumber: 2
      },
      {
        id: "psalm-96-3",
        text: "Declare his glory among the nations, his marvelous works among all the peoples!",
        verseNumber: 3
      },
      {
        id: "psalm-96-4",
        text: "For great is the Lord, and greatly to be praised; he is to be feared above all gods.",
        verseNumber: 4
      },
      {
        id: "psalm-96-13",
        text: "before the Lord, for he comes, for he comes to judge the earth. He will judge the world in righteousness, and the peoples in his faithfulness.",
        verseNumber: 13
      }
    ]
  },
  {
    number: 117,
    title: "Praise the Lord, All Nations",
    verses: [
      {
        id: "psalm-117-1",
        text: "Praise the Lord, all nations! Extol him, all peoples!",
        verseNumber: 1
      },
      {
        id: "psalm-117-2",
        text: "For great is his steadfast love toward us, and the faithfulness of the Lord endures forever. Praise the Lord!",
        verseNumber: 2
      }
    ]
  },
  {
    number: 133,
    title: "Behold, How Good and Pleasant",
    verses: [
      {
        id: "psalm-133-1",
        text: "Behold, how good and pleasant it is when brothers dwell in unity!",
        verseNumber: 1
      },
      {
        id: "psalm-133-2",
        text: "It is like the precious oil on the head, running down on the beard, on the beard of Aaron, running down on the collar of his robes!",
        verseNumber: 2
      },
      {
        id: "psalm-133-3",
        text: "It is like the dew of Hermon, which falls on the mountains of Zion! For there the Lord has commanded the blessing, life forevermore.",
        verseNumber: 3
      }
    ]
  },
  {
    number: 148,
    title: "Praise the Lord from the Heavens",
    verses: [
      {
        id: "psalm-148-1",
        text: "Praise the Lord! Praise the Lord from the heavens; praise him in the heights!",
        verseNumber: 1
      },
      {
        id: "psalm-148-3",
        text: "Praise him, sun and moon, praise him, all you shining stars!",
        verseNumber: 3
      },
      {
        id: "psalm-148-7",
        text: "Praise the Lord from the earth, you great sea creatures and all deeps,",
        verseNumber: 7
      },
      {
        id: "psalm-148-13",
        text: "Let them praise the name of the Lord, for his name alone is exalted; his majesty is above earth and heaven.",
        verseNumber: 13
      }
    ]
  },
  {
    number: 150,
    title: "Praise the Lord",
    verses: [
      {
        id: "psalm-150-1",
        text: "Praise the Lord! Praise God in his sanctuary; praise him in his mighty heavens!",
        verseNumber: 1
      },
      {
        id: "psalm-150-2",
        text: "Praise him for his mighty deeds; praise him according to his excellent greatness!",
        verseNumber: 2
      },
      {
        id: "psalm-150-3",
        text: "Praise him with trumpet sound; praise him with lute and harp!",
        verseNumber: 3
      },
      {
        id: "psalm-150-6",
        text: "Let everything that has breath praise the Lord! Praise the Lord!",
        verseNumber: 6
      }
    ]
  }
];

function generateSamplePsalms() {
  console.log('🎵 Generating sample Psalms to demonstrate the approach...');
  
  const fileContent = `import { Psalm } from '@/types'

// Sample Psalms data (10 Psalms to demonstrate the concept)
// Run 'npm run generate-psalms' to get all 150 Psalms automatically!

export const psalmsData: Psalm[] = ${JSON.stringify(samplePsalmsData, null, 2)};

// 📊 Statistics:
// - Psalms: ${samplePsalmsData.length} (sample - full script generates all 150)
// - Total verses: ${samplePsalmsData.reduce((sum, psalm) => sum + psalm.verses.length, 0)}
// - Translation: ESV (English Standard Version)
// 
// 🚀 To get all 150 Psalms:
// 1. Get ESV API key from https://api.esv.org/
// 2. Add key to scripts/generatePsalms.js
// 3. Run: npm run generate-psalms
`;

  const outputPath = path.join(__dirname, '..', 'data', 'psalms.ts');
  fs.writeFileSync(outputPath, fileContent, 'utf8');
  
  console.log('✅ Sample Psalms generated successfully!');
  console.log(`📁 File: ${outputPath}`);
  console.log(`📊 Generated ${samplePsalmsData.length} Psalms with ${samplePsalmsData.reduce((sum, psalm) => sum + psalm.verses.length, 0)} verses`);
  console.log('');
  console.log('🎯 Next steps:');
  console.log('1. Check your app - it now has 10 diverse Psalms to test');
  console.log('2. Get ESV API key: https://api.esv.org/');
  console.log('3. Run: npm run generate-psalms (for all 150 Psalms)');
  console.log('');
  console.log('🎉 This demonstrates how much better API generation is vs manual entry!');
}

if (require.main === module) {
  generateSamplePsalms();
}

module.exports = { generateSamplePsalms, samplePsalmsData };
