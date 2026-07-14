// Spark Homes — Default Repair Price List
// 75+ line items across 7 room types and 19 repair groups
// Unit types: each, sqft, lnft (linear ft), unit, lot, hr

window.DEFAULT_PRICE_LIST = {
  // Room type definitions: which groups belong to each room type
  roomTypes: {
    'Interior / General': {
      groups: ['Flooring', 'Paint & Wall Repair', 'Doors', 'Pest Control'],
      allowMultiple: false,
    },
    'Kitchen': {
      groups: ['Cabinets', 'Countertops & Tile', 'Appliances'],
      allowMultiple: false,
    },
    'Bathroom': {
      groups: ['Vanity & Countertop', 'Tub & Shower', 'Tile'],
      allowMultiple: true,
    },
    'Systems & Structure': {
      groups: ['HVAC', 'Electrical', 'Structural', 'Insulation & Drywall'],
      allowMultiple: false,
    },
    'Exterior': {
      groups: ['Fence', 'Siding', 'Windows', 'Garage', 'Trees'],
      allowMultiple: false,
    },
    'Bedroom': {
      groups: ['Flooring', 'Paint', 'Doors', 'Closet'],
      allowMultiple: true,
    },
    'Living / Common Areas': {
      groups: ['Flooring', 'Paint', 'Doors', 'Lighting'],
      allowMultiple: true,
    },
  },

  // All line items organized by group name
  // Items with the same group name appear in every room type that lists that group
  items: {
    // ── FLOORING ──
    'Flooring': [
      { name: 'Carpet removal', unit: 'sqft', unitCost: 1.25 },
      { name: 'Carpet install', unit: 'sqft', unitCost: 3.50 },
      { name: 'Hardwood refinish', unit: 'sqft', unitCost: 4.00 },
      { name: 'Hardwood install', unit: 'sqft', unitCost: 8.00 },
      { name: 'Vinyl plank (LVP) install', unit: 'sqft', unitCost: 5.50 },
      { name: 'Tile floor install', unit: 'sqft', unitCost: 12.00 },
      { name: 'Tile removal', unit: 'sqft', unitCost: 3.00 },
      { name: 'Subfloor repair', unit: 'sqft', unitCost: 6.00 },
    ],

    // ── PAINT & WALL REPAIR ──
    'Paint & Wall Repair': [
      { name: 'Interior paint (per room)', unit: 'each', unitCost: 350.00 },
      { name: 'Ceiling paint', unit: 'sqft', unitCost: 2.00 },
      { name: 'Drywall patch (small)', unit: 'each', unitCost: 75.00 },
      { name: 'Drywall patch (large)', unit: 'each', unitCost: 250.00 },
      { name: 'Texture match & spray', unit: 'sqft', unitCost: 2.50 },
      { name: 'Wallpaper removal', unit: 'sqft', unitCost: 2.00 },
      { name: 'Trim paint / touch-up', unit: 'lnft', unitCost: 2.00 },
    ],

    // ── PAINT (bedroom/living simplified) ──
    'Paint': [
      { name: 'Wall paint', unit: 'each', unitCost: 350.00 },
      { name: 'Ceiling paint', unit: 'each', unitCost: 150.00 },
      { name: 'Trim paint', unit: 'lnft', unitCost: 2.00 },
      { name: 'Drywall patch', unit: 'each', unitCost: 75.00 },
    ],

    // ── DOORS ──
    'Doors': [
      { name: 'Interior door replacement', unit: 'each', unitCost: 225.00 },
      { name: 'Exterior door replacement', unit: 'each', unitCost: 600.00 },
      { name: 'Door hardware (knob/lever)', unit: 'each', unitCost: 35.00 },
      { name: 'Sliding glass door', unit: 'each', unitCost: 900.00 },
    ],

    // ── PEST CONTROL ──
    'Pest Control': [
      { name: 'General pest treatment', unit: 'lot', unitCost: 350.00 },
      { name: 'Termite treatment', unit: 'lot', unitCost: 1200.00 },
      { name: 'Rodent remediation', unit: 'lot', unitCost: 500.00 },
    ],

    // ── CABINETS ──
    'Cabinets': [
      { name: 'Cabinet reface', unit: 'lnft', unitCost: 150.00 },
      { name: 'Cabinet replace (stock)', unit: 'lnft', unitCost: 250.00 },
      { name: 'Cabinet replace (semi-custom)', unit: 'lnft', unitCost: 400.00 },
      { name: 'Cabinet hardware', unit: 'each', unitCost: 8.00 },
      { name: 'Cabinet paint / refinish', unit: 'lot', unitCost: 1800.00 },
    ],

    // ── COUNTERTOPS & TILE ──
    'Countertops & Tile': [
      { name: 'Laminate countertop', unit: 'lnft', unitCost: 45.00 },
      { name: 'Granite countertop', unit: 'sqft', unitCost: 65.00 },
      { name: 'Quartz countertop', unit: 'sqft', unitCost: 80.00 },
      { name: 'Backsplash tile', unit: 'sqft', unitCost: 18.00 },
    ],

    // ── APPLIANCES ──
    'Appliances': [
      { name: 'Refrigerator', unit: 'each', unitCost: 800.00 },
      { name: 'Range / oven', unit: 'each', unitCost: 650.00 },
      { name: 'Dishwasher', unit: 'each', unitCost: 450.00 },
      { name: 'Microwave (OTR)', unit: 'each', unitCost: 300.00 },
      { name: 'Garbage disposal', unit: 'each', unitCost: 200.00 },
    ],

    // ── VANITY & COUNTERTOP (bathroom) ──
    'Vanity & Countertop': [
      { name: 'Vanity replacement (single)', unit: 'each', unitCost: 450.00 },
      { name: 'Vanity replacement (double)', unit: 'each', unitCost: 700.00 },
      { name: 'Vanity top / countertop', unit: 'each', unitCost: 250.00 },
      { name: 'Faucet replacement', unit: 'each', unitCost: 175.00 },
      { name: 'Mirror replacement', unit: 'each', unitCost: 120.00 },
      { name: 'Toilet replacement', unit: 'each', unitCost: 275.00 },
    ],

    // ── TUB & SHOWER ──
    'Tub & Shower': [
      { name: 'Tub refinish', unit: 'each', unitCost: 400.00 },
      { name: 'Tub replacement', unit: 'each', unitCost: 1200.00 },
      { name: 'Shower valve / trim', unit: 'each', unitCost: 350.00 },
      { name: 'Shower door (glass)', unit: 'each', unitCost: 600.00 },
      { name: 'Tub surround install', unit: 'each', unitCost: 800.00 },
    ],

    // ── TILE (bathroom) ──
    'Tile': [
      { name: 'Floor tile install', unit: 'sqft', unitCost: 14.00 },
      { name: 'Shower tile install', unit: 'sqft', unitCost: 18.00 },
      { name: 'Tile removal', unit: 'sqft', unitCost: 4.00 },
      { name: 'Re-grout / caulk', unit: 'lnft', unitCost: 3.00 },
    ],

    // ── HVAC ──
    'HVAC': [
      { name: 'Furnace replacement', unit: 'each', unitCost: 4500.00 },
      { name: 'A/C condenser replacement', unit: 'each', unitCost: 3500.00 },
      { name: 'Ductwork repair', unit: 'lot', unitCost: 800.00 },
      { name: 'Thermostat replacement', unit: 'each', unitCost: 150.00 },
      { name: 'Water heater replacement', unit: 'each', unitCost: 1200.00 },
    ],

    // ── ELECTRICAL ──
    'Electrical': [
      { name: 'Panel upgrade (200A)', unit: 'each', unitCost: 2500.00 },
      { name: 'Outlet / switch replacement', unit: 'each', unitCost: 25.00 },
      { name: 'Light fixture install', unit: 'each', unitCost: 150.00 },
      { name: 'GFCI outlet install', unit: 'each', unitCost: 45.00 },
      { name: 'Full rewire', unit: 'lot', unitCost: 8000.00 },
      { name: 'Smoke / CO detector', unit: 'each', unitCost: 35.00 },
    ],

    // ── STRUCTURAL ──
    'Structural': [
      { name: 'Foundation crack repair', unit: 'lnft', unitCost: 250.00 },
      { name: 'Pier / underpinning', unit: 'each', unitCost: 1500.00 },
      { name: 'Joist sister / repair', unit: 'each', unitCost: 200.00 },
      { name: 'Load-bearing wall modification', unit: 'each', unitCost: 3500.00 },
    ],

    // ── INSULATION & DRYWALL ──
    'Insulation & Drywall': [
      { name: 'Blown-in attic insulation', unit: 'sqft', unitCost: 1.75 },
      { name: 'Batt insulation (walls)', unit: 'sqft', unitCost: 1.50 },
      { name: 'Drywall hang & finish', unit: 'sqft', unitCost: 3.50 },
      { name: 'Drywall demolition', unit: 'sqft', unitCost: 1.50 },
    ],

    // ── FENCE ──
    'Fence': [
      { name: 'Wood fence (6 ft privacy)', unit: 'lnft', unitCost: 30.00 },
      { name: 'Fence repair (section)', unit: 'each', unitCost: 200.00 },
      { name: 'Gate replacement', unit: 'each', unitCost: 250.00 },
    ],

    // ── SIDING ──
    'Siding': [
      { name: 'Vinyl siding repair', unit: 'sqft', unitCost: 6.00 },
      { name: 'Vinyl siding (full)', unit: 'sqft', unitCost: 8.00 },
      { name: 'Wood siding repair', unit: 'sqft', unitCost: 10.00 },
      { name: 'Fascia / soffit repair', unit: 'lnft', unitCost: 12.00 },
      { name: 'Exterior paint', unit: 'sqft', unitCost: 3.00 },
    ],

    // ── WINDOWS ──
    'Windows': [
      { name: 'Window replacement (standard)', unit: 'each', unitCost: 450.00 },
      { name: 'Window replacement (large/bay)', unit: 'each', unitCost: 900.00 },
      { name: 'Window screen', unit: 'each', unitCost: 40.00 },
      { name: 'Window trim / casing', unit: 'each', unitCost: 75.00 },
    ],

    // ── GARAGE ──
    'Garage': [
      { name: 'Garage door replacement', unit: 'each', unitCost: 1200.00 },
      { name: 'Garage door opener', unit: 'each', unitCost: 350.00 },
      { name: 'Garage floor epoxy', unit: 'sqft', unitCost: 6.00 },
    ],

    // ── TREES ──
    'Trees': [
      { name: 'Tree removal (small)', unit: 'each', unitCost: 400.00 },
      { name: 'Tree removal (large)', unit: 'each', unitCost: 1500.00 },
      { name: 'Tree trimming', unit: 'each', unitCost: 250.00 },
      { name: 'Stump grinding', unit: 'each', unitCost: 200.00 },
    ],

    // ── CLOSET (bedroom) ──
    'Closet': [
      { name: 'Closet shelving / organizer', unit: 'each', unitCost: 200.00 },
      { name: 'Closet door replacement', unit: 'each', unitCost: 175.00 },
      { name: 'Closet rod & shelf', unit: 'each', unitCost: 50.00 },
    ],

    // ── LIGHTING (living/common) ──
    'Lighting': [
      { name: 'Ceiling fan install', unit: 'each', unitCost: 250.00 },
      { name: 'Recessed light (can)', unit: 'each', unitCost: 175.00 },
      { name: 'Light fixture replacement', unit: 'each', unitCost: 120.00 },
      { name: 'Dimmer switch', unit: 'each', unitCost: 45.00 },
    ],
  },
};

