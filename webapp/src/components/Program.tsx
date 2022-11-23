import React from 'react';

import { EntityId, ProgramActivity } from '../types/api';
import Activity from './Activity';

interface ProgramProps {
  id: EntityId;
  title: string;
  startDate: string;
  endDate: string;
  timeZone: string;
  curriculumId: number;
  activities: ProgramActivity[];
}

const Program = ({
  id,
  title,
  startDate,
  endDate,
  timeZone,
  curriculumId,
  activities,
}: ProgramProps) => {
  return (
    <>
      <p>Program ID#{id}</p>
      <p>Title: {title}</p>
      <p>Start Date: {startDate}</p>
      <p>End Date: {endDate}</p>
      <p>Time Zone: {timeZone}</p>
      <p>Curriculum ID: {curriculumId}</p>
      {activities.map((activity, index) => {
        return (
          <Activity
            key={index}
            title={activity.title}
            descriptionText={activity.description_text}
            programId={activity.program_id}
            curriculumActivityId={activity.curriculum_activity_id}
            startTime={activity.start_time}
            endTime={activity.end_time}
            activityType={activity.activity_type}
            duration={activity.duration}
          />
        );
      })}
    </>
  );
};

export default Program;
