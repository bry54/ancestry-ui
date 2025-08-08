// Defines the structure for each node (a company).
export interface PatentNode {
  id: string;      // Company name, must be unique
  group: number;   // A group number, can be used for coloring or logic
  logo: string;    // Path to the logo image in the /public directory
}

// Defines the structure for each link (a patent suit).
export interface PatentLink {
  source: string;  // id of the source company
  target: string;  // id of the target company
  value: number;   // Represents the number of suits, used for stroke width
}

export interface PatentData {
  nodes: PatentNode[];
  links: PatentLink[];
}

// Sample data modeled after the original.
// Using available logos from the project's public/media/brand-logos directory.
export const patentSuitsData: PatentData = {
  nodes: [
    { id: 'Apple', group: 1, logo: '/media/brand-logos/apple-black.svg' },
    { id: 'Amazon', group: 1, logo: '/media/brand-logos/amazon.svg' },
    { id: 'Google', group: 1, logo: '/media/brand-logos/chrome.svg' }, // Using Chrome logo
    { id: 'Android', group: 1, logo: '/media/brand-logos/android.svg' },
    { id: 'Microsoft', group: 2, logo: '/media/brand-logos/azure.svg' }, // Using Azure logo
    { id: 'Samsung', group: 2, logo: '/media/brand-logos/bootstrap.svg' }, // Placeholder
    { id: 'Nokia', group: 3, logo: '/media/brand-logos/angular.svg' }, // Placeholder
    { id: 'HTC', group: 3, logo: '/media/brand-logos/atica.svg' }, // Placeholder
  ],
  links: [
    { source: 'Apple', target: 'Samsung', value: 15 },
    { source: 'Apple', target: 'HTC', value: 8 },
    { source: 'Microsoft', target: 'Apple', value: 5 },
    { source: 'Amazon', target: 'Apple', value: 2 },
    { source: 'Google', target: 'Apple', value: 6 },
    { source: 'Nokia', target: 'Apple', value: 12 },
    { source: 'Microsoft', target: 'Google', value: 7 },
    { source: 'Microsoft', target: 'Samsung', value: 9 },
    { source: 'Android', target: 'Microsoft', value: 4 },
  ],
};