// Helper: create a fresh project state from the default price list
window.createNewProject = function(address) {
  var pl = window.DEFAULT_PRICE_LIST;
  var rooms = [];
  // Seed one of each non-multiple room type
  Object.keys(pl.roomTypes).forEach(function(type) {
    var def = pl.roomTypes[type];
    if (!def.allowMultiple) {
      rooms.push(window.createRoomInstance(type, 1));
    }
  });
  // Seed 1 bathroom, 1 bedroom, 1 living area
  rooms.push(window.createRoomInstance('Bathroom', 1));
  rooms.push(window.createRoomInstance('Bedroom', 1));
  rooms.push(window.createRoomInstance('Living / Common Areas', 1));

  return {
    id: 'p_' + Date.now(),
    address: address || '',
    sqft: '',
    yearBuilt: '',
    rooms: rooms,
    photos: [],
    globalPriceOverrides: {}, // group:itemName → unitCost
    createdAt: Date.now(),
  };
};

window.createRoomInstance = function(type, instanceNum) {
  var pl = window.DEFAULT_PRICE_LIST;
  var def = pl.roomTypes[type];
  if (!def) return null;
  var groups = {};
  def.groups.forEach(function(groupName) {
    var defaultItems = (pl.items[groupName] || []).map(function(item) {
      return {
        id: 'li_' + Math.random().toString(36).slice(2, 10),
        name: item.name,
        unit: item.unit,
        unitCost: item.unitCost,
        qty: 0,
        overrideCost: null, // per-project override
      };
    });
    groups[groupName] = {
      noActionNeeded: false,
      items: defaultItems,
    };
  });
  return {
    id: 'rm_' + Math.random().toString(36).slice(2, 10),
    type: type,
    instanceNum: instanceNum,
    label: def.allowMultiple ? type + ' ' + instanceNum : type,
    groups: groups,
  };
};

window.UNIT_LABELS = { each: 'ea', sqft: 'sq ft', lnft: 'ln ft', unit: 'unit', lot: 'lot', hr: 'hr' };
