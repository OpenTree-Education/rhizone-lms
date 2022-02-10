import React, { useContext } from 'react';
import SessionContext from './SessionContext';


interface CompetencyProps {
  label: string;
  description: string;
  principal_id: number;
}

const Competency = ({ label, description, principal_id }: CompetencyProps) => {
  const { principalId } = useContext(SessionContext);

  return (
    <div>
      <h2>{label}</h2>
      <p>{description}</p>
    </div>
  );
};

export default Competency;
