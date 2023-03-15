import React, { useEffect, useState } from 'react';

import {
  Box,
  Container,
  Stack,
  Tabs,
  Tab,
} from '@mui/material';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import AssessmentIcon from '@mui/icons-material/Assessment';
import UpcomingOutlinedIcon from '@mui/icons-material/UpcomingOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';

import { assessmentListPageExampleData } from '../assets/data';
import { AssessmentSummary } from '../types/api';
import AssessmentsListTable from './AssessmentsListTable';

export enum StatusTab {
  All,
  Active,
  Past,
  Upcoming,
}

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const AssessmentsListPage = () => {
  const [currentStatusTab, setCurrentStatusTab] = useState(StatusTab.Active);
  const [assessmentList, setAssessmentList] = useState<AssessmentSummary[]>([]);

  useEffect(() => {
    setAssessmentList(assessmentListPageExampleData);
  }, []);

  const handleChangeTab = (
    event: React.SyntheticEvent,
    newCurrentStatusTab: number
  ) => {
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

      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs value={currentStatusTab} onChange={handleChangeTab}>
          <Tab
            icon={
              <StyledBadge color="primary">
                <AssessmentIcon />
              </StyledBadge>
            }
            iconPosition="start"
            label="All"
          />
          <Tab
            icon={
              <StyledBadge
                badgeContent={
                  assessmentList.filter(
                    x =>
                      x.submissions_summary.assessment_submission_state ===
                      'Active'
                  ).length
                }
                color="primary"
              >
                <ScheduleOutlinedIcon />
              </StyledBadge>
            }
            iconPosition="start"
            label="Active"
          />
          <Tab
            icon={
              <StyledBadge color="primary">
                <ArchiveOutlinedIcon />
              </StyledBadge>
            }
            iconPosition="start"
            label="Past"
          />
          <Tab
            icon={
              <StyledBadge color="primary">
                <UpcomingOutlinedIcon />
              </StyledBadge>
            }
            iconPosition="start"
            label="Upcoming"
          />
        </Tabs>
      </Box>
      <AssessmentsListTable currentStatusTab={currentStatusTab} matchingAssessmentList={assessmentList} />
    </Container>
  );
};

export default AssessmentsListPage;
