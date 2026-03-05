import React from "react";

interface ProjectTagProps {
  label: string;
  type: string;
}

const projectTag = ({ label, type }: ProjectTagProps) => {
  return (
    <div className="border-b-[1px] border-b flex w-full justify-between items-center py-2 uppercase text-md font-medium">
      <p className="text-gray-500">{label}</p>
      <p>{type}</p>
    </div>
  );
};

export default projectTag;
