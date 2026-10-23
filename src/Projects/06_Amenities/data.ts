export interface AmenityItem {
  id: string;
  name: string;
  category: string;
}

export interface AmenityCategory {
  id: string;
  name: string;
  items: AmenityItem[];
}

export interface AmenitiesFormData {
  selectedAmenities: string[];
  status: 'Active' | 'Inactive';
}

export const AMENITY_CATEGORIES: AmenityCategory[] = [
  {
    id: 'clubhouse',
    name: 'Clubhouse & Community',
    items: [
      { id: 'clubhouse_main', name: 'Clubhouse', category: 'Clubhouse & Community' },
      { id: 'reception_lounge', name: 'Reception Lounge', category: 'Clubhouse & Community' },
      { id: 'business_lounge', name: 'Business Lounge', category: 'Clubhouse & Community' },
      { id: 'multipurpose_hall', name: 'Multipurpose Hall', category: 'Clubhouse & Community' },
      { id: 'guest_rooms', name: 'Guest Rooms', category: 'Clubhouse & Community' },
      { id: 'indoor_games', name: 'Indoor Games', category: 'Clubhouse & Community' },
      { id: 'library', name: 'Library', category: 'Clubhouse & Community' },
      { id: 'banquet_hall', name: 'Banquet Hall', category: 'Clubhouse & Community' },
      { id: 'coworking_space', name: 'Co-working Space', category: 'Clubhouse & Community' },
    ],
  },
  {
    id: 'water',
    name: 'Water Amenities',
    items: [
      { id: 'kids_pool', name: 'Kids Pool', category: 'Water Amenities' },
      { id: 'swimming_pool', name: 'Swimming Pool', category: 'Water Amenities' },
      { id: 'jacuzzi', name: 'Jacuzzi', category: 'Water Amenities' },
    ],
  },
  {
    id: 'sports',
    name: 'Sports',
    items: [
      { id: 'cricket_nets', name: 'Cricket Practice Nets', category: 'Sports' },
      { id: 'basketball_court', name: 'Basketball Court', category: 'Sports' },
      { id: 'football_ground', name: 'Football Ground', category: 'Sports' },
      { id: 'squash_court', name: 'Squash Court', category: 'Sports' },
      { id: 'skating_rink', name: 'Skating Rink', category: 'Sports' },
      { id: 'badminton_court', name: 'Badminton Court', category: 'Sports' },
      { id: 'volleyball_court', name: 'Volleyball Court', category: 'Sports' },
      { id: 'pickleball_court', name: 'Pickleball Court', category: 'Sports' },
      { id: 'table_tennis', name: 'Table Tennis', category: 'Sports' },
      { id: 'tennis_court', name: 'Tennis Court', category: 'Sports' },
      { id: 'billiards_snooker', name: 'Billiards / Snooker', category: 'Sports' },
    ],
  },
  {
    id: 'fitness',
    name: 'Fitness & Wellness',
    items: [
      { id: 'yoga_deck', name: 'Yoga Deck', category: 'Fitness & Wellness' },
      { id: 'sauna', name: 'Sauna', category: 'Fitness & Wellness' },
      { id: 'cycling_track', name: 'Cycling Track', category: 'Fitness & Wellness' },
      { id: 'steam_room', name: 'Steam Room', category: 'Fitness & Wellness' },
      { id: 'outdoor_gym', name: 'Outdoor Gym', category: 'Fitness & Wellness' },
      { id: 'gymnasium', name: 'Gymnasium', category: 'Fitness & Wellness' },
      { id: 'yoga_room', name: 'Yoga Room', category: 'Fitness & Wellness' },
      { id: 'meditation_room', name: 'Meditation Room', category: 'Fitness & Wellness' },
      { id: 'spa', name: 'Spa', category: 'Fitness & Wellness' },
      { id: 'walking_track', name: 'Walking Track', category: 'Fitness & Wellness' },
    ],
  },
  {
    id: 'children',
    name: 'Children',
    items: [
      { id: 'children_play_area', name: "Children's Play Area", category: 'Children' },
      { id: 'sand_pit', name: 'Sand Pit', category: 'Children' },
      { id: 'creche', name: 'Creche', category: 'Children' },
      { id: 'indoor_play_area', name: 'Indoor Play Area', category: 'Children' },
      { id: 'adventure_play_area', name: 'Adventure Play Area', category: 'Children' },
    ],
  },
  {
    id: 'senior_citizens',
    name: 'Senior Citizens',
    items: [
      { id: 'senior_citizen_seating', name: 'Senior Citizen Seating', category: 'Senior Citizens' },
      { id: 'reflexology_path', name: 'Reflexology Path', category: 'Senior Citizens' },
    ],
  },
  {
    id: 'landscape',
    name: 'Landscape & Nature',
    items: [
      { id: 'gazebo', name: 'Gazebo', category: 'Landscape & Nature' },
      { id: 'water_feature', name: 'Water Feature', category: 'Landscape & Nature' },
      { id: 'landscaped_garden', name: 'Landscaped Garden', category: 'Landscape & Nature' },
    ],
  },
  {
    id: 'others',
    name: 'Others',
    items: [
      { id: 'observation_deck', name: 'Observation Deck', category: 'Others' },
      { id: 'sky_lounge', name: 'Sky Lounge', category: 'Others' },
      { id: 'pet_park', name: 'Pet Park', category: 'Others' },
      { id: 'pet_wash_area', name: 'Pet Wash Area', category: 'Others' },
      { id: 'butterfly_garden', name: 'Butterfly Garden', category: 'Others' },
      { id: 'parcel_locker', name: 'Parcel Locker', category: 'Others' },
      { id: 'community_farming', name: 'Community Farming', category: 'Others' },
    ],
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    items: [
      { id: 'mini_theatre', name: 'Mini Theatre', category: 'Entertainment' },
      { id: 'party_lawn', name: 'Party Lawn', category: 'Entertainment' },
      { id: 'amphitheatre', name: 'Amphitheatre', category: 'Entertainment' },
      { id: 'bbq_area', name: 'BBQ Area', category: 'Entertainment' },
    ],
  },
  {
    id: 'convenience',
    name: 'Convenience',
    items: [
      { id: 'convenience_store', name: 'Convenience Store', category: 'Convenience' },
      { id: 'laundry', name: 'Laundry', category: 'Convenience' },
      { id: 'salon', name: 'Salon', category: 'Convenience' },
      { id: 'car_wash', name: 'Car Wash', category: 'Convenience' },
      { id: 'atm', name: 'ATM', category: 'Convenience' },
    ],
  },
];

export const INITIAL_AMENITIES_DATA: AmenitiesFormData = {
  selectedAmenities: [
    'clubhouse_main',
    'swimming_pool',
    'gymnasium',
    'children_play_area',
    'landscaped_garden',
  ],
  status: 'Active',
};

export const sectionInfo = {
  id: '06',
  name: 'Amenities',
  slug: '06_amenities',
};

export const initialAmenitiesData = {
  id: '06',
  name: 'Amenities',
  description: 'Clubhouse, sports facilities, security systems, parks, and leisure zones',
};

export type AmenitiesData = AmenitiesFormData;
