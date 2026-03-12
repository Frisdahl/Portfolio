import type { Project } from "../../types/project";

export const cryobybreum: Project = {
  id: 2,
  slug: "cryobybreum",
  title: "CryoByBreum",
  description:
    "A digital storefront for CryoByBreum, showcasing specialized cryotherapy services with a clean, medical-grade aesthetic.",
  projectType: "Website",
  thumbnail: "/images/projectImages/CryobyBreum/cryobybreum-thumbnail.webp",
  smallImages: [
    "/images/projectImages/CryobyBreum/cryobybreum-mobile.webp",
    "/images/projectImages/CryobyBreum/cryobybreum-mobile2.webp",
    "/images/projectImages/cryobybreum-horizontal.webp",
    "/images/projectImages/CryobyBreum/cryobybreum-square.webp",
    "/images/projectImages/CryobyBreum/cryobybreum-square2.webp",
  ],
  video: "/projectVideos/CryobyBreum/cryobybreum-trailer.webm",
  videoImages: [
    "/images/projectImages/CryobyBreum/cryobybreum-mobile.webp",
    "/images/projectImages/CryobyBreum/cryobybreum-mobile2.webp",
    "/images/projectImages/CryobyBreum/cryobybreum-square.webp",
  ],
  year: "2023",
  link: "",
  location: "Denmark",
  services: ["UI/UX Design", "Prototyping", "Frontend Development"],
  tags: ["Elementor", "Wordpress", "CSS", "Figma", "Photoshop", "After Effects"],
  workedOn: {
    Design: [
      "Design in Figma",
      "Adjusting images in Photoshop",
      "Editing videos in Adobe After Effects",
    ],
    Frontend: [
      "Responsive UI built with WordPress and Elementor",
      "adding animations with CSS",
    ],
    Backend: ["Setting up contact form  and integrating with email service"],
  },

  tagsByCategory: {
    Frontend: ["Elementor", "Wordpress", "CSS"],
    Design: ["Figma (UI design)", "Photoshop"],
    Video: ["Adobe After Effects"],
  },
};
