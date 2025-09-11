const fs = require('fs');
const path = require('path');

// Complete Psalm 148 (all 14 verses) to replace the current 4-verse version
const psalm148Complete = {
  "number": 148,
  "title": "Praise the Lord from the Heavens",
  "verses": [
    {
      "id": "psalm-148-1",
      "text": "Praise the Lord! Praise the Lord from the heavens; praise him in the heights!",
      "verseNumber": 1
    },
    {
      "id": "psalm-148-2",
      "text": "Praise him, all his angels; praise him, all his hosts!",
      "verseNumber": 2
    },
    {
      "id": "psalm-148-3",
      "text": "Praise him, sun and moon; praise him, all you shining stars!",
      "verseNumber": 3
    },
    {
      "id": "psalm-148-4",
      "text": "Praise him, you highest heavens, and you waters above the heavens!",
      "verseNumber": 4
    },
    {
      "id": "psalm-148-5",
      "text": "Let them praise the name of the Lord! For he commanded and they were created.",
      "verseNumber": 5
    },
    {
      "id": "psalm-148-6",
      "text": "And he established them forever and ever; he gave a decree, and it shall not pass away.",
      "verseNumber": 6
    },
    {
      "id": "psalm-148-7",
      "text": "Praise the Lord from the earth, you great sea creatures and all deeps,",
      "verseNumber": 7
    },
    {
      "id": "psalm-148-8",
      "text": "fire and hail, snow and mist, stormy wind fulfilling his word!",
      "verseNumber": 8
    },
    {
      "id": "psalm-148-9",
      "text": "Mountains and all hills, fruit trees and all cedars!",
      "verseNumber": 9
    },
    {
      "id": "psalm-148-10",
      "text": "Beasts and all livestock, creeping things and flying birds!",
      "verseNumber": 10
    },
    {
      "id": "psalm-148-11",
      "text": "Kings of the earth and all peoples, princes and all rulers of the earth!",
      "verseNumber": 11
    },
    {
      "id": "psalm-148-12",
      "text": "Young men and maidens together, old men and children!",
      "verseNumber": 12
    },
    {
      "id": "psalm-148-13",
      "text": "Let them praise the name of the Lord, for his name alone is exalted; his majesty is above earth and heaven.",
      "verseNumber": 13
    },
    {
      "id": "psalm-148-14",
      "text": "He has raised up a horn for his people, praise for all his saints, for the people of Israel who are near to him. Praise the Lord!",
      "verseNumber": 14
    }
  ]
};

// Complete Psalm 23 (The Lord is My Shepherd) - all 6 verses
const psalm23Complete = {
  "number": 23,
  "title": "The Lord is My Shepherd",
  "verses": [
    {
      "id": "psalm-23-1",
      "text": "The Lord is my shepherd; I shall not want.",
      "verseNumber": 1
    },
    {
      "id": "psalm-23-2",
      "text": "He makes me lie down in green pastures. He leads me beside still waters.",
      "verseNumber": 2
    },
    {
      "id": "psalm-23-3",
      "text": "He restores my soul. He leads me in paths of righteousness for his name's sake.",
      "verseNumber": 3
    },
    {
      "id": "psalm-23-4",
      "text": "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
      "verseNumber": 4
    },
    {
      "id": "psalm-23-5",
      "text": "You prepare a table before me in the presence of my enemies; you anoint my head with oil; my cup overflows.",
      "verseNumber": 5
    },
    {
      "id": "psalm-23-6",
      "text": "Surely goodness and mercy shall follow me all the days of my life, and I shall dwell in the house of the Lord forever.",
      "verseNumber": 6
    }
  ]
};

