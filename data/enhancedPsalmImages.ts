// Enhanced Psalm Images - Combining Unsplash + Picsum
// Unsplash for featured psalms, Picsum for others
// Generated on 2025-09-11T20:15:00.000Z

export interface PsalmImage {
  id: string;
  url: string;
  urlSmall: string;
  urlFull: string;
  description: string;
  photographer: string;
  photographerUrl: string;
  source: string;
  seed?: number;
  theme: string;
  likes?: number;
  color?: string;
  downloadUrl?: string; // Required for Unsplash compliance
}

// Premium Unsplash images for featured psalms
const unsplashImages: Record<number, PsalmImage> = {
  1: {
    id: "IicyiaPYGGI",
    url: "https://images.unsplash.com/photo-1704708819836-9aebd1fb64ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMHJpdmVyJTJDJTIwZmxvd2luZyUyMHdhdGVyfGVufDB8MHx8fDE3NTc2MjE0NDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    urlSmall: "https://images.unsplash.com/photo-1704708819836-9aebd1fb64ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMHJpdmVyJTJDJTIwZmxvd2luZyUyMHdhdGVyfGVufDB8MHx8fDE3NTc2MjE0NDB8MA&ixlib=rb-4.1.0&q=80&w=800",
    urlFull: "https://images.unsplash.com/photo-1704708819836-9aebd1fb64ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMHJpdmVyJTJDJTIwZmxvd2luZyUyMHdhdGVyfGVufDB8MHx8fDE3NTc2MjE0NDB8MA&ixlib=rb-4.1.0&q=80&w=2400",
    description: "a person standing on rocks in a stream",
    photographer: "Aditya Doliya",
    photographerUrl: "https://unsplash.com/@adityadoliya",
    downloadUrl: "https://unsplash.com/photos/IicyiaPYGGI/download",
    source: "Unsplash",
    theme: "peaceful river, flowing water, righteousness",
    likes: 0,
    color: "#262626"
  },
  8: {
    id: "marc-ignacio-starry",
    url: "https://images.unsplash.com/photo-1561296742-f2392c4dc7b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxzdGFycnklMjBuaWdodCUyMHNreSUyQyUyMGNvc21vcyUyQyUyMG1hamVzdGljJTIwY3JlYXRpb258ZW58MHwwfHx8MTc1NzYyMTc3MXww&ixlib=rb-4.1.0&q=80&w=1080",
    urlSmall: "https://images.unsplash.com/photo-1561296742-f2392c4dc7b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxzdGFycnklMjBuaWdodCUyMHNreSUyQyUyMGNvc21vcyUyQyUyMG1hamVzdGljJTIwY3JlYXRpb258ZW58MHwwfHx8MTc1NzYyMTc3MXww&ixlib=rb-4.1.0&q=80&w=800",
    urlFull: "https://images.unsplash.com/photo-1561296742-f2392c4dc7b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxzdGFycnklMjBuaWdodCUyMHNreSUyQyUyMGNvc21vcyUyQyUyMG1hamVzdGljJTIwY3JlYXRpb258ZW58MHwwfHx8MTc1NzYyMTc3MXww&ixlib=rb-4.1.0&q=80&w=2400",
    description: "silhouette of tree during golden hour",
    photographer: "Marc Ignacio",
    photographerUrl: "https://unsplash.com/@marcignacio",
    downloadUrl: "https://unsplash.com/photos/nz_DfuIhtN0/download",
    source: "Unsplash",
    theme: "starry night sky, cosmos, majestic creation",
    likes: 371,
    color: "#0c2640"
  },
  19: {
    id: "pegah-sunrise",
    url: "https://images.unsplash.com/photo-1638613216316-51917daa0b2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBzdW5yaXNlJTJDJTIwaGVhdmVucyUyMGRlY2xhcmluZyUyMGdsb3J5fGVufDB8MHx8fDE3NTc2MjE3NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    urlSmall: "https://images.unsplash.com/photo-1638613216316-51917daa0b2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBzdW5yaXNlJTJDJTIwaGVhdmVucyUyMGRlY2xhcmluZyUyMGdsb3J5fGVufDB8MHx8fDE3NTc2MjE3NzJ8MA&ixlib=rb-4.1.0&q=80&w=800",
    urlFull: "https://images.unsplash.com/photo-1638613216316-51917daa0b2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBzdW5yaXNlJTJDJTIwaGVhdmVucyUyMGRlY2xhcmluZyUyMGdsb3J5fGVufDB8MHx8fDE3NTc2MjE3NzJ8MA&ixlib=rb-4.1.0&q=80&w=2400",
    description: "the sun is setting over the clouds in the sky",
    photographer: "Pegah Mostafavi Zadeh",
    photographerUrl: "https://unsplash.com/@pegah",
    downloadUrl: "https://unsplash.com/photos/s5r1Rd36rRU/download",
    source: "Unsplash",
    theme: "golden sunrise, heavens declaring glory",
    likes: 5,
    color: "#400c0c"
  },
  23: {
    id: "joseph-shepherd",
    url: "https://images.unsplash.com/photo-1675715240156-345cb296e42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxncmVlbiUyMG1lYWRvdyUyQyUyMHNoZXBoZXJkJTJDJTIwcGVhY2VmdWwlMjBwYXN0dXJlfGVufDB8MHx8fDE3NTc2MjE0NDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    urlSmall: "https://images.unsplash.com/photo-1675715240156-345cb296e42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxncmVlbiUyMG1lYWRvdyUyQyUyMHNoZXBoZXJkJTJDJTIwcGVhY2VmdWwlMjBwYXN0dXJlfGVufDB8MHx8fDE3NTc2MjE0NDB8MA&ixlib=rb-4.1.0&q=80&w=800",
    urlFull: "https://images.unsplash.com/photo-1675715240156-345cb296e42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxncmVlbiUyMG1lYWRvdyUyQyUyMHNoZXBoZXJkJTJDJTIwcGVhY2VmdWwlMjBwYXN0dXJlfGVufDB8MHx8fDE3NTc2MjE0NDB8MA&ixlib=rb-4.1.0&q=80&w=2400",
    description: "sheep in a field in Dorset at sunset",
    photographer: "Joseph Sharp",
    photographerUrl: "https://unsplash.com/@josephsharp",
    downloadUrl: "https://unsplash.com/photos/KaIaQ8KLGx8/download",
    source: "Unsplash",
    theme: "green meadow, shepherd, peaceful pasture",
    likes: 6,
    color: "#405940"
  },
  27: {
    id: "F5kcCJjGBYE",
    url: "https://images.unsplash.com/photo-1722197230024-f5bcb12b70c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBsaWdodCUyQyUyMGxpZ2h0aG91c2UlMkMlMjBzYWx2YXRpb258ZW58MHwwfHx8MTc1NzYyMTc3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    urlSmall: "https://images.unsplash.com/photo-1722197230024-f5bcb12b70c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBsaWdodCUyQyUyMGxpZ2h0aG91c2UlMkMlMjBzYWx2YXRpb258ZW58MHwwfHx8MTc1NzYyMTc3M3ww&ixlib=rb-4.1.0&q=80&w=800",
    urlFull: "https://images.unsplash.com/photo-1722197230024-f5bcb12b70c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBsaWdodCUyQyUyMGxpZ2h0aG91c2UlMkMlMjBzYWx2YXRpb258ZW58MHwwfHx8MTc1NzYyMTc3M3ww&ixlib=rb-4.1.0&q=80&w=2400",
    description: "A lighthouse with a bright light shining on top of it",
    photographer: "Luca Severin",
    photographerUrl: "https://unsplash.com/@lucaseverin",
    downloadUrl: "https://unsplash.com/photos/F5kcCJjGBYE/download",
    source: "Unsplash",
    theme: "bright light, lighthouse, salvation",
    likes: 56,
    color: "#262626"
  },
  46: {
    id: "frantisek-castle",
    url: "https://images.unsplash.com/photo-1609929988122-f7768dbd5f61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGZvcnRyZXNzJTJDJTIwc3Ryb25nJTIwdG93ZXIlMkMlMjByZWZ1Z2V8ZW58MHwwfHx8MTc1NzYyMTc3NXww&ixlib=rb-4.1.0&q=80&w=1080",
    urlSmall: "https://images.unsplash.com/photo-1609929988122-f7768dbd5f61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGZvcnRyZXNzJTJDJTIwc3Ryb25nJTIwdG93ZXIlMkMlMjByZWZ1Z2V8ZW58MHwwfHx8MTc1NzYyMTc3NXww&ixlib=rb-4.1.0&q=80&w=800",
    urlFull: "https://images.unsplash.com/photo-1609929988122-f7768dbd5f61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGZvcnRyZXNzJTJDJTIwc3Ryb25nJTIwdG93ZXIlMkMlMjByZWZ1Z2V8ZW58MHwwfHx8MTc1NzYyMTc3NXww&ixlib=rb-4.1.0&q=80&w=2400",
    description: "Lietava castle near Zilina, Slovakia",
    photographer: "Frantisek Duris",
    photographerUrl: "https://unsplash.com/@frantisekduris",
    downloadUrl: "https://unsplash.com/photos/GakXaqzGad0/download",
    source: "Unsplash",
    theme: "mountain fortress, strong tower, refuge",
    likes: 14,
    color: "#595973"
  },
  51: {
    id: "wolfgang-water",
    url: "https://images.unsplash.com/photo-1629285387821-7b30a90340b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMHdhdGVyJTJDJTIwd2FzaGluZyUyQyUyMHB1cmUlMjBzcHJpbmd8ZW58MHwwfHx8MTc1NzYyMTc3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    urlSmall: "https://images.unsplash.com/photo-1629285387821-7b30a90340b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMHdhdGVyJTJDJTIwd2FzaGluZyUyQyUyMHB1cmUlMjBzcHJpbmd8ZW58MHwwfHx8MTc1NzYyMTc3Nnww&ixlib=rb-4.1.0&q=80&w=800",
    urlFull: "https://images.unsplash.com/photo-1629285387821-7b30a90340b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMHdhdGVyJTJDJTIwd2FzaGluZyUyQyUyMHB1cmUlMjBzcHJpbmc8ZW58MHwwfHx8MTc1NzYyMTc3Nnww&ixlib=rb-4.1.0&q=80&w=2400",
    description: "water splash on body of water",
    photographer: "Wolfgang Hasselmann",
    photographerUrl: "https://unsplash.com/@wolfgang_hasselmann",
    downloadUrl: "https://unsplash.com/photos/YVT5aJVQxgE/download",
    source: "Unsplash",
    theme: "clean water, washing, pure spring, forgiveness",
    likes: 2,
    color: "#737340"
  },
  91: {
    id: "hunter-eagle",
    url: "https://images.unsplash.com/photo-1744790402177-dbbfbccfc6fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxlYWdsZSUyMHNvYXJpbmclMkMlMjBtb3VudGFpbiUyMHJlZnVnZSUyQyUyMHByb3RlY3RpdmUlMjBzaGVsdGVyfGVufDB8MHx8fDE3NTc2MjE0NDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    urlSmall: "https://images.unsplash.com/photo-1744790402177-dbbfbccfc6fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxlYWdsZSUyMHNvYXJpbmclMkMlMjBtb3VudGFpbiUyMHJlZnVnZSUyQyUyMHByb3RlY3RpdmUlMjBzaGVsdGVyfGVufDB8MHx8fDE3NTc2MjE0NDF8MA&ixlib=rb-4.1.0&q=80&w=800",
    urlFull: "https://images.unsplash.com/photo-1744790402177-dbbfbccfc6fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxlYWdsZSUyMHNvYXJpbmclMkMlMjBtb3VudGFpbiUyMHJlZnVnZSUyQyUyMHByb3RlY3RpdmUlMjBzaGVsdGVyfGVufDB8MHx8fDE3NTc2MjE0NDF8MA&ixlib=rb-4.1.0&q=80&w=2400",
    description: "An eagle flies against snow-capped mountains.",
    photographer: "Hunter Masters",
    photographerUrl: "https://unsplash.com/@huntermasters",
    downloadUrl: "https://unsplash.com/photos/SjR2AKGaJP4/download",
    source: "Unsplash",
    theme: "eagle soaring, mountain refuge, protective shelter",
    likes: 1,
    color: "#408cc0"
  },
  100: {
    id: "bernhard-flowers",
    url: "https://images.unsplash.com/photo-1724094819235-58a00705d049?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxqb3lmdWwlMjBjZWxlYnJhdGlvbiUyQyUyMGJyaWdodCUyMGZsb3dlcnMlMkMlMjBwcmFpc2V8ZW58MHwwfHx8MTc1NzYyMTc3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    urlSmall: "https://images.unsplash.com/photo-1724094819235-58a00705d049?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxqb3lmdWwlMjBjZWxlYnJhdGlvbiUyQyUyMGJyaWdodCUyMGZsb3dlcnMlMkMlMjBwcmFpc2V8ZW58MHwwfHx8MTc1NzYyMTc3N3ww&ixlib=rb-4.1.0&q=80&w=800",
    urlFull: "https://images.unsplash.com/photo-1724094819235-58a00705d049?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxqb3lmdWwlMjBjZWxlYnJhdGlvbiUyQyUyMGJyaWdodCUyMGZsb3dlcnMlMkMlMjBwcmFpc2V8ZW58MHwwfHx8MTc1NzYyMTc3N3ww&ixlib=rb-4.1.0&q=80&w=2400",
    description: "A close up of a bouquet of flowers",
    photographer: "Bernhard",
    photographerUrl: "https://unsplash.com/@bernhardson",
    downloadUrl: "https://unsplash.com/photos/5uAWrWKIFMM/download",
    source: "Unsplash",
    theme: "joyful celebration, bright flowers, praise",
    likes: 3,
    color: "#0c260c"
  },
  103: {
    id: "nikolay-biotope",
    url: "https://images.unsplash.com/photo-1536775970054-803e8e0acb6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxibGVzc2luZyUyMG5hdHVyZSUyQyUyMGFidW5kYW50JTIwbGlmZSUyQyUyMGZsb3VyaXNoaW5nfGVufDB8MHx8fDE3NTc2MjE3Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    urlSmall: "https://images.unsplash.com/photo-1536775970054-803e8e0acb6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxibGVzc2luZyUyMG5hdHVyZSUyQyUyMGFidW5kYW50JTIwbGlmZSUyQyUyMGZsb3VyaXNoaW5nfGVufDB8MHx8fDE3NTc2MjE3Nzd8MA&ixlib=rb-4.1.0&q=80&w=800",
    urlFull: "https://images.unsplash.com/photo-1536775970054-803e8e0acb6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxibGVzc2luZyUyMG5hdHVyZSUyQyUyMGFidW5kYW50JTIwbGlmZSUyQyUyMGZsb3VyaXNoaW5nfGVufDB8MHx8fDE3NTc2MjE3Nzd8MA&ixlib=rb-4.1.0&q=80&w=2400",
    description: "Serene nature biotope with abundant life",
    photographer: "Nikolay Vasiliev",
    photographerUrl: "https://unsplash.com/@nikolayv",
    downloadUrl: "https://unsplash.com/photos/kR-zUCCaLa0/download",
    source: "Unsplash",
    theme: "blessing nature, abundant life, flourishing",
    likes: 137,
    color: "#73a60c"
  },
  121: {
    id: "andrew-mountain",
    url: "https://images.unsplash.com/photo-1737050465215-03d623678310?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGhpbGxzJTJDJTIwc3VucmlzZSUyQyUyMGhlbHAlMjBmcm9tJTIwYWJvdmV8ZW58MHwwfHx8MTc1NzYyMTQ0Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    urlSmall: "https://images.unsplash.com/photo-1737050465215-03d623678310?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGhpbGxzJTJDJTIwc3VucmlzZSUyQyUyMGhlbHAlMjBmcm9tJTIwYWJvdmV8ZW58MHwwfHx8MTc1NzYyMTQ0Mnww&ixlib=rb-4.1.0&q=80&w=800",
    urlFull: "https://images.unsplash.com/photo-1737050465215-03d623678310?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGhpbGxzJTJDJTIwc3VucmlzZSUyQyUyMGhlbHAlMjBmcm9tJTIwYWJvdmV8ZW58MHwwfHx8MTc1NzYyMTQ0Mnww&ixlib=rb-4.1.0&q=80&w=2400",
    description: "Sunset in Vermont",
    photographer: "Andrew Kusakin",
    photographerUrl: "https://unsplash.com/@andrewkus",
    downloadUrl: "https://unsplash.com/photos/SJglL6x6bJY/download",
    source: "Unsplash",
    theme: "mountain hills, sunrise, help from above",
    likes: 1,
    color: "#0c2626"
  },
  139: {
    id: "thomas-plant",
    url: "https://images.unsplash.com/photo-1681140692728-f22fa5314fca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxpbnRyaWNhdGUlMjBjcmVhdGlvbiUyQyUyMGRldGFpbGVkJTIwbmF0dXJlJTJDJTIwZmVhcmZ1bGx5JTIwbWFkZXxlbnwwfDB8fHwxNzU3NjIxNzc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    urlSmall: "https://images.unsplash.com/photo-1681140692728-f22fa5314fca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxpbnRyaWNhdGUlMjBjcmVhdGlvbiUyQyUyMGRldGFpbGVkJTIwbmF0dXJlJTJDJTIwZmVhcmZ1bGx5JTIwbWFkZXxlbnwwfDB8fHwxNzU3NjIxNzc4fDA&ixlib=rb-4.1.0&q=80&w=800",
    urlFull: "https://images.unsplash.com/photo-1681140692728-f22fa5314fca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHxpbnRyaWNhdGUlMjBjcmVhdGlvbiUyQyUyMGRldGFpbGVkJTIwbmF0dXJlJTJDJTIwZmVhcmZ1bGx5JTIwbWFkZXxlbnwwfDB8fHwxNzU3NjIxNzc4fDA&ixlib=rb-4.1.0&q=80&w=800",
    description: "a close up of a plant with a blurry background",
    photographer: "Thomas Kinto",
    photographerUrl: "https://unsplash.com/@thomaskinto",
    downloadUrl: "https://unsplash.com/photos/4bJuH6WGvKI/download",
    source: "Unsplash",
    theme: "intricate creation, detailed nature, fearfully made",
    likes: 4,
    color: "#738c40"
  },
  150: {
    id: "dibakar-celebration",
    url: "https://images.unsplash.com/photo-1702205453998-faf8fbbe93f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHx2aWJyYW50JTIwY2VsZWJyYXRpb24lMkMlMjBjb2xvcmZ1bCUyMG5hdHVyZSUyQyUyMGV2ZXJ5dGhpbmclMjBwcmFpc2V8ZW58MHwwfHx8MTc1NzYyMTc3OXww&ixlib=rb-4.1.0&q=80&w=1080",
    urlSmall: "https://images.unsplash.com/photo-1702205453998-faf8fbbe93f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHx2aWJyYW50JTIwY2VsZWJyYXRpb24lMkMlMjBjb2xvcmZ1bCUyMG5hdHVyZSUyQyUyMGV2ZXJ5dGhpbmclMjBwcmFpc2V8ZW58MHwwfHx8MTc1NzYyMTc3OXww&ixlib=rb-4.1.0&q=80&w=800",
    urlFull: "https://images.unsplash.com/photo-1702205453998-faf8fbbe93f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMzMjV8MHwxfHNlYXJjaHwxfHx2aWJyYW50JTIwY2VsZWJyYXRpb24lMkMlMjBjb2xvcmZ1bCUyMG5hdHVyZSUyQyUyMGV2ZXJ5dGhpbmclMjBwcmFpc2V8ZW58MHwwfHx8MTc1NzYyMTc3OXww&ixlib=rb-4.1.0&q=80&w=2400",
    description: "a group of people covered in colored powder",
    photographer: "Dibakar Roy",
    photographerUrl: "https://unsplash.com/@dibakarroy",
    downloadUrl: "https://unsplash.com/photos/zn-WvTSWj-8/download",
    source: "Unsplash",
    theme: "vibrant celebration, colorful nature, everything praise",
    likes: 4,
    color: "#8ca6c0"
  }
};

