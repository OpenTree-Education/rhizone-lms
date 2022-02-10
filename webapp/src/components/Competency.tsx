import { Button } from '@mui/material';
import React, { useContext, useState } from 'react';
import CreateCompetencyForm from './CreateCompetencyForm';
import SessionContext from './SessionContext';

import { EntityId } from '../types/api';

interface CompetencyProps {
  description: string;
  id: EntityId;
  label: string;
  onCompetenciesChanged?: (id: EntityId) => void;
  principal_id: EntityId;
}

const Competency = ({ description, id, label, onCompetenciesChanged, principal_id }: CompetencyProps) => {
  const { principalId } = useContext(SessionContext);
  const [toggleForm, setToggleForm] = useState(false);

  return (
    <div>
      <h2>{label}</h2>
      <p>{description}</p>
      {principal_id === principalId && <Button onClick={() => setToggleForm(true)}>Edit Competency</Button>}
      {toggleForm && <CreateCompetencyForm competencyId={id}
        onCompetenciesChanged={onCompetenciesChanged} defaultLabel={label} defaultDescription={description} />
      }
    </div>
  );
};

export default Competency;
