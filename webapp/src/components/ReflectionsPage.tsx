import { Box, Grid, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';

import CreateReflectionForm from './CreateReflectionForm';
import { Reflection } from '../types/api';
import ReflectionCard from './ReflectionCard';

const ReflectionsPage = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [newlyCreatedReflectionIds, setNewlyCreatedReflectionIds] = useState<
    number[]
  >([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ORIGIN}/reflections`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(
        ({ data: reflections }) => {
          setReflections(reflections);
          setIsLoaded(true);
        },
        error => {
          setError(error);
          setIsLoaded(true);
        }
      );
  }, [newlyCreatedReflectionIds]);
  if (error) {
    return <div>There was an error fetching the list of past reflections.</div>;
  }
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={8}>
        <Box my={12}>
          <CreateReflectionForm
            onReflectionCreated={({ data: { id } }) =>
              setNewlyCreatedReflectionIds([...newlyCreatedReflectionIds, id])
            }
          />
        </Box>
        {reflections.length > 0 && <h2>Your previous entries</h2>}
        <Stack spacing={2}>
          {reflections.map(
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
  );
};

export default ReflectionsPage;
