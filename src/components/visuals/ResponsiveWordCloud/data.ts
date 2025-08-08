// Defines the structure for each word.
export interface WordData {
  text: string;
  value: number; // Represents the frequency or weight of the word
}

// Sample data.
export const wordCloudData: WordData[] = [
  { text: 'Family', value: 100 },
  { text: 'Tree', value: 85 },
  { text: 'Ancestry', value: 70 },
  { text: 'DNA', value: 90 },
  { text: 'History', value: 65 },
  { text: 'Genealogy', value: 80 },
  { text: 'Heritage', value: 60 },
  { text: 'Records', value: 75 },
  { text: 'Search', value: 55 },
  { text: 'Story', value: 50 },
  { text: 'Lineage', value: 45 },
  { text: 'Ancestor', value: 95 },
  { text: 'Descendant', value: 40 },
  { text: 'Birth', value: 35 },
  { text: 'Marriage', value: 30 },
  { text: 'Death', value: 25 },
  { text: 'Chart', value: 20 },
];
