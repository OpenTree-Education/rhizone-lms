import React, { useEffect, useState } from 'react';

import { Container, Stack, CircularProgress } from '@mui/material';

import { AssessmentWithSummary } from '../types/api';
import AssessmentsListTable from './AssessmentsListTable';
import AssessmentsListTabs from './AssessmentsListTabs';
import useApiData from '../helpers/useApiData';
import { DateTime } from 'luxon';

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
  const [userRoles, setUserRoles] = useState({
    isFacilitator: false,
    isParticipant: false,
    isMixedRole: false,
    isNeither: false,
  });

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

    // Determine if user is a facilitator, participant, both, or neither:
    const isFacilitator =
      assessmentsList.filter(
        assessment => assessment.principal_program_role === 'Facilitator'
      ).length > 0;
    const isParticipant =
      assessmentsList.filter(
        assessment => assessment.principal_program_role === 'Participant'
      ).length > 0;
    const isMixedRole = isFacilitator && isParticipant;
    const isNeither = !isFacilitator && !isParticipant;

    setUserRoles({ isFacilitator, isParticipant, isMixedRole, isNeither });

    switch (currentStatusTab) {
      case 1:
        // Active Assessments
        setAssessmentListSubset(
          assessmentsList.filter(
            assessment =>
              DateTime.now() <
                DateTime.fromISO(assessment.program_assessment.due_date) &&
              DateTime.now() >=
                DateTime.fromISO(assessment.program_assessment.available_after)
          )
        );
        break;
      case 2:
        // Past Assessments
        setAssessmentListSubset(
          assessmentsList.filter(
            assessment =>
              DateTime.now() >
              DateTime.fromISO(assessment.program_assessment.due_date)
          )
        );
        break;
      case 3:
        // Upcoming Assessments
        setAssessmentListSubset(
          assessmentsList.filter(
            assessment =>
              DateTime.now() <
              DateTime.fromISO(assessment.program_assessment.available_after)
          )
        );
        break;
      default:
        // All Assessments
        setAssessmentListSubset(assessmentsList);
        break;
    }
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

  // We have to deal with the state where no data is returned
  if (error) {
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
          There was an error loading the assessments list.
        </div>
      </Container>
    );
  }

  if (!assessmentsList || assessmentsList.length === 0) {
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
        userRoles={userRoles}
      />
    </Container>
  );
};

export default AssessmentsListPage;
