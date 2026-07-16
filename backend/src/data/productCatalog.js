/**
 * Quick-Commerce Product Catalog
 * Simulates a real product database with categories relevant to instant needs
 *
 * NOTE: Product images are NOT defined inline. They are resolved through the
 * centralized, deterministic image mapping in ./productImages.js so that every
 * product always shows a category-correct image (with category fallbacks).
 */

import { resolveProductImage } from './productImages.js';

const productCatalog = [
  // Health & Medicine
  { id: "prod_001", name: "Digital Thermometer", category: "Health", subcategory: "Medical Devices", price: 299, image: "https://images.unsplash.com/photo-1584308666544-e63fe075efb2?w=200", deliveryTime: "10 mins", inStock: true, tags: ["fever", "temperature", "baby", "health", "thermometer"] },
  { id: "prod_002", name: "Paracetamol Syrup (Kids)", category: "Health", subcategory: "Medicine", price: 89, image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200", deliveryTime: "10 mins", inStock: true, tags: ["fever", "pain", "baby", "kids", "medicine", "paracetamol"] },
  { id: "prod_003", name: "ORS Sachets (Pack of 10)", category: "Health", subcategory: "Hydration", price: 45, image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=200", deliveryTime: "10 mins", inStock: true, tags: ["dehydration", "fever", "diarrhea", "ors", "electrolyte", "baby"] },
  { id: "prod_004", name: "Wet Wipes (Pack of 72)", category: "Baby Care", subcategory: "Hygiene", price: 149, image: "https://images.unsplash.com/photo-1584308666544-e63fe075efb2?w=200", deliveryTime: "10 mins", inStock: true, tags: ["baby", "clean", "wipes", "hygiene", "fever"] },
  { id: "prod_005", name: "Band-Aid Strips (Pack of 20)", category: "Health", subcategory: "First Aid", price: 65, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200", deliveryTime: "10 mins", inStock: true, tags: ["wound", "cut", "injury", "bandage", "first-aid"] },
  { id: "prod_006", name: "Antiseptic Liquid (100ml)", category: "Health", subcategory: "First Aid", price: 79, image: "https://images.unsplash.com/photo-1584308666544-e63fe075efb2?w=200", deliveryTime: "10 mins", inStock: true, tags: ["wound", "infection", "antiseptic", "clean", "first-aid"] },
  { id: "prod_007", name: "Cotton Balls (Pack of 50)", category: "Health", subcategory: "First Aid", price: 35, image: "https://images.unsplash.com/photo-1584308666544-e63fe075efb2?w=200", deliveryTime: "10 mins", inStock: true, tags: ["wound", "clean", "cotton", "first-aid"] },

  // Food & Cooking
  { id: "prod_010", name: "Instant Noodles (Pack of 4)", category: "Food", subcategory: "Instant Food", price: 80, image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=200", deliveryTime: "10 mins", inStock: true, tags: ["hungry", "quick", "food", "instant", "noodles", "late-night"] },
  { id: "prod_011", name: "Bread (White, Sliced)", category: "Food", subcategory: "Bakery", price: 45, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200", deliveryTime: "10 mins", inStock: true, tags: ["breakfast", "sandwich", "bread", "morning", "food"] },
  { id: "prod_012", name: "Eggs (Pack of 6)", category: "Food", subcategory: "Dairy & Eggs", price: 55, image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200", deliveryTime: "10 mins", inStock: true, tags: ["breakfast", "eggs", "cooking", "protein", "food"] },
  { id: "prod_013", name: "Butter (200g)", category: "Food", subcategory: "Dairy & Eggs", price: 65, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=200", deliveryTime: "10 mins", inStock: true, tags: ["breakfast", "butter", "bread", "cooking", "food"] },
  { id: "prod_014", name: "Milk (1 Liter)", category: "Food", subcategory: "Dairy & Eggs", price: 68, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200", deliveryTime: "10 mins", inStock: true, tags: ["breakfast", "milk", "cereal", "tea", "coffee", "food"] },
  { id: "prod_014a", name: "Mother Dairy Milk (1 Liter)", category: "Food", subcategory: "Dairy & Eggs", price: 72, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200", deliveryTime: "12 mins", inStock: true, tags: ["breakfast", "milk", "cereal", "tea", "coffee", "food", "dairy"] },
  { id: "prod_015", name: "Pasta (500g)", category: "Food", subcategory: "Staples", price: 99, image: "https://images.unsplash.com/photo-1551462147-37885acc36f1?w=200", deliveryTime: "10 mins", inStock: true, tags: ["dinner", "pasta", "cooking", "food", "italian"] },
  { id: "prod_016", name: "Pasta Sauce (400g)", category: "Food", subcategory: "Sauces", price: 149, image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=200", deliveryTime: "10 mins", inStock: true, tags: ["dinner", "pasta", "sauce", "cooking", "food", "italian"] },
  { id: "prod_017", name: "Rice (1kg Basmati)", category: "Food", subcategory: "Staples", price: 135, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200", deliveryTime: "10 mins", inStock: true, tags: ["dinner", "rice", "cooking", "food", "staple"] },
  { id: "prod_018", name: "Ice Cream Tub (Vanilla)", category: "Dessert", subcategory: "Frozen Treats", price: 149, image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=200", deliveryTime: "45 mins", inStock: true, tags: ["dessert", "ice cream", "party", "celebration", "guests", "sweet"] },
  { id: "prod_019", name: "Chocolate Cake Slice", category: "Dessert", subcategory: "Cakes", price: 129, image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=200", deliveryTime: "15 mins", inStock: true, tags: ["dessert", "cake", "party", "celebration", "guests", "sweet"] },
  { id: "prod_019a", name: "Popcorn Tub", category: "Snacks", subcategory: "Movie Snacks", price: 69, image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=200", deliveryTime: "10 mins", inStock: true, tags: ["movie", "snack", "popcorn", "entertainment"] },
  { id: "prod_019b", name: "Disposable Cups", category: "Party", subcategory: "Serving", price: 29, image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=200", deliveryTime: "10 mins", inStock: true, tags: ["cups", "party", "movie", "serving"] },
  { id: "prod_019c", name: "Tissues Box", category: "Home", subcategory: "Paper Products", price: 39, image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=200", deliveryTime: "10 mins", inStock: true, tags: ["tissues", "guest", "home", "paper"] },

  // Party & Celebration
  { id: "prod_020", name: "Party Cups (Pack of 25)", category: "Party", subcategory: "Supplies", price: 99, image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=200", deliveryTime: "10 mins", inStock: true, tags: ["party", "celebration", "cups", "guests"] },
  { id: "prod_021", name: "Paper Plates (Pack of 20)", category: "Party", subcategory: "Supplies", price: 79, image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=200", deliveryTime: "10 mins", inStock: true, tags: ["party", "celebration", "plates", "guests", "food"] },
  { id: "prod_022", name: "Soft Drinks (6 Pack)", category: "Beverages", subcategory: "Cold Drinks", price: 210, image: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=200", deliveryTime: "10 mins", inStock: true, tags: ["party", "drinks", "cold", "guests", "celebration"] },
  { id: "prod_023", name: "Chips (Large, Assorted)", category: "Snacks", subcategory: "Chips", price: 150, image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200", deliveryTime: "10 mins", inStock: true, tags: ["party", "snacks", "chips", "guests", "munchies"] },
  { id: "prod_023a", name: "Dog Treats", category: "Pet Care", subcategory: "Treats", price: 129, image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200", deliveryTime: "10 mins", inStock: true, tags: ["pet", "dog", "treats", "reward"] },
  { id: "prod_023b", name: "Chew Sticks", category: "Pet Care", subcategory: "Treats", price: 159, image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200", deliveryTime: "10 mins", inStock: true, tags: ["pet", "dog", "chew", "snack"] },
  { id: "prod_023c", name: "Pet Bowl", category: "Pet Care", subcategory: "Feeding", price: 119, image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200", deliveryTime: "10 mins", inStock: true, tags: ["pet", "dog", "bowl", "feeding"] },
  { id: "prod_023d", name: "Dental Chews", category: "Pet Care", subcategory: "Treats", price: 189, image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200", deliveryTime: "10 mins", inStock: true, tags: ["pet", "dog", "dental", "chew"] },
  { id: "prod_024", name: "Birthday Candles (Pack of 12)", category: "Party", subcategory: "Decorations", price: 49, image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=200", deliveryTime: "10 mins", inStock: true, tags: ["birthday", "candles", "cake", "celebration", "party"] },
  { id: "prod_025", name: "Balloons (Pack of 25)", category: "Party", subcategory: "Decorations", price: 79, image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=200", deliveryTime: "10 mins", inStock: true, tags: ["birthday", "party", "decoration", "celebration", "balloons"] },

  // Cleaning & Emergency
  { id: "prod_030", name: "Floor Cleaner (500ml)", category: "Cleaning", subcategory: "Floor Care", price: 115, image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=200", deliveryTime: "10 mins", inStock: true, tags: ["spill", "clean", "floor", "mess", "cleaning"] },
  { id: "prod_031", name: "Paper Towels (2 Rolls)", category: "Cleaning", subcategory: "Paper Products", price: 89, image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=200", deliveryTime: "10 mins", inStock: true, tags: ["spill", "clean", "wipe", "mess", "paper", "towel"] },
  { id: "prod_031a", name: "Disposable Plates", category: "Party", subcategory: "Serving", price: 49, image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=200", deliveryTime: "10 mins", inStock: true, tags: ["party", "plates", "serving", "guest"] },
  { id: "prod_032", name: "Garbage Bags (Pack of 10)", category: "Cleaning", subcategory: "Waste Management", price: 59, image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=200", deliveryTime: "10 mins", inStock: true, tags: ["clean", "garbage", "waste", "bags", "cleaning"] },
  { id: "prod_033", name: "Mop with Bucket", category: "Cleaning", subcategory: "Floor Care", price: 399, image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=200", deliveryTime: "15 mins", inStock: true, tags: ["spill", "clean", "floor", "mop", "cleaning"] },

  // Personal Care & Emergency
  { id: "prod_040", name: "Toothbrush + Toothpaste Combo", category: "Personal Care", subcategory: "Oral Care", price: 99, image: "https://images.unsplash.com/photo-1559650656-5d1d361ad10e?w=200", deliveryTime: "10 mins", inStock: true, tags: ["guest", "overnight", "travel", "oral", "hygiene"] },
  { id: "prod_041", name: "Towel (Bath Size)", category: "Personal Care", subcategory: "Bath", price: 299, image: "https://images.unsplash.com/photo-1583845112203-29329902332e?w=200", deliveryTime: "10 mins", inStock: true, tags: ["guest", "bath", "towel", "overnight"] },
  { id: "prod_042", name: "Shampoo Sachet (Pack of 5)", category: "Personal Care", subcategory: "Hair Care", price: 25, image: "https://images.unsplash.com/photo-1559650656-5d1d361ad10e?w=200", deliveryTime: "10 mins", inStock: true, tags: ["guest", "hair", "shampoo", "bath", "overnight"] },
  { id: "prod_043", name: "Soap Bar (Pack of 3)", category: "Personal Care", subcategory: "Bath", price: 75, image: "https://images.unsplash.com/photo-1559650656-5d1d361ad10e?w=200", deliveryTime: "10 mins", inStock: true, tags: ["guest", "bath", "soap", "clean", "hygiene"] },

  // Power & Emergency
  { id: "prod_050", name: "Power Bank (10000mAh)", category: "Electronics", subcategory: "Charging", price: 799, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200", deliveryTime: "10 mins", inStock: true, tags: ["phone", "battery", "charge", "power", "emergency"] },
  { id: "prod_051", name: "USB-C Charging Cable", category: "Electronics", subcategory: "Cables", price: 199, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200", deliveryTime: "10 mins", inStock: true, tags: ["phone", "charge", "cable", "usb", "emergency"] },
  { id: "prod_052", name: "Candles (Pack of 6)", category: "Home", subcategory: "Emergency", price: 49, image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=200", deliveryTime: "10 mins", inStock: true, tags: ["power-cut", "light", "candle", "emergency", "blackout"] },
  { id: "prod_053", name: "LED Flashlight", category: "Electronics", subcategory: "Lighting", price: 249, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200", deliveryTime: "10 mins", inStock: true, tags: ["power-cut", "light", "flashlight", "emergency", "blackout"] },
  { id: "prod_054", name: "AA Batteries (Pack of 4)", category: "Electronics", subcategory: "Batteries", price: 99, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200", deliveryTime: "10 mins", inStock: true, tags: ["battery", "power", "emergency", "flashlight", "remote"] },
  { id: "prod_054a", name: "Power Bank (Fast Charge)", category: "Electronics", subcategory: "Charging", price: 999, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200", deliveryTime: "10 mins", inStock: true, tags: ["power", "charge", "battery", "emergency"] },

  // Rain & Weather
  { id: "prod_060", name: "Umbrella (Compact)", category: "Accessories", subcategory: "Rain Gear", price: 299, image: "https://images.unsplash.com/photo-1534397860164-120c97f4db0b?w=200", deliveryTime: "10 mins", inStock: true, tags: ["rain", "wet", "umbrella", "weather", "outdoor"] },
  { id: "prod_061", name: "Raincoat (Disposable)", category: "Accessories", subcategory: "Rain Gear", price: 49, image: "https://images.unsplash.com/photo-1534397860164-120c97f4db0b?w=200", deliveryTime: "10 mins", inStock: true, tags: ["rain", "wet", "raincoat", "weather", "outdoor"] },

  // Study & Work
  { id: "prod_070", name: "Notebook (200 Pages)", category: "Stationery", subcategory: "Writing", price: 89, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200", deliveryTime: "10 mins", inStock: true, tags: ["study", "exam", "notes", "writing", "school"] },
  { id: "prod_071", name: "Pen Set (Blue, Black, Red)", category: "Stationery", subcategory: "Writing", price: 45, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200", deliveryTime: "10 mins", inStock: true, tags: ["study", "exam", "writing", "pen", "school"] },
  { id: "prod_072", name: "Highlighter Set (5 Colors)", category: "Stationery", subcategory: "Writing", price: 99, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200", deliveryTime: "10 mins", inStock: true, tags: ["study", "exam", "highlight", "school", "notes"] },
  { id: "prod_073", name: "Sticky Notes (Pack of 3)", category: "Stationery", subcategory: "Organization", price: 69, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200", deliveryTime: "10 mins", inStock: true, tags: ["study", "exam", "notes", "reminder", "organization"] },
  { id: "prod_074", name: "Coffee (Instant, 50g)", category: "Beverages", subcategory: "Hot Drinks", price: 125, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200", deliveryTime: "10 mins", inStock: true, tags: ["study", "awake", "coffee", "energy", "late-night", "work"] },
  { id: "prod_075", name: "Energy Drink (250ml)", category: "Beverages", subcategory: "Energy", price: 99, image: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=200", deliveryTime: "10 mins", inStock: true, tags: ["energy", "awake", "study", "work", "late-night"] },
  { id: "prod_075a", name: "Protein Bar (Pack of 4)", category: "Beverages", subcategory: "Recovery", price: 179, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200", deliveryTime: "10 mins", inStock: true, tags: ["protein", "recovery", "workout", "gym"] },

  // Pet Care
  { id: "prod_080", name: "Dog Food (1kg Premium)", category: "Pet Care", subcategory: "Food", price: 349, image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200", deliveryTime: "10 mins", inStock: true, tags: ["pet", "dog", "food", "hungry", "animal"] },
  { id: "prod_081", name: "Cat Food (500g)", category: "Pet Care", subcategory: "Food", price: 249, image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200", deliveryTime: "10 mins", inStock: true, tags: ["pet", "cat", "food", "hungry", "animal"] },
  { id: "prod_082", name: "Pet Poop Bags (Roll of 20)", category: "Pet Care", subcategory: "Hygiene", price: 49, image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200", deliveryTime: "10 mins", inStock: true, tags: ["pet", "dog", "walk", "clean", "poop"] },

  // Gifting — curated gift-oriented products
  { id: "prod_g01", name: "Premium Chocolate Box", category: "Gifting", subcategory: "Chocolates", price: 399, image: "", deliveryTime: "15 mins", inStock: true, giftable: true, tags: ["gift", "chocolate", "premium", "celebration", "sweet", "friend", "partner", "family"] },
  { id: "prod_g02", name: "Luxury Chocolate Collection", category: "Gifting", subcategory: "Chocolates", price: 699, image: "", deliveryTime: "15 mins", inStock: true, giftable: true, tags: ["gift", "chocolate", "luxury", "premium", "celebration", "partner", "anniversary"] },
  { id: "prod_g03", name: "Coffee Gift Pack", category: "Gifting", subcategory: "Beverages", price: 349, image: "", deliveryTime: "10 mins", inStock: true, giftable: true, tags: ["gift", "coffee", "premium", "colleague", "friend", "thank-you"] },
  { id: "prod_g04", name: "Premium Tea Collection", category: "Gifting", subcategory: "Beverages", price: 449, image: "", deliveryTime: "10 mins", inStock: true, giftable: true, tags: ["gift", "tea", "premium", "family", "colleague", "thank-you"] },
  { id: "prod_g05", name: "Greeting Card", category: "Gifting", subcategory: "Cards", price: 49, image: "", deliveryTime: "10 mins", inStock: true, giftable: true, tags: ["gift", "card", "greeting", "birthday", "anniversary", "celebration", "friend", "family", "colleague", "partner"] },
  { id: "prod_g06", name: "Scented Candle (Lavender)", category: "Gifting", subcategory: "Decor", price: 299, image: "", deliveryTime: "15 mins", inStock: true, giftable: true, tags: ["gift", "candle", "scented", "decor", "partner", "anniversary", "relaxation"] },
  { id: "prod_g07", name: "Mini Indoor Plant", category: "Gifting", subcategory: "Plants", price: 249, image: "", deliveryTime: "20 mins", inStock: true, giftable: true, tags: ["gift", "plant", "green", "decor", "friend", "colleague", "housewarming"] },
  { id: "prod_g08", name: "Decorative Ceramic Mug", category: "Gifting", subcategory: "Drinkware", price: 199, image: "", deliveryTime: "10 mins", inStock: true, giftable: true, tags: ["gift", "mug", "ceramic", "coffee", "tea", "friend", "colleague"] },
  { id: "prod_g09", name: "Photo Frame (Wooden)", category: "Gifting", subcategory: "Decor", price: 349, image: "", deliveryTime: "15 mins", inStock: true, giftable: true, tags: ["gift", "photo", "frame", "decor", "partner", "family", "anniversary"] },
  { id: "prod_g10", name: "Desk Organizer Set", category: "Gifting", subcategory: "Office", price: 399, image: "", deliveryTime: "15 mins", inStock: true, giftable: true, tags: ["gift", "desk", "organizer", "office", "colleague", "professional"] },
  { id: "prod_g11", name: "Premium Notebook Set", category: "Gifting", subcategory: "Stationery", price: 299, image: "", deliveryTime: "10 mins", inStock: true, giftable: true, tags: ["gift", "notebook", "premium", "stationery", "colleague", "professional", "friend"] },
  { id: "prod_g12", name: "Premium Pen Set (Gift Box)", category: "Gifting", subcategory: "Stationery", price: 449, image: "", deliveryTime: "10 mins", inStock: true, giftable: true, tags: ["gift", "pen", "premium", "professional", "colleague", "boss"] },
  { id: "prod_g13", name: "Gift Basket (Assorted Treats)", category: "Gifting", subcategory: "Hamper", price: 599, image: "", deliveryTime: "20 mins", inStock: true, giftable: true, tags: ["gift", "basket", "hamper", "assorted", "treats", "friend", "family", "celebration"] },
  { id: "prod_g14", name: "Keychain (Designer)", category: "Gifting", subcategory: "Accessories", price: 149, image: "", deliveryTime: "10 mins", inStock: true, giftable: true, tags: ["gift", "keychain", "accessory", "friend", "colleague", "small"] },
  { id: "prod_g15", name: "Soft Toy (Teddy Bear)", category: "Gifting", subcategory: "Toys", price: 349, image: "", deliveryTime: "15 mins", inStock: true, giftable: true, tags: ["gift", "soft-toy", "teddy", "partner", "friend", "birthday", "celebration"] },
  { id: "prod_g16", name: "Scented Soap Set", category: "Gifting", subcategory: "Personal Care", price: 199, image: "", deliveryTime: "10 mins", inStock: true, giftable: true, tags: ["gift", "soap", "scented", "personal-care", "friend", "family"] },
  { id: "prod_g17", name: "Dry Fruits Box (250g)", category: "Gifting", subcategory: "Food", price: 499, image: "", deliveryTime: "15 mins", inStock: true, giftable: true, tags: ["gift", "dry-fruits", "premium", "healthy", "family", "festival", "diwali"] },
  { id: "prod_g18", name: "Aromatic Diffuser Set", category: "Gifting", subcategory: "Decor", price: 549, image: "", deliveryTime: "20 mins", inStock: true, giftable: true, tags: ["gift", "diffuser", "aromatic", "decor", "partner", "housewarming", "relaxation"] }
];

// Apply the centralized, deterministic image mapping. Every product's image is
// derived from its metadata (id + category) so the same product always renders
// the same, category-correct image — with graceful category fallbacks.
const productCatalogWithImages = productCatalog.map((product) => ({
  ...product,
  image: resolveProductImage(product)
}));

export default productCatalogWithImages;
