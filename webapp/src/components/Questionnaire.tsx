import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';

import { EntityId, Questionnaire as APIQuestionnaire } from '../types/api';

interface QuestionnaireProps {
  onChange?: (selectedOptionIds: Map<EntityId, EntityId>) => void;
  questionnaireId: EntityId;
  selectedOptionIds: Map<EntityId, EntityId>;
}

const Questionnaire = ({
  onChange,
  questionnaireId,
  selectedOptionIds,
}: QuestionnaireProps) => {
  const [questionnaire, setQuestionnaire] = useState<APIQuestionnaire | null>(
    null
  );
  const [isLoadingQuestionnaire, setIsLoadingQuestionnaire] = useState(false);
  const [loadQuestionnaireError, setLoadQuestionnaireError] = useState(null);
  useEffect(() => {
    if (!questionnaireId) {
      return;
    }
    setIsLoadingQuestionnaire(true);
    fetch(
      `${process.env.REACT_APP_API_ORIGIN}/questionnaires/${questionnaireId}`,
      { credentials: 'include' }
    )
      .then(res => res.json())
      .then(({ data, error }) => {
        setIsLoadingQuestionnaire(false);
        if (error) {
          setLoadQuestionnaireError(error);
        }
        if (data) {
          setQuestionnaire(data);
        }
      })
      .catch(error => {
        setIsLoadingQuestionnaire(false);
        setLoadQuestionnaireError(error);
      });
  }, [questionnaireId]);
  if (loadQuestionnaireError) {
    return <div>There was an error loading the questionnaire.</div>;
  }
  if (isLoadingQuestionnaire) {
    return <div>Loading...</div>;
  }
  if (!questionnaire) {
    return null;
  }
  return (
    <>
      {questionnaire.prompts.map(
        ({
          id: promptId,
          label: promptLabel,
          options,
          query_text: queryText,
        }) => (
          <Fragment key={promptId}>
            <h2>{promptLabel}</h2>
            <FormControl component="fieldset">
              <FormLabel component="legend">{queryText}</FormLabel>
              <RadioGroup
                onChange={event => {
                  if (onChange) {
                    const newSelectedOptionIds = new Map(selectedOptionIds);
                    newSelectedOptionIds.set(
                      promptId,
                      Number(event.target.value)
                    );
                    onChange(newSelectedOptionIds);
                  }
                }}
                row
                sx={{ my: 3 }}
                value={
                  selectedOptionIds.has(promptId)
                    ? selectedOptionIds.get(promptId)
                    : null
                }
              >
                {options.map(({ id: optionId, label: optionLabel }) => (
                  <FormControlLabel
                    key={optionId}
                    control={<Radio />}
                    label={optionLabel}
                    labelPlacement="bottom"
                    value={optionId}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Fragment>
        )
      )}
    </>
  );
};

export default Questionnaire;
