// Defines the structure for each word.
export interface WordData {
  text: string;
  size: number; // Represents the frequency or weight of the word
}

// Sample data.
export const wordCloudData: WordData[] = [
  { text: 'Family', size: 100 },
  { text: 'Tree', size: 85 },
  { text: 'Ancestry', size: 70 },
  { text: 'DNA', size: 90 },
  { text: 'History', size: 65 },
  { text: 'Genealogy', size: 80 },
  { text: 'Heritage', size: 60 },
  { text: 'Records', size: 75 },
  { text: 'Search', size: 55 },
  { text: 'Story', size: 50 },
  { text: 'Lineage', size: 45 },
  { text: 'Ancestor', size: 95 },
  { text: 'Descendant', size: 40 },
  { text: 'Birth', size: 35 },
  { text: 'Marriage', size: 30 },
  { text: 'Death', size: 25 },
  { text: 'Chart', size: 20 },
];
