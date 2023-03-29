import React, { useEffect, useState } from 'react';

import { Container, Stack } from '@mui/material';

import { AssessmentWithSummary } from '../types/api';
import AssessmentsListTable from './AssessmentsListTable';
import AssessmentsListTabs from './AssessmentsListTabs';
import useApiData from '../helpers/useApiData';

export enum StatusTab {
  All,
  Active,
  Past,
  Upcoming,
}

const AssessmentsListPage = () => {
  const [currentStatusTab, setCurrentStatusTab] = useState(StatusTab.Active);
  const [assessmentsListSubset, setAssessmentListSubset] = useState<
    AssessmentWithSummary[]
  >([]);

  // We have to retrieve the data from the backend
  const {
    data: assessmentsList,
    error,
    isLoading,
  } = useApiData<AssessmentWithSummary[]>({
    deps: [],
    path: '/assessments',
    sendCredentials: true,
  });

  useEffect(() => {
    if (!assessmentsList) return;
    if (currentStatusTab === 0)
      // All Assessments
      setAssessmentListSubset(assessmentsList);
    else if (currentStatusTab === 2)
      // Past Assessments
      setAssessmentListSubset(
        assessmentsList.filter(
          assessment =>
            assessment.participant_submissions_summary.highest_state ===
              'Graded' ||
            assessment.participant_submissions_summary.highest_state ===
              'Submitted' ||
            assessment.participant_submissions_summary.highest_state ===
              'Expired'
        )
      );
    else
      setAssessmentListSubset(
        assessmentsList.filter(
          assessment =>
            assessment.participant_submissions_summary.highest_state ===
            StatusTab[currentStatusTab]
        )
      );
  }, [currentStatusTab, assessmentsList]);

  const handleChangeTab = (
    event: React.SyntheticEvent,
    newCurrentStatusTab: number
  ) => {
    event.preventDefault();
    setCurrentStatusTab(newCurrentStatusTab);
  };

  // We have to deal with the state where the API request is still loading
  if (isLoading) {
    return <></>;
  }

  // We have to deal with the state where an error occurs
  if (error) {
    return (
      <Container fixed>
        <p>There was an error loading the assessments list.</p>
      </Container>
    );
  }

  // We have to deal with the state where no data is returned
  if (!assessmentsList) {
    return <></>;
  }

  if (assessmentsList.length === 0) {
    return (
      <Container>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <h1>Assessments</h1>
        </Stack>

        <div style={{ padding: '20px' }}>
          You have no available assessments at this time.
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <h1>Assessments</h1>
      </Stack>

      <AssessmentsListTabs
        assessmentList={assessmentsList}
        currentStatusTab={currentStatusTab}
        handleChangeTab={handleChangeTab}
      />
      <AssessmentsListTable
        currentStatusTab={currentStatusTab}
        matchingAssessmentList={assessmentsListSubset}
      />
    </Container>
  );
};

export default AssessmentsListPage;