// Complete Psalm 91 - Protection Under God's Wings (16 verses)
const psalm91Complete = {
  "number": 91,
  "title": "Protection Under God's Wings",
  "verses": [
    {
      "id": "psalm-91-1",
      "text": "He who dwells in the shelter of the Most High will abide in the shadow of the Almighty.",
      "verseNumber": 1
    },
    {
      "id": "psalm-91-2",
      "text": "I will say to the Lord, \"My refuge and my fortress, my God, in whom I trust.\"",
      "verseNumber": 2
    },
    {
      "id": "psalm-91-3",
      "text": "For he will deliver you from the snare of the fowler and from the deadly pestilence.",
      "verseNumber": 3
    },
    {
      "id": "psalm-91-4",
      "text": "He will cover you with his pinions, and under his wings you will find refuge; his faithfulness is a shield and buckler.",
      "verseNumber": 4
    },
    {
      "id": "psalm-91-5",
      "text": "You will not fear the terror of the night, nor the arrow that flies by day,",
      "verseNumber": 5
    },
    {
      "id": "psalm-91-6",
      "text": "nor the pestilence that stalks in darkness, nor the destruction that wastes at noonday.",
      "verseNumber": 6
    },
    {
      "id": "psalm-91-7",
      "text": "A thousand may fall at your side, ten thousand at your right hand, but it will not come near you.",
      "verseNumber": 7
    },
    {
      "id": "psalm-91-8",
      "text": "You will only look with your eyes and see the recompense of the wicked.",
      "verseNumber": 8
    },
    {
      "id": "psalm-91-9",
      "text": "Because you have made the Lord your dwelling place—the Most High, who is my refuge—",
      "verseNumber": 9
    },
    {
      "id": "psalm-91-10",
      "text": "no evil shall be allowed to befall you, no plague come near your tent.",
      "verseNumber": 10
    },
    {
      "id": "psalm-91-11",
      "text": "For he will command his angels concerning you to guard you in all your ways.",
      "verseNumber": 11
    },
    {
      "id": "psalm-91-12",
      "text": "On their hands they will bear you up, lest you strike your foot against a stone.",
      "verseNumber": 12
    },
    {
      "id": "psalm-91-13",
      "text": "You will tread on the lion and the adder; the young lion and the serpent you will trample underfoot.",
      "verseNumber": 13
    },
    {
      "id": "psalm-91-14",
      "text": "\"Because he holds fast to me in love, I will deliver him; I will protect him, because he knows my name.",
      "verseNumber": 14
    },
    {
      "id": "psalm-91-15",
      "text": "When he calls to me, I will answer him; I will be with him in trouble; I will rescue him and honor him.",
      "verseNumber": 15
    },
    {
      "id": "psalm-91-16",
      "text": "With long life I will satisfy him and show him my salvation.\"",
      "verseNumber": 16
    }
  ]
};

