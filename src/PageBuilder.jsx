
import React from 'react';
import content from './content.json';
import HeroSection from './components/HeroSection';
import FeaturesGrid from './components/FeaturesGrid';

const componentsMap = {
  HeroSection,
  FeaturesGrid
};

const PageBuilder = () => (
  <main>
    {content.sections.map((section, idx) => {
      const SectionComponent = componentsMap[section.type];
      return SectionComponent ? <SectionComponent key={idx} {...section.props} /> : null;
    })}
  </main>
);

export default PageBuilder;
