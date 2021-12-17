import React from 'react';
import { Grid } from '@mui/material';
import { formatDate, formatTime } from '../helpers/dateTime';
import { Meeting as APIMeeting } from '../types/api';

interface MeetingProps {
  meetingId?: number | string;
}

interface MeetingState {
  meeting?: APIMeeting;
  currentUser?: any;
}

class Meeting extends React.Component<MeetingProps, MeetingState> {
  constructor(props: MeetingProps) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const [fetchCurrentUser, fetchMeeting] = await Promise.all([
      fetch(`${process.env.REACT_APP_API_ORIGIN}/user`, {
        credentials: 'include',
      }),
      fetch(
        `${process.env.REACT_APP_API_ORIGIN}/meetings/${this.props.meetingId}`,
        {
          credentials: 'include',
        }
      ),
    ]);

    if (fetchCurrentUser.ok && fetchMeeting.ok) {
      const { data: currentUser } = await fetchCurrentUser.json();
      const { data: meeting } = await fetchMeeting.json();
      this.setState({
        meeting,
        currentUser,
      });
    }
  }

  render() {
    if (!this.state.meeting || !this.state.currentUser) {
      return <h1>Loading...</h1>;
    }

    const currentParticipantId = this.state.meeting?.participants.find(
      ({ principal_id }) =>
        principal_id === this.state.currentUser?.principal_id
    )?.id;

    return (
      <Grid>
        <h1>{`Meeting on ${formatDate(
          this.state.meeting.starts_at
        )} at ${formatTime(this.state.meeting.starts_at)}`}</h1>
        {this.state.meeting.meeting_notes.map(
          (meetingNote, index, meetingNotes) => (
            <React.Fragment key={meetingNote.id}>
              {(index === 0 ||
                meetingNote.agenda_owning_participant_id !==
                  meetingNotes[index - 1].agenda_owning_participant_id) && (
                <h2>
                  {meetingNote.agenda_owning_participant_id === null
                    ? 'Action items'
                    : meetingNote.agenda_owning_participant_id ===
                      currentParticipantId
                    ? 'My agenda items'
                    : 'Their agenda items'}
                </h2>
              )}
              <ul>
                <li>{meetingNote.note_text}</li>
              </ul>
            </React.Fragment>
          )
        )}
      </Grid>
    );
  }
}

export default Meeting;
