import React, { useState } from 'react';

import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
  Switch,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import TimerIcon from '@mui/icons-material/Timer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

import { OpenedAssessment } from '../types/api.d';
import { formatDateTime } from '../helpers/dateTime';

interface AssessmentMetadataBarProps {
  assessment: OpenedAssessment;
  endTime: Date;
  secondsRemaining: number | null;
  submissionDisabled: boolean;
}

const formatTimeRemaining = (totalSeconds: number) => {
  const minutesRemaining = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hours = Math.floor(minutesRemaining / 60);
  const minutes = minutesRemaining % 60;
  return (
    (hours > 0 ? hours + 'h ' : '') +
    (minutes > 0 ? minutes + 'm ' : '') +
    seconds +
    's '
  );
};

const AssessmentMetadataBar = ({
  assessment,
  endTime,
  secondsRemaining,
  submissionDisabled,
}: AssessmentMetadataBarProps) => {
  const enabledBgColor = '#1e88e5';
  const disabledBgColor = '#bdbdbd';

  const [showTimer, setShowTimer] = useState(true);

  const handleToggleTimer = () => {
    setShowTimer(!showTimer);
  };

  return (
    <>
      <List
        sx={{
          width: '100%',
          maxWidth: 360,
        }}
      >
        <ListItem>
          <ListItemAvatar>
            <Avatar
              sx={{
                bgcolor: `${
                  submissionDisabled ? disabledBgColor : enabledBgColor
                }`,
              }}
            >
              <InfoIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Typography variant="body2">
              {assessment.curriculum_assessment.description}
            </Typography>
            <ListItemText
              secondary={`Type: ${assessment.curriculum_assessment.assessment_type}`}
            />
          </ListItemText>
        </ListItem>
        <Divider variant="middle" />
        <ListItem>
          <ListItemAvatar>
            <Avatar
              sx={{
                bgcolor: `${
                  submissionDisabled ? disabledBgColor : enabledBgColor
                }`,
              }}
            >
              <LightbulbIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${
              submissionDisabled
                ? `${assessment.submission.assessment_submission_state}`
                : `Active`
            }`}
            secondary="Status"
          />
        </ListItem>
        {assessment.submission.assessment_submission_state === 'Graded' && (
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <CheckCircleIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              secondary="Score"
              primary={assessment.submission.score!}
            />
          </ListItem>
        )}

        <ListItem>
          <ListItemAvatar />
          <ListItemText
            secondary="Opened Time"
            primary={formatDateTime(assessment.submission.opened_at)}
          />
        </ListItem>
        {submissionDisabled &&
          (assessment.submission.submitted_at ? (
            <ListItem>
              <ListItemAvatar />
              <ListItemText
                secondary="Submitted At"
                primary={formatDateTime(assessment.submission.submitted_at)}
              />
            </ListItem>
          ) : (
            <ListItem>
              <ListItemAvatar />
              <ListItemText
                secondary="End Time"
                primary={formatDateTime(endTime.toISOString())}
              />
            </ListItem>
          ))}
        {!submissionDisabled && endTime && (
          <>
            <Divider variant="middle" component="li" />
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: `${
                      submissionDisabled ? disabledBgColor : enabledBgColor
                    }`,
                  }}
                >
                  {showTimer ? <TimerIcon /> : <CalendarMonthIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                secondary={showTimer ? `Time Remaining` : `End Date`}
                primary={
                  showTimer
                    ? secondsRemaining !== null
                      ? formatTimeRemaining(secondsRemaining)
                      : 0
                    : formatDateTime(endTime.toString())
                }
              />
              <Tooltip
                title={showTimer ? `Hide Timer` : `Show Timer`}
                placement="top"
                arrow
              >
                <Switch
                  edge="end"
                  onChange={handleToggleTimer}
                  checked={showTimer}
                />
              </Tooltip>
            </ListItem>
          </>
        )}
      </List>
    </>
  );
};

export default AssessmentMetadataBar;
