import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material';
import React, { Fragment } from 'react';

import { EntityId, Questionnaire as APIQuestionnaire } from '../types/api';
import useApiData from '../helpers/useApiData';

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
  const {
    data: questionnaire,
    error,
    isLoading,
  } = useApiData<APIQuestionnaire>({
    deps: [questionnaireId],
    path: `/questionnaires/${questionnaireId}`,
    sendCredentials: true,
    shouldFetch: () => !!questionnaireId,
  });
  if (error) {
    return <div>There was an error loading the questionnaire.</div>;
  }
  if (isLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: '40em' }}
      >
        <CircularProgress size={100} disableShrink />
      </Stack>
    );
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
