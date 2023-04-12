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
  Button,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import TimerIcon from '@mui/icons-material/Timer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

import { SavedAssessment } from '../types/api.d';
import { formatDateTime } from '../helpers/dateTime';
import { DateTime } from 'luxon';

interface AssessmentMetadataBarProps {
  assessment: SavedAssessment;
  endTime: DateTime;
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
        {assessment.curriculum_assessment.description &&
          typeof assessment.curriculum_assessment.description === 'string' &&
          assessment.curriculum_assessment.description.length > 0 && (
            <>
              <ListItem>
                <ListItemText>
                  <Typography variant="body2">
                    {assessment.curriculum_assessment.description}
                  </Typography>
                </ListItemText>
              </ListItem>
              <Divider variant="middle" />
            </>
          )}
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
            <ListItemText
              primary={
                assessment.curriculum_assessment.assessment_type[0].toUpperCase() +
                assessment.curriculum_assessment.assessment_type.slice(1)
              }
              secondary="Assessment Type"
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
        {assessment.submission.score &&
          typeof assessment.submission.score === 'number' &&
          assessment.submission.score > 0 && (
            <>
              <Divider variant="middle" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <CheckCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  secondary="Score"
                  primary={assessment.submission.score}
                />
              </ListItem>
            </>
          )}
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
              <CalendarMonthIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            secondary="Opened Time"
            primary={formatDateTime(assessment.submission.opened_at)}
          />
        </ListItem>
        {submissionDisabled &&
          (assessment.submission.submitted_at ? (
            <>
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
                    <TimerIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  secondary="Submitted At"
                  primary={formatDateTime(assessment.submission.submitted_at)}
                />
              </ListItem>
            </>
          ) : (
            <>
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
                    <TimerIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  secondary="End Time"
                  primary={formatDateTime(endTime.toISO()!)}
                />
              </ListItem>
            </>
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
                  <TimerIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                secondary={showTimer ? `Time Remaining` : `End Date`}
                primary={
                  showTimer
                    ? secondsRemaining !== null
                      ? formatTimeRemaining(secondsRemaining)
                      : 0
                    : formatDateTime(endTime.toISO()!)
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
        <ListItem>
          <Button
            href={`/assessments/${assessment.program_assessment.id}/submissions`}
            variant="outlined"
          >
            &laquo; Submissions List
          </Button>
        </ListItem>
      </List>
    </>
  );
};

export default AssessmentMetadataBar;
