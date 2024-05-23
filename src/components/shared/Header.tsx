import React from "react";

interface HeaderProps {
  heading: string;
}

const Header: React.FC<HeaderProps> = ({ heading }) => {
  return (
    <div className="mb-10">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {heading}
      </h2>
      <h4 className="mt-2 text-center text-xl font-bold text-gray-600">
        Networth Game
      </h4>
    </div>
  );
};

export default Header;
