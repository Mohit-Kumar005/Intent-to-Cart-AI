/**
 * Mock datasets for cart optimization.
 * These are intentionally separate from the product catalog so a real
 * inventory or delivery API can replace them later without changing the
 * optimization algorithm.
 */

export const mockInventory = {
  prod_014: { inStock: false, stockCount: 0 },
  prod_022: { inStock: true, stockCount: 18 },
  prod_023: { inStock: true, stockCount: 12 },
  prod_074: { inStock: true, stockCount: 9 },
  prod_050: { inStock: true, stockCount: 3 },
  prod_081: { inStock: false, stockCount: 0 }
};

export const mockDeliveryProfiles = {
  prod_010: 10,
  prod_011: 10,
  prod_012: 10,
  prod_013: 10,
  prod_014: 45,
  prod_015: 12,
  prod_016: 15,
  prod_017: 12,
  prod_018: 45,
  prod_019: 15,
  prod_020: 10,
  prod_021: 10,
  prod_022: 10,
  prod_023: 10,
  prod_024: 10,
  prod_025: 10,
  prod_030: 10,
  prod_031: 10,
  prod_032: 10,
  prod_033: 20,
  prod_040: 10,
  prod_041: 10,
  prod_042: 10,
  prod_043: 10,
  prod_050: 25,
  prod_051: 10,
  prod_052: 10,
  prod_053: 10,
  prod_054: 10,
  prod_060: 10,
  prod_061: 10,
  prod_070: 10,
  prod_071: 10,
  prod_072: 10,
  prod_073: 10,
  prod_074: 10,
  prod_075: 10,
  prod_080: 10,
  prod_081: 20,
  prod_082: 10
};

export const replacementIntentGroups = [
  {
    keywords: ['milk', 'dairy', 'tea', 'coffee'],
    alternates: ['prod_013', 'prod_012', 'prod_011', 'prod_074', 'prod_014a']
  },
  {
    keywords: ['ice cream', 'dessert', 'sweet', 'cake'],
    alternates: ['prod_019', 'prod_024', 'prod_025', 'prod_023', 'prod_022']
  },
  {
    keywords: ['food', 'meal', 'hungry', 'breakfast', 'snack'],
    alternates: ['prod_010', 'prod_011', 'prod_012', 'prod_023', 'prod_074']
  },
  {
    keywords: ['guest', 'party', 'celebration'],
    alternates: ['prod_020', 'prod_021', 'prod_022', 'prod_023', 'prod_024', 'prod_025']
  },
  {
    keywords: ['study', 'work', 'exam', 'deadline'],
    alternates: ['prod_070', 'prod_071', 'prod_072', 'prod_073', 'prod_074', 'prod_075']
  }
];

export default { mockInventory, mockDeliveryProfiles, replacementIntentGroups };