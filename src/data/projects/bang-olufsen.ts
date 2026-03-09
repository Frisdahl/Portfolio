import type { Project } from "../../types/project";

export const bangAndOlufsen: Project = {
  id: 3,
  slug: "bang-olufsen",
  title: "Bang & Olufsen",
  description:
    "A mobile application concept for Bang & Olufsen, focusing on premium audio control and seamless hardware integration.",
  projectType: "Mobile Application",
  image: "/images/Bang&Olufsen.webp",
  video: "/projectVideos/bang-olufsen-iphone-trailer.mp4",
  smallImages: [
    "/images/projectImages/NordWear/Nordwear-mobile.webp",
    "/images/projectImages/NordWear/Nordwear-mobile2.webp",
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
