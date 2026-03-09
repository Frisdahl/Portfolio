import { nordwear } from "./nordwear";
import { cryobybreum } from "./cryobybreum";
import { bangAndOlufsen } from "./bang-olufsen";
import type { Project } from "../../types/project";

export const projects: Project[] = [
  nordwear,
  cryobybreum,
  bangAndOlufsen,
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((p) => p.slug === slug);
};

export type { Project };
