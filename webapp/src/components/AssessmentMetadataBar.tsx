import React, { useState, useRef, useEffect } from 'react';

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
import InventoryIcon from '@mui/icons-material/Inventory';
import TimerIcon from '@mui/icons-material/Timer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { blue, grey } from '@mui/material/colors';

import {
  Assessment,
  SubmissionStatus,
  AssessmentType,
  // AssessmentSubmission,
} from '../assets/data';
import {Question, AssessmentResponse, Answer, AssessmentSubmission} from '../types/api.d'
import { formatDateTime } from '../helpers/dateTime';

interface AssessmentMetadataBarProps {
  assessment: Assessment;
  submission: AssessmentSubmission;
}

const AssessmentMetadataBar = ({
  assessment,
  submission,
}: AssessmentMetadataBarProps) => {
  const enabledBgColor = blue[600];
  const disabledBgColor = grey[400];
  const dueTime = new Date(assessment?.dueDate!);
  //TODO: use the opened date from the submission
  const [openedTime] = useState(new Date(submission.opened_at));
  const [secondsRemaining, setSecondsRemaining] = useState(
    assessment?.testDuration! * 60
  );

  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      if (
        new Date().getTime() > dueTime.getTime() ||
        openedTime.getTime() + assessment?.testDuration! * 60 * 1000 <
          new Date().getTime()
      ) {
        setSecondsRemaining(0);
      } else if (
        new Date().getTime() + assessment?.testDuration! * 60 * 1000 >
        dueTime.getTime()
      ) {
        setSecondsRemaining(
          Math.round((dueTime.getTime() - new Date().getTime()) / 1000)
        );
      } else {
        setSecondsRemaining(
          Math.round(
            (openedTime.getTime() +
              assessment?.testDuration! * 60 * 1000 -
              new Date().getTime()) /
              1000
          )
        );
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  });

  const [showTimer, setShowTimer] = React.useState(true);

  const handleSetShowTimer = (showTimer: boolean) => () => {
    setShowTimer(showTimer);
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
                  submission.assessment_submission_state === SubmissionStatus.Opened
                    ? enabledBgColor
                    : disabledBgColor
                }`,
              }}
            >
              <InfoIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Typography variant="body2">{assessment?.description}</Typography>
            <ListItemText secondary={`Type: ${assessment?.type}`} />
          </ListItemText>
        </ListItem>
        <Divider variant="middle" />
        <ListItem>
          <ListItemAvatar>
            <Avatar
              sx={{
                bgcolor: `${
                  submission.assessment_submission_state === SubmissionStatus.Opened
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
              submission?.assessment_submission_state === SubmissionStatus.Opened
                ? `Active`
                : `${submission?.assessment_submission_state}`
            }`}
            secondary="Status"
          />
        </ListItem>
        {submission.assessment_submission_state === SubmissionStatus.Graded && (
          // <>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <CheckCircleIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText secondary="Score" primary={submission.score} />
            </ListItem>
          // </>
        )}
        {/* {submission.assessment_submission_state === SubmissionStatus.Opened && (
          <ListItem>
            <ListItemAvatar />
            <ListItemText
              secondary="Attempts"
              primary={`${submission.id} out of max ${assessment?.maxNumSubmissions}`}
            />
          </ListItem>
        )} */}
        {(submission.assessment_submission_state === SubmissionStatus.Submitted ||
          submission.assessment_submission_state === SubmissionStatus.Graded) && (
          // <>
          //   <ListItem>
          //     <ListItemAvatar>
          //       <Avatar>
          //         <InventoryIcon />
          //       </Avatar>
          //     </ListItemAvatar>
          //     <ListItemText
          //       secondary="Submissions"
          //       primary={`${submission.id} out of ${assessment?.maxNumSubmissions}`}
          //     />
          //   </ListItem>
            <ListItem>
              <ListItemAvatar />
              <ListItemText
                secondary="Submitted At"
                primary={formatDateTime(
                  new Date(submission.submitted_at!).toString()
                )}
              />
            </ListItem>
          // </>
        )}
        <Divider variant="middle" component="li" />
        <ListItem>
          <ListItemAvatar>
            <Avatar
              sx={{
                bgcolor: `${
                  submission.assessment_submission_state === SubmissionStatus.Opened
                    ? enabledBgColor
                    : disabledBgColor
                }`,
              }}
            >
              <CalendarMonthIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            secondary="Due Date"
            primary={formatDateTime(
              assessment?.dueDate ? assessment?.dueDate : ''
            )}
          />
        </ListItem>
        {assessment!.type === AssessmentType.Test &&
          submission.assessment_submission_state === SubmissionStatus.Opened && (
            <>
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: `${
                        submission.assessment_submission_state === SubmissionStatus.Opened
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
                      ? `${Math.floor(secondsRemaining / 60)}m ${
                          secondsRemaining % 60
                        }s`
                      : assessment?.testDuration + `m`
                  }
                />
                <Tooltip
                  title={showTimer ? `Hide Timer` : `Show Timer`}
                  placement="top"
                  arrow
                >
                  <Switch
                    edge="end"
                    onChange={handleSetShowTimer(!showTimer)}
                    checked={showTimer}
                    inputProps={{
                      'aria-labelledby': 'switch-list-label-wifi',
                    }}
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
