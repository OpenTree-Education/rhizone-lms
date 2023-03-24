import React from 'react';

import { Box, Tabs, Tab } from '@mui/material';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import AssessmentIcon from '@mui/icons-material/Assessment';
import UpcomingOutlinedIcon from '@mui/icons-material/UpcomingOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';

import { AssessmentWithSummary } from '../types/api';
import { StatusTab } from './AssessmentsListPage';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

interface AssessmentsListTabsProps {
  assessmentList: AssessmentWithSummary[];
  currentStatusTab: StatusTab;
  handleChangeTab: (
    event: React.SyntheticEvent,
    newCurrentStatusTab: number
  ) => void;
}

const AssessmentsListTabs = ({
  assessmentList,
  currentStatusTab,
  handleChangeTab,
}: AssessmentsListTabsProps) => {
  return (
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
                    x.participant_submissions_summary
                      .assessment_submission_state === 'Active'
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
  );
};

export default AssessmentsListTabs;
