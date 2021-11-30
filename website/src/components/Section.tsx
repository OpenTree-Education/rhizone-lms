import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Link as GatsbyLink } from 'gatsby';
import { micromark } from 'micromark';
import React from 'react';
import Typography from '@mui/material/Typography';

import { SectionData } from '../types/data';

const Section = ({ background, color, columns, id }: SectionData) => (
  <Box component="section" id={id} sx={{ background }}>
    <Container maxWidth="xl">
      <Grid
        alignItems="center"
        columnSpacing={3}
        container
        justifyContent="center"
      >
        {columns.map(
          (
            {
              body,
              bodyVariant,
              callToActionColor,
              callToActionHref,
              callToActionText,
              callToActionVariant,
              heading,
              headingComponent,
              headingVariant,
              span,
              verticalWhiteSpace,
            },
            contentIndex
          ) => (
            <Grid
              key={contentIndex}
              item
              md={span || 3}
              py={verticalWhiteSpace || 12}
              sm={12}
            >
              {heading && (
                <Typography
                  component={headingComponent || 'h2'}
                  variant={headingVariant || 'h3'}
                  sx={{ color }}
                >
                  {heading}
                </Typography>
              )}
              {body && (
                <Typography
                  component="div"
                  dangerouslySetInnerHTML={{
                    __html: micromark(body, 'utf8', {
                      allowDangerousHtml: true,
                    }),
                  }}
                  variant={bodyVariant || 'subtitle1'}
                  sx={{ color }}
                />
              )}
              {callToActionText && callToActionHref && (
                <Box>
                  <Button
                    color={callToActionColor || 'primary'}
                    component={GatsbyLink}
                    size="large"
                    to={callToActionHref}
                    variant={callToActionVariant || 'contained'}
                  >
                    {callToActionText}
                  </Button>
                </Box>
              )}
            </Grid>
          )
        )}
      </Grid>
    </Container>
  </Box>
);

export default Section;
