import type { Project } from "../../types/project";

export const freshCut: Project = {
  id: 3,
  slug: "fresh-cut",
  title: "Fresh Cut",
  description:
    "A one page website for a fictional barber shop called Fresh Cut, showcasing their services, team, and booking options with a sleek and modern design.",
  descriptionSecondary:
    "The website features a clean and modern design with smooth animations, responsive layout, and an intuitive user interface to provide an engaging experience for visitors.",
  projectType: "Website",
  thumbnail: "/images/projectImages/freshCut/freshCut-thumbnail.webp",
  video: "/projectVideos/fresh-cut-iphone-trailer.mp4",
  videoImages: [
    "/images/projectImages/freshCut/videoimages/freshCut-img1.webp",
    "/images/projectImages/freshCut/videoimages/freshCut-img2.webp",
    "/images/projectImages/freshCut/videoimages/freshCut-img3.webp",
  ],
  smallImages: [
    "/images/projectImages/freshCut/freshCut-mobile1.webp",
    "/images/projectImages/freshCut/freshCut-mobile2.webp",
    "/images/projectImages/freshCut/freshCut-horizontal.webp",
    "/images/projectImages/freshCut/freshCut-smallimg1.webp",
    "/images/projectImages/freshCut/freshCut-smallimg2.webp",
  ],
  year: "2026",
  link: "#",
  location: "Denmark",
  services: [
    "Responsive Development",
    "UI/UX Design",
    "Animation",
    "Frontend Development",
  ],
  tags: ["React", "Typescript", "Express", "Gsap"],
  workedOnHeading:
    "For Fresh Cut, I focused on frontend development, creating a responsive and visually pleasing experience for users.",
  tagsByCategory: {
    frontend: ["React", "TypeScript", "Tailwind CSS", "Vite", "GSAP"],
    deployment: ["Vercel"],
  },
};
