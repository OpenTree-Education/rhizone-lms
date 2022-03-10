import { MeetingNote } from '../types/api';

export const compareMeetingNotes = (a: MeetingNote, b: MeetingNote) => {
  if (
    typeof a.agenda_owning_participant_id !==
    typeof b.agenda_owning_participant_id
  ) {
    return a.agenda_owning_participant_id === null &&
      b.agenda_owning_participant_id !== null
      ? 1
      : -1;
  }
  if (
    a.agenda_owning_participant_id &&
    b.agenda_owning_participant_id &&
    a.agenda_owning_participant_id !== b.agenda_owning_participant_id
  ) {
    return a.agenda_owning_participant_id > b.agenda_owning_participant_id
      ? 1
      : -1;
  }
  if (a.sort_order !== b.sort_order) {
    return a.sort_order - b.sort_order;
  }
  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
};
