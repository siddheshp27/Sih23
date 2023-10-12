import React from "react";
import { useRef } from "react";
import { DisplaySection } from "./DisplaySection";
import { Jumbotron } from "./Jumbotron";
import { SoundSection } from "./SoundSection";
import WebgiViewer from "./WebgiViewer";
import Categories from "./Categories";

const Home = () => {
  const webgiViewerRef = useRef();
  const contentRef = useRef();

  const handlePreview = () => {
    webgiViewerRef.current.triggerPreview();
  };

  return (
    <div className="App">
      <div ref={contentRef} id="content">
        <Jumbotron />
        <SoundSection />
        <DisplaySection triggerPreview={handlePreview} />
        <Categories />
      </div>
      <WebgiViewer contentRef={contentRef} ref={webgiViewerRef} />
    </div>
  );
};

export default Home;
