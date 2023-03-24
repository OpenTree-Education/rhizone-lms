import React, { useEffect, useState } from 'react';

import { Container, Stack } from '@mui/material';

import { assessmentListPageExampleData } from '../assets/data';
import { AssessmentWithSummary } from '../types/api';
import AssessmentsListTable from './AssessmentsListTable';
import AssessmentsListTabs from './AssessmentsListTabs';

export enum StatusTab {
  All,
  Active,
  Past,
  Upcoming,
}

const AssessmentsListPage = () => {
  const [currentStatusTab, setCurrentStatusTab] = useState(StatusTab.Active);
  const [assessmentList, setAssessmentList] = useState<AssessmentWithSummary[]>(
    []
  );
  const [assessmentListSubset, setAssessmentListSubset] = useState<
    AssessmentWithSummary[]
  >([]);

  useEffect(() => {
    setAssessmentList(assessmentListPageExampleData);
  }, []);

  useEffect(() => {
    if (currentStatusTab === 0)
      // All Assessments
      setAssessmentListSubset(assessmentList);
    else if (currentStatusTab === 2)
      // Past Assessments
      setAssessmentListSubset(
        assessmentList.filter(
          assessment =>
            assessment.participant_submissions_summary
              .assessment_submission_state === 'Graded' ||
            assessment.participant_submissions_summary
              .assessment_submission_state === 'Submitted' ||
            assessment.participant_submissions_summary
              .assessment_submission_state === 'Expired'
        )
      );
    else
      setAssessmentListSubset(
        assessmentList.filter(
          assessment =>
            assessment.participant_submissions_summary
              .assessment_submission_state === StatusTab[currentStatusTab]
        )
      );
  }, [currentStatusTab, assessmentList]);

  const handleChangeTab = (
    event: React.SyntheticEvent,
    newCurrentStatusTab: number
  ) => {
    event.preventDefault();
    setCurrentStatusTab(newCurrentStatusTab);
  };

  if (assessmentList.length === 0) {
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
        assessmentList={assessmentList}
        currentStatusTab={currentStatusTab}
        handleChangeTab={handleChangeTab}
      />
      <AssessmentsListTable
        currentStatusTab={currentStatusTab}
        matchingAssessmentList={assessmentListSubset}
      />
    </Container>
  );
};

export default AssessmentsListPage;
