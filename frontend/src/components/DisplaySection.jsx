import React from "react";

export const DisplaySection = ({ triggerPreview }) => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <div className="display-section wrapper">
      <h2 className="text-4xl new-text">
        Access every document with just one ID
      </h2>
    </div>
  );
};
