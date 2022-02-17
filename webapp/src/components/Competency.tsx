import { Button } from '@mui/material';
import React, { useContext, useState } from 'react';

import CreateOrUpdateCompetencyForm from './CreateOrUpdateCompetencyForm';
import { EntityId } from '../types/api';
import SessionContext from './SessionContext';

interface CompetencyProps {
  description: string;
  id: EntityId;
  label: string;
  onCompetencyChanged?: (id: EntityId) => void;
  principalId: EntityId;
}

const Competency = ({
  description,
  id,
  label,
  onCompetencyChanged,
  principalId,
}: CompetencyProps) => {
  const { principalId: sessionPrincipalId } = useContext(SessionContext);
  const [toggleForm, setToggleForm] = useState(false);

  return (
    <div>
      <h2>{label}</h2>
      <p>{description}</p>
      {principalId === sessionPrincipalId && (
        <Button onClick={() => setToggleForm(!toggleForm)}>
          Edit Competency
        </Button>
      )}
      {toggleForm && (
        <CreateOrUpdateCompetencyForm
          competencyId={id}
          onCompetencyChanged={onCompetencyChanged}
          defaultLabel={label}
          defaultDescription={description}
        />
      )}
    </div>
  );
};

export default Competency;
