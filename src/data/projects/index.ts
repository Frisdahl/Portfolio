import { nordwear } from "./nordwear";
import { cryobybreum } from "./cryobybreum";
import { freshCut } from "./freshCut";
import type { Project } from "../../types/project";

export const projects: Project[] = [nordwear, freshCut, cryobybreum];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((p) => p.slug === slug);
};

export type { Project };
