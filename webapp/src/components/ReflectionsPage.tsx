import { Box, Container, Grid, Stack } from '@mui/material';
import React, { useState } from 'react';

import CreateReflectionForm from './CreateReflectionForm';
import { EntityId, Reflection } from '../types/api';
import ReflectionCard from './ReflectionCard';
import useApiData from '../helpers/useApiData';

const ReflectionsPage = () => {
  const [newlyCreatedReflectionIds, setNewlyCreatedReflectionIds] = useState<
    EntityId[]
  >([]);
  const {
    data: reflections,
    error,
    isLoading,
  } = useApiData<Reflection[]>({
    deps: [newlyCreatedReflectionIds],
    path: '/reflections',
    sendCredentials: true,
  });
  return (
    <Container fixed>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Box my={12}>
            <CreateReflectionForm
              onReflectionCreated={id =>
                setNewlyCreatedReflectionIds([...newlyCreatedReflectionIds, id])
              }
            />
          </Box>
          {reflections && reflections.length > 0 && (
            <h2>Your previous entries</h2>
          )}
          {error && (
            <div>There was an error fetching the list of past reflections.</div>
          )}
          {isLoading && <div>Loading...</div>}
          <Stack spacing={3}>
            {reflections &&
              reflections.map(
                ({
                  id,
                  created_at: createdAt,
                  journal_entries: journalEntries,
                  responses,
                }) => (
                  <ReflectionCard
                    key={id}
                    createdAt={createdAt}
                    journalEntries={journalEntries}
                    responses={responses}
                  />
                )
              )}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReflectionsPage;
