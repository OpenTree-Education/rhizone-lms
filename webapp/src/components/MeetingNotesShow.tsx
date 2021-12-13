import React from 'react';
import { formatDate, formatTime } from '../helpers/dateTime';

interface MeetingNotesShowProps {}

interface MeetingNote {
  id: Number;
  note_text: string;
  sort_order: number;
  authoring_participant_id: number;
  agenda_owning_participant_id: number | null;
}

interface Participant {
  principal_id: number;
  id: number;
}

interface MeetingNotesShowState {
  meetingNotes: Array<MeetingNote>;
  principalId: number | null;
  meetingStartTimestamp: string;
  participantId: number | null;
}

class MeetingNotesShow extends React.Component<
  MeetingNotesShowProps,
  MeetingNotesShowState
> {
  constructor(props: MeetingNotesShowProps) {
    super(props);
    this.state = {
      meetingNotes: [],
      meetingStartTimestamp: '',
      principalId: null,
      participantId: null,
    };
  }

  async componentDidMount() {
    const fetchLoggedInPrincipalId = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/user`,
      { credentials: 'include' }
    );
    const fetchMeetingNotes = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}${window.location.pathname}`,
      { credentials: 'include' }
    );

    if (fetchLoggedInPrincipalId.ok && fetchMeetingNotes.ok) {
      const { data: principalId } = await fetchLoggedInPrincipalId.json();
      const { data: meetingNotes } = await fetchMeetingNotes.json();
      const participants: Array<Participant> = meetingNotes.participants;
      let participantId: number | null = null;

      for (let i = 0; i < participants.length; i++) {
        if (participants[i].principal_id === principalId.principal_id) {
          participantId = participants[i].id;
          break;
        }
      }

      this.setState({
        meetingNotes: meetingNotes.meeting_notes,
        meetingStartTimestamp: meetingNotes.starts_at,
        principalId: principalId.principal_id,
        participantId: participantId,
      });
    }
  }

  render() {
    const myAgendaItems: Array<MeetingNote> = [];
    const theirAgendaItems: Array<MeetingNote> = [];
    const actionItems: Array<MeetingNote> = [];
    let meetingNotes;

    if (Object.keys(this.state.meetingNotes).length !== 0) {
      this.state.meetingNotes.forEach(note => {
        if (note.agenda_owning_participant_id === this.state.participantId) {
          myAgendaItems.push(note);
        } else if (note.agenda_owning_participant_id) {
          theirAgendaItems.push(note);
        } else {
          actionItems.push(note);
        }
      });

      meetingNotes = (
        <>
          <h1>{`Meeting on ${formatDate(
            this.state.meetingStartTimestamp
          )} at ${formatTime(this.state.meetingStartTimestamp)}`}</h1>
          <h2>My agenda items</h2>
          <ul>
            {myAgendaItems.map(agenda => {
              return <li key={`my-agenda-${agenda.id}`}>{agenda.note_text}</li>;
            })}
          </ul>
          <h2>Their agenda items</h2>
          <ul>
            {theirAgendaItems.map(agenda => {
              return (
                <li key={`their-agenda-${agenda.id}`}>{agenda.note_text}</li>
              );
            })}
          </ul>
          <h2>Action items</h2>
          <ul>
            {actionItems.map(action => {
              return (
                <li key={`action-item-${action.id}`}>{action.note_text}</li>
              );
            })}
          </ul>
        </>
      );
    }
    return <div>{meetingNotes}</div>;
  }
}

export default MeetingNotesShow;
