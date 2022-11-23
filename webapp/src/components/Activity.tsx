import React from 'react';

interface ActivityProps {
  title: string;
  descriptionText: string;
  programId: number;
  curriculumActivityId: number;
  activityType: string;
  startTime: string;
  endTime: string;
  duration: number;
}

const Activity = ({
  title,
  descriptionText,
  programId,
  curriculumActivityId,
  startTime,
  endTime,
  activityType,
  duration,
}: ActivityProps) => {
  return (
    <>
      <p>Title: {title}</p>
      <p>Description: {descriptionText}</p>
      <p>programId: {programId}</p>
      <p>curriculumActivityId: {curriculumActivityId}</p>
      <p>Start Time: {startTime}</p>
      <p>End Time: {endTime}</p>
      <p>Activity Type: {activityType}</p>
      <p>duration:{duration}</p>
    </>
  );
};

export default Activity;