// Complete Psalm 27 - The Lord is My Light (14 verses)
const psalm27Complete = {
  "number": 27,
  "title": "The Lord is My Light and My Salvation",
  "verses": [
    {
      "id": "psalm-27-1",
      "text": "The Lord is my light and my salvation; whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?",
      "verseNumber": 1
    },
    {
      "id": "psalm-27-2",
      "text": "When the wicked advance against me to devour me, it is my enemies and my foes who will stumble and fall.",
      "verseNumber": 2
    },
    {
      "id": "psalm-27-3",
      "text": "Though an army besiege me, my heart will not fear; though war break out against me, even then I will be confident.",
      "verseNumber": 3
    },
    {
      "id": "psalm-27-4",
      "text": "One thing I ask from the Lord, this only do I seek: that I may dwell in the house of the Lord all the days of my life, to gaze on the beauty of the Lord and to seek him in his temple.",
      "verseNumber": 4
    },
    {
      "id": "psalm-27-5",
      "text": "For in the day of trouble he will keep me safe in his dwelling; he will hide me in the shelter of his sacred tent and set me high upon a rock.",
      "verseNumber": 5
    },
    {
      "id": "psalm-27-6",
      "text": "Then my head will be exalted above the enemies who surround me; at his sacred tent I will sacrifice with shouts of joy; I will sing and make music to the Lord.",
      "verseNumber": 6
    },
    {
      "id": "psalm-27-7",
      "text": "Hear my voice when I call, Lord; be merciful to me and answer me.",
      "verseNumber": 7
    },
    {
      "id": "psalm-27-8",
      "text": "My heart says of you, \"Seek his face!\" Your face, Lord, I will seek.",
      "verseNumber": 8
    },
    {
      "id": "psalm-27-9",
      "text": "Do not hide your face from me, do not turn your servant away in anger; you have been my helper. Do not reject me or forsake me, God my Savior.",
      "verseNumber": 9
    },
    {
      "id": "psalm-27-10",
      "text": "Though my father and mother forsake me, the Lord will receive me.",
      "verseNumber": 10
    },
    {
      "id": "psalm-27-11",
      "text": "Teach me your way, Lord; lead me in a straight path because of my oppressors.",
      "verseNumber": 11
    },
    {
      "id": "psalm-27-12",
      "text": "Do not turn me over to the desire of my foes, for false witnesses rise up against me, spouting malicious accusations.",
      "verseNumber": 12
    },
    {
      "id": "psalm-27-13",
      "text": "I remain confident of this: I will see the goodness of the Lord in the land of the living.",
      "verseNumber": 13
    },
    {
      "id": "psalm-27-14",
      "text": "Wait for the Lord; be strong and take heart and wait for the Lord.",
      "verseNumber": 14
    }
  ]
};

// Function to update the Psalms data
function updatePsalmsData() {
  try {
    // Read the current psalms.ts file
    const psalmsPath = path.join(__dirname, '..', 'data', 'psalms.ts');
    const currentContent = fs.readFileSync(psalmsPath, 'utf8');
    
    // Extract the existing data
    const dataMatch = currentContent.match(/export const psalmsData: Psalm\[\] = (\[[\s\S]*?\]);/);
    if (!dataMatch) {
      throw new Error('Could not parse existing psalms data');
    }
    
    let existingPsalms = JSON.parse(dataMatch[1]);
    
    // Update or add the complete Psalms
    const completePsalms = [psalm23Complete, psalm27Complete, psalm91Complete, psalm148Complete];
    
    completePsalms.forEach(newPsalm => {
      const existingIndex = existingPsalms.findIndex(p => p.number === newPsalm.number);
      if (existingIndex >= 0) {
        // Replace existing
        const oldVerseCount = existingPsalms[existingIndex].verses.length;
        existingPsalms[existingIndex] = newPsalm;
        console.log(`✅ Updated Psalm ${newPsalm.number}: ${oldVerseCount} → ${newPsalm.verses.length} verses`);
      } else {
        // Add new
        existingPsalms.push(newPsalm);
        console.log(`➕ Added complete Psalm ${newPsalm.number}: ${newPsalm.verses.length} verses`);
      }
    });
    
    // Sort by Psalm number
    existingPsalms.sort((a, b) => a.number - b.number);
    
    // Generate the new file content
    const newContent = `import { Psalm } from '@/types'

// Sample Psalms data (Enhanced with complete versions!)
// Now includes complete Psalms with all verses for better "Read Full Chapter" experience

export const psalmsData: Psalm[] = ${JSON.stringify(existingPsalms, null, 2)}
`;
    
    // Write the updated file
    fs.writeFileSync(psalmsPath, newContent);
    
    const totalVerses = existingPsalms.reduce((sum, psalm) => sum + psalm.verses.length, 0);
    console.log(`\n🎉 Successfully updated psalms.ts!`);
    console.log(`📖 Total Psalms: ${existingPsalms.length}`);
    console.log(`📝 Total verses: ${totalVerses}`);
    console.log(`📁 File: ${psalmsPath}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error updating psalms data:', error.message);
    return false;
  }
}

// Run the update
console.log('🔄 Updating Psalms with complete verses...\n');
updatePsalmsData();
