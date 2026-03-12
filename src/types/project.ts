export type Project = {
  id: number;
  slug: string;
  title: string;
  description: string;
  projectType: "Mobile Application" | "Website" | "Prototype";
  thumbnail: string;
  video?: string;
  videoImages?: string[];
  smallImages?: string[];
  year: string;
  link: string;
  location?: string;
  services?: string[];
  tags: string[]; // Used for the list in Projects section
  workedOn?: Record<string, string[]>;
  tagsByCategory?: Record<string, string[]>;
};
