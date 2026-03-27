import { ImageSourcePropType } from 'react-native';

export interface Moment {
  id: string;
  title: string;
  note: string;
  date: string;
  /** Human-readable place name shown in cards/callouts */
  location: string;
  image: ImageSourcePropType;
  /** Decimal latitude — required for map pin to appear */
  lat?: number;
  /** Decimal longitude — required for map pin to appear */
  lng?: number;
}

export const moments: Moment[] = [
  {
    id: "1",
    title: "First Date at the Coffee Shop",
    note: "We talked for hours and lost track of time. It was a perfect afternoon.",
    date: "2024-02-14",
    location: "Downtown Cafe",
    image: require('../../assets/images/moment1.jpg'),
    // Downtown area coordinates — swap for any real café latlng
    lat: 40.7128,
    lng: -74.0060,
  },
  {
    id: "2",
    title: "Weekend Getaway",
    note: "Hiking in the mountains and enjoying the beautiful scenery together.",
    date: "2024-05-20",
    location: "Blue Ridge Mountains",
    image: require('../../assets/images/moment2.jpg'),
    // Blue Ridge Parkway approximate center
    lat: 36.1069,
    lng: -82.1163,
  },
];