// Import the existing Picsum images for fallback
import { psalmImages as picsumImages } from './psalmImages';

// Enhanced function that prefers Unsplash, falls back to Picsum
export function getPsalmImage(psalmNumber: number): PsalmImage | undefined {
  // First, check if we have a premium Unsplash image
  const unsplashImage = unsplashImages[psalmNumber];
  if (unsplashImage) {
    return unsplashImage;
  }
  
  // Fall back to Picsum image
  return picsumImages[psalmNumber];
}

// Get all available psalm images (Unsplash + Picsum)
export const allPsalmImages: Record<number, PsalmImage> = {
  ...picsumImages,
  ...unsplashImages // Unsplash images override Picsum for featured psalms
};

// Helper functions
export function getAttributionText(image: PsalmImage): string {
  return `Photo by ${image.photographer} on ${image.source}`;
}

export function getAttributionHTML(image: PsalmImage): string {
  return `Photo by <a href="${image.photographerUrl}" target="_blank" rel="noopener">${image.photographer}</a> on <a href="https://${image.source.toLowerCase()}.com" target="_blank" rel="noopener">${image.source}</a>`;
}

// Check if psalm has premium Unsplash image
export function hasUnsplashImage(psalmNumber: number): boolean {
  return psalmNumber in unsplashImages;
}

// Get list of psalms with Unsplash images
export function getUnsplashPsalms(): number[] {
  return Object.keys(unsplashImages).map(Number).sort((a, b) => a - b);
}

// Get image by theme
export function getImageByTheme(theme: string): PsalmImage | undefined {
  const allImages = Object.values(allPsalmImages);
  return allImages.find(img => 
    img.theme.toLowerCase().includes(theme.toLowerCase())
  );
}
