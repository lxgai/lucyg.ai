export type Trip = {
  id: string;
  place: string;
  sub: string;
  date: string;
  duration: string;
  cover: string;
  stamp: string;
};

export const TRIPS: Trip[] = [
  {
    id: "china-24",
    place: "China",
    sub: "Chongqing · Hangzhou · Wulong",
    date: "07 / 2024",
    duration: "14 days",
    cover: "/images/travels/china-24/west-lake.jpg",
    stamp: "CN",
  },
  {
    id: "japan-24",
    place: "Japan",
    sub: "Tokyo · Kyoto · Osaka",
    date: "07 / 2024",
    duration: "10 days",
    cover: "/images/travels/japan-24/akihabara.jpg",
    stamp: "JP",
  },
  {
    id: "netherlands-25",
    place: "Netherlands",
    sub: "Amsterdam · Utrecht",
    date: "03 / 2025",
    duration: "7 days",
    cover: "/images/travels/netherlands-25/canal-cruise.jpg",
    stamp: "NL",
  },
];
