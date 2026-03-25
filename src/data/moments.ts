import { ImageSourcePropType } from 'react-native';

export interface Moment {
  id: string;
  title: string;
  note: string;
  date: string;
  location: string;
  image: ImageSourcePropType;
}

export const moments: Moment[] = [
  {
    id: "1",
    title: "First Date at the Coffee Shop",
    note: "We talked for hours and lost track of time. It was a perfect afternoon.",
    date: "2024-02-14",
    location: "Downtown Cafe",
    // Make sure to add 'moment1.jpg' inside your 'assets/images' folder
    image: require('../../assets/images/moment1.jpg'),
  },
  {
    id: "2",
    title: "Weekend Getaway",
    note: "Hiking in the mountains and enjoying the beautiful scenery together.",
    date: "2024-05-20",
    location: "Blue Ridge Mountains",
    // Make sure to add 'moment2.jpg' inside your 'assets/images' folder
    image: require('../../assets/images/moment2.jpg'),
  }
];
