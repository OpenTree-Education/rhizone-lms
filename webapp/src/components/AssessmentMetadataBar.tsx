import React, {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';

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

import { Assessment, SubmissionStatus, AssessmentType } from '../assets/data';
import { AssessmentSubmission } from '../types/api.d';
import { formatDateTime } from '../helpers/dateTime';

interface AssessmentMetadataBarProps {
  assessment: Assessment;
  submission: AssessmentSubmission;
  setSubmission: Dispatch<SetStateAction<AssessmentSubmission>>;
}

const AssessmentMetadataBar = ({
  assessment,
  submission,
  setSubmission,
}: AssessmentMetadataBarProps) => {
  const enabledBgColor = '#1e88e5';
  const disabledBgColor = '#bdbdbd';

  const [secondsRemaining, setSecondsRemaining] = useState(
    assessment.testDuration! * 60
  );

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

  const [endTime] = useState(() => {
    if (submission.submitted_at) {
      return Number(submission.submitted_at);
    } else if (
      assessment.testDuration &&
      Number(submission.opened_at) + assessment.testDuration * 60 * 1000 <
        Number(assessment.dueDate)
    ) {
      return Number(submission.opened_at) + assessment.testDuration * 60 * 1000;
    } else {
      return Number(assessment.dueDate);
    }
  });

  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      if (new Date().getTime() < endTime) {
        setSecondsRemaining(
          Math.round((endTime - new Date().getTime()) / 1000)
        );
      } else {
        setSecondsRemaining(0);
      }
    }
    previousTimeRef.current = time;
    if (
      secondsRemaining !== 0 &&
      submission.assessment_submission_state !== 'Submitted'
    ) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      const completedSubmission = { ...submission };
      completedSubmission.assessment_submission_state = 'Expired';
      setSubmission(completedSubmission);
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  });

  const [showTimer, setShowTimer] = React.useState(true);

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
                  submission.assessment_submission_state ===
                    SubmissionStatus.Opened ||
                  submission.assessment_submission_state ===
                    SubmissionStatus.InProgress
                    ? enabledBgColor
                    : disabledBgColor
                }`,
              }}
            >
              <InfoIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Typography variant="body2">{assessment.description}</Typography>
            <ListItemText secondary={`Type: ${assessment.type}`} />
          </ListItemText>
        </ListItem>
        <Divider variant="middle" />
        <ListItem>
          <ListItemAvatar>
            <Avatar
              sx={{
                bgcolor: `${
                  submission.assessment_submission_state ===
                    SubmissionStatus.Opened ||
                  submission.assessment_submission_state ===
                    SubmissionStatus.InProgress
                    ? enabledBgColor
                    : disabledBgColor
                }`,
              }}
            >
              <LightbulbIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${
              submission.assessment_submission_state ===
                SubmissionStatus.Opened ||
              submission.assessment_submission_state ===
                SubmissionStatus.InProgress
                ? `Active`
                : `${submission?.assessment_submission_state}`
            }`}
            secondary="Status"
          />
        </ListItem>
        {submission.assessment_submission_state === SubmissionStatus.Graded && (
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <CheckCircleIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText secondary="Score" primary={submission.score} />
          </ListItem>
        )}
        {(submission.assessment_submission_state ===
          SubmissionStatus.Submitted ||
          submission.assessment_submission_state ===
            SubmissionStatus.Graded) && (
          <ListItem>
            <ListItemAvatar />
            <ListItemText
              secondary="Submitted At"
              primary={formatDateTime(
                new Date(Number(submission.submitted_at!)).toString()
              )}
            />
          </ListItem>
        )}
        {assessment.type !== AssessmentType.Test &&
          (submission.assessment_submission_state === SubmissionStatus.Opened ||
            submission.assessment_submission_state ===
              SubmissionStatus.InProgress) && (
            <>
              <Divider variant="middle" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: `${
                        submission.assessment_submission_state ===
                          SubmissionStatus.Opened ||
                        submission.assessment_submission_state ===
                          SubmissionStatus.InProgress
                          ? enabledBgColor
                          : disabledBgColor
                      }`,
                    }}
                  >
                    <CalendarMonthIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  secondary="End Date"
                  primary={formatDateTime(new Date(endTime).toString())}
                />
              </ListItem>
            </>
          )}
        {assessment.type === AssessmentType.Test &&
          (submission.assessment_submission_state === SubmissionStatus.Opened ||
            submission.assessment_submission_state ===
              SubmissionStatus.InProgress) && (
            <>
              <Divider variant="middle" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: `${
                        submission.assessment_submission_state ===
                          SubmissionStatus.Opened ||
                        submission.assessment_submission_state ===
                          SubmissionStatus.InProgress
                          ? enabledBgColor
                          : disabledBgColor
                      }`,
                    }}
                  >
                    <TimerIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  secondary={showTimer ? `Time Remaining` : `Time Limit`}
                  primary={
                    showTimer
                      ? formatTimeRemaining(secondsRemaining)
                      : formatTimeRemaining(assessment.testDuration! * 60)
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
