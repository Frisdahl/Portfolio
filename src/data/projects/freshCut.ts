import type { Project } from "../../types/project";

export const freshCut: Project = {
  id: 3,
  slug: "fresh-cut",
  title: "Fresh Cut",
  description:
    "A one page website for a fictional barber shop called Fresh Cut, showcasing their services, team, and booking options with a sleek and modern design.",
  projectType: "Mobile Application",
  thumbnail: "/images/projectImages/freshCut/freshCut-thumbnail.webp",
  video: "/projectVideos/fresh-cut-iphone-trailer.mp4",
  videoImages: [
    "/images/projectImages/freshCut/videoimages/freshCut-img1.webp",
    "/images/projectImages/freshCut/videoimages/freshCut-img2.webp",
    "/images/projectImages/freshCut/videoimages/freshCut-img3.webp",
  ],
  smallImages: [
    "/images/projectImages/freshCut/smallimages/freshCut-img1.webp",
    "/images/projectImages/freshCut/smallimages/freshCut-img2.webp",
  ],
  year: "2024",
  link: "#",
  location: "Denmark",
  services: ["Mobile Development", "UI/UX Design"],
  tags: ["React", "Typescript", "Express", "Gsap"],
  tagsByCategory: {
    "Tech Stack": ["React Native", "TypeScript", "UI/UX", "Prototype"],
  },
};
