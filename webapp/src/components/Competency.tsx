import React from 'react';

interface CompetencyProps {
  label: string;
  description: string;
}

const Competency = ({ label, description }: CompetencyProps) => (
  <div>
    <h2>{label}</h2>
    <p>{description}</p>
  </div>
);

export default Competency;
