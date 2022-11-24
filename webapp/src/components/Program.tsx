import React from 'react';
import { decodeHTML } from 'entities';
import { DateTime } from 'luxon';
import {
  Calendar,
  luxonLocalizer,
  Views,
  Event as RBCEvent,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { EntityId, ProgramActivity } from '../types/api';

interface ProgramProps {
  id: EntityId;
  title: string;
  startDate: string;
  endDate: string;
  activities: ProgramActivity[];
}

export class Program {
  id: EntityId;
  title: string;
  startDate: string;
  endDate: string;
  activities: ProgramActivity[];

  constructor({ id, title, startDate, endDate, activities }: ProgramProps) {
    this.id = id;
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.activities = activities;
  }
  activitiesForCalendar() {
    return this.activities.map(activity => ({
      title: decodeHTML(activity.title),
      start: new Date(activity.start_time),
      end: new Date(activity.end_time),
      description: decodeHTML(activity.description_text),
      allDay: !activity.duration,
    }));
  }
  getCalendar(handleClickActivity: (_: RBCEvent) => void) {
    return (
      <Calendar
        events={this.activitiesForCalendar()}
        onSelectEvent={handleClickActivity}
        localizer={luxonLocalizer(DateTime)}
        defaultView={Views.WEEK}
        startAccessor="start"
        endAccessor="end"
        getNow={() => DateTime.local().toJSDate()}
        scrollToTime={DateTime.local().set({ hour: 8, minute: 0 }).toJSDate()}
        style={{ height: 500 }}
      />
    );
  }
}
