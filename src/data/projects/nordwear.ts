import type { Project } from "../../types/project";

export const nordwear: Project = {
  id: 1,
  slug: "nordwear",
  title: "Nordwear",
  description:
    "NordWear is a modern e-commerce platform inspired by Scandinavian minimalism, focused on performance, clean design, and seamless shopping.",
  projectType: "Website",
  thumbnail: "/images/projectImages/NordWear/NordWear-img-opt.webp",
  video: "/projectVideos/NordWear/NordWear-trailer.webm",
  videoImages: [
    "/images/projectImages/NordWear/videoimages/nordwear-img1.webp",
    "/images/projectImages/NordWear/videoimages/nordwear-img2.webp",
    "/images/projectImages/NordWear/videoimages/nordwear-img3.webp",
  ],
  smallImages: [
    "/images/projectImages/NordWear/Nordwear-mobile.webp",
    "/images/projectImages/NordWear/Nordwear-mobile2.webp",
    "/images/projectImages/NordWear/Nordwear-category.webp",
    "/images/projectImages/NordWear/Nordwear-cart.webp",
    "/images/projectImages/NordWear/Nordwear-production.webp",
  ],
  year: "2025",
  link: "https://nordwear-shop.dk/",
  location: "Denmark",
  services: [
    "Frontend",
    "backend",
    "Security",
    "Image Ai Generation",
    "UI/UX Design",
    "Performance Optimization",
  ],
  tags: ["React", "Typescript", "Next.js", "Gsap"],
  workedOn: {
    Frontend: [
      "Responsive UI built with React and TypeScript",
      "Product listings and filtering",
      "Shopping cart and checkout interface",
      "Animations with GSAP",
    ],
    Backend: [
      "REST API built with Node.js and Express",
      "Authentication and session handling",
      "Stripe payment integration",
      "Admin panel with CRUD functionality",
    ],
    Database: [
      "Relational database design in MySQL",
      "Data modeling with Prisma ORM",
      "Products, users and orders schema",
    ],
  },
  tagsByCategory: {
    Frontend: ["React", "TypeScript", "Taildwind CSS", "Vite", "GSAP", "Axios"],
    Backend: ["Node.js", "Express"],
    Database: ["MySQL", "Prisma ORM"],
    "DevOps / Deployment": [
      "Docker",
      "DigitalOcean",
      "Cloudinary",
      "GitHub",
      "Github actions",
      "Postman",
      "Git",
    ],
    "Payment & Services": ["Stripe", "Shipmondo", "Resend"],
    Design: ["Figma (UI design)"],
  },
};
