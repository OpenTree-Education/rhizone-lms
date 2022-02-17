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
  const [isFormShown, setIsFormShown] = useState(false);

  return (
    <div>
      <h2>{label}</h2>
      <p>{description}</p>
      {principalId === sessionPrincipalId && (
        <Button onClick={() => setIsFormShown(!isFormShown)}>
          Edit Competency
        </Button>
      )}
      {isFormShown && (
        <CreateOrUpdateCompetencyForm
          competencyId={id}
          onCompetencyChanged={id => {
            if (onCompetencyChanged) {
              onCompetencyChanged(id);
            }
            setIsFormShown(false);
          }}
          defaultLabel={label}
          defaultDescription={description}
        />
      )}
    </div>
  );
};

export default Competency;
