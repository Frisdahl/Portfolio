
import React from 'react';

const projects = [
  {
    id: 1,
    title: 'Project One',
    description: 'A brief description of Project One, highlighting its key features and technologies used.',
    image: 'https://via.placeholder.com/400x300/0000FF/FFFFFF?text=Project+1', // Placeholder image
    link: '#',
  },
  {
    id: 2,
    title: 'Project Two',
    description: 'A brief description of Project Two, highlighting its key features and technologies used.',
    image: 'https://via.placeholder.com/400x300/FF0000/FFFFFF?text=Project+2', // Placeholder image
    link: '#',
  },
  {
    id: 3,
    title: 'Project Three',
    description: 'A brief description of Project Three, highlighting its key features and technologies used.',
    image: 'https://via.placeholder.com/400x300/00FF00/FFFFFF?text=Project+3', // Placeholder image
    link: '#',
  },
  {
    id: 4,
    title: 'Project Four',
    description: 'A brief description of Project Four, highlighting its key features and technologies used.',
    image: 'https://via.placeholder.com/400x300/FFFF00/000000?text=Project+4', // Placeholder image
    link: '#',
  },
];

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-16 bg-gray-100 text-gray-800">
      <div className="px-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">My Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out"
            >
              <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                {project.title} Placeholder
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <a
                  href={project.link}
                  className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out"
                >
                  View Project
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
