import React from 'react';
import { Box, Grid } from '@mui/material';
import CreateReflectionForm from './CreateReflectionForm';
import ReflectionsList from './ReflectionsList';
import { Reflection } from '../types/api';

interface ReflectionsState {
  reflections: Reflection[];
}

interface ReflectionsProps {}

class Reflections extends React.Component<ReflectionsProps, ReflectionsState> {
  constructor(props: ReflectionsProps) {
    super(props);
    this.state = {
      reflections: [],
    };
  }

  async componentDidMount() {
    this.fetchReflections();
  }

  fetchReflections = async () => {
    const fetchReflectionsResponse = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/reflections`,
      { credentials: 'include' }
    );

    if (fetchReflectionsResponse.ok) {
      const { data: reflections } = await fetchReflectionsResponse.json();
      this.setState({ reflections });
    }
  };

  render() {
    return (
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Box my={12}>
            <CreateReflectionForm onReflectionCreated={this.fetchReflections} />
          </Box>
          {this.state.reflections.length > 0 && (
            <ReflectionsList reflections={this.state.reflections} />
          )}
        </Grid>
      </Grid>
    );
  }
}

export default Reflections;
