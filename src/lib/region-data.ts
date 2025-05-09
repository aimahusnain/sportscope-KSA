export interface RegionData {
  id: string
  name: string
  color: string
  description: string
  capital: string
  population?: number
  center?: [number, number] // [latitude, longitude]
}

export const regions: RegionData[] = [
  {
    id: "riyadh",
    name: "Riyadh",
    color: "#7BC043", // Bright green
    description:
      "Riyadh Region is the most populous region of Saudi Arabia and includes the capital city, Riyadh. It is located in the center of the country.",
    capital: "Riyadh",
    population: 8216284,
    center: [24.7136, 46.6753],
  },
  {
    id: "makkah",
    name: "Makkah",
    color: "#FFC107", // Light orange/amber
    description:
      "Makkah Region contains the holy city of Mecca and the important port city of Jeddah. It is located in the western part of Saudi Arabia along the Red Sea coast.",
    capital: "Mecca",
    population: 8557766,
    center: [21.4267, 39.8261],
  },
  {
    id: "madinah",
    name: "Madinah",
    color: "#AED581", // Light green
    description:
      "Madinah Region contains the second holiest city in Islam, Medina. It is located in the western part of Saudi Arabia, north of the Makkah Region.",
    capital: "Medina",
    population: 2132679,
    center: [24.5247, 39.5692],
  },
  {
    id: "eastern",
    name: "Eastern",
    color: "#FFF59D", // Very light yellow
    description:
      "The Eastern Province is the largest region by area and contains most of Saudi Arabia's oil production. It borders the Persian Gulf and is home to cities like Dammam and Dhahran.",
    capital: "Dammam",
    population: 4900325,
    center: [26.4207, 50.0888],
  },
  {
    id: "asir",
    name: "Asir",
    color: "#C5E1A5", // Light green
    description:
      "Asir Region is known for its mountains and mild climate, making it a popular tourist destination. It is located in the southwest of Saudi Arabia.",
    capital: "Abha",
    population: 2211875,
    center: [18.2164, 42.5053],
  },
  {
    id: "tabuk",
    name: "Tabuk",
    color: "#FFCC80", // Light orange
    description:
      "Tabuk Region is in the northwest of Saudi Arabia, bordering Jordan. It is known for its historical sites and beautiful landscapes.",
    capital: "Tabuk",
    population: 910030,
    center: [28.3998, 36.5715],
  },
  {
    id: "hail",
    name: "Hail",
    color: "#FFF59D", // Light yellow
    description:
      "Ha'il Region is located in the northern part of Saudi Arabia and is known for its agricultural production. It has a rich cultural heritage.",
    capital: "Ha'il",
    population: 699774,
    center: [27.5114, 41.7208],
  },
  {
    id: "qassim",
    name: "Qassim",
    color: "#FFF9C4", // Very light yellow
    description:
      "Qassim Region is known for its agricultural production, particularly dates. It is located in the center of Saudi Arabia, north of Riyadh.",
    capital: "Buraydah",
    population: 1423935,
    center: [26.3292, 43.7668],
  },
  {
    id: "jizan",
    name: "Jizan",
    color: "#E1BEE7", // Light purple
    description:
      "Jizan Region is in the southwest corner of Saudi Arabia, bordering Yemen. It has a tropical climate and is known for its agriculture.",
    capital: "Jizan",
    population: 1567547,
    center: [16.8892, 42.5611],
  },
  {
    id: "najran",
    name: "Najran",
    color: "#F8BBD0", // Light pink
    description:
      "Najran Region is in the south of Saudi Arabia, bordering Yemen. It has a rich cultural heritage and is known for its distinctive architecture.",
    capital: "Najran",
    population: 582243,
    center: [17.4924, 44.1277],
  },
  {
    id: "bahah",
    name: "Baha",
    color: "#C5E1A5", // Light green
    description:
      "Al Bahah Region is known for its forests and mountains. It is located in the southwest of Saudi Arabia between Makkah and Asir regions.",
    capital: "Al Bahah",
    population: 476172,
    center: [20.0129, 41.4677],
  },
  {
    id: "jawf",
    name: "Jouf",
    color: "#F48FB1", // Pink
    description:
      "Al Jawf Region is in the north of Saudi Arabia, bordering Jordan and Iraq. It is known for its agricultural development and historical sites.",
    capital: "Sakaka",
    population: 508475,
    center: [29.8826, 40.1002],
  },
  {
    id: "northern",
    name: "Northern Borders",
    color: "#EF9A9A", // Light red
    description:
      "The Northern Borders Region is the northernmost region of Saudi Arabia, bordering Iraq and Kuwait. It is strategically important for the country.",
    capital: "Arar",
    population: 365231,
    center: [30.9785, 41.0177],
  },
]
