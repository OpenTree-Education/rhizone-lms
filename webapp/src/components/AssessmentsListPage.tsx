import React, { useEffect, useState } from 'react';

import { Container, Stack } from '@mui/material';

import { assessmentListPageExampleData } from '../assets/data';
import { AssessmentSummary } from '../types/api';
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
  const [assessmentList, setAssessmentList] = useState<AssessmentSummary[]>([]);

  useEffect(() => {
    setAssessmentList(assessmentListPageExampleData);
  }, []);

  useEffect(() => {
    // TODO: new row filtering logic should go here.
  }, [currentStatusTab]);

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
        matchingAssessmentList={assessmentList}
      />
    </Container>
  );
};

export default AssessmentsListPage;
