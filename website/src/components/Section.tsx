import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Link as GatsbyLink } from 'gatsby';
import React from 'react';
import Typography from '@mui/material/Typography';

import { SectionData } from '../types/content';

const verticalAlignmentsMap = {
  bottom: 'flex-end',
  middle: 'center',
  top: 'flex-start',
};

const Section = ({
  background,
  color,
  columns,
  id,
  verticalAlignment,
  verticalWhiteSpace: sectionVerticalWhiteSpace,
}: SectionData) => (
  <Box
    component="section"
    id={id}
    py={
      Number.isFinite(sectionVerticalWhiteSpace)
        ? sectionVerticalWhiteSpace
        : 10
    }
    sx={{ background }}
  >
    <Container maxWidth="xl">
      <Grid
        alignItems={verticalAlignmentsMap[verticalAlignment || 'top']}
        columnSpacing={4}
        container
        justifyContent="center"
      >
        {columns.map(
          (
            {
              body,
              bodyComponent,
              bodyTextAlign,
              bodyVariant,
              callToActionColor,
              callToActionHref,
              callToActionText,
              callToActionVariant,
              heading,
              headingComponent,
              headingTextAlign,
              headingVariant,
              span,
              verticalWhiteSpace: columnVerticalWhiteSpace,
            },
            contentIndex
          ) => (
            <Grid
              key={contentIndex}
              item
              md={span || 12}
              py={
                Number.isFinite(columnVerticalWhiteSpace)
                  ? columnVerticalWhiteSpace
                  : 2
              }
              xs={12}
            >
              {heading && (
                <Typography
                  align={headingTextAlign || 'left'}
                  component={headingComponent || 'h2'}
                  dangerouslySetInnerHTML={{
                    __html: heading,
                  }}
                  variant={headingVariant || 'h4'}
                  sx={{ color }}
                />
              )}
              {body && (
                <Typography
                  align={bodyTextAlign || 'left'}
                  component={bodyComponent || 'p'}
                  dangerouslySetInnerHTML={{ __html: body }}
                  mb={callToActionText && callToActionHref ? 3 : 0}
                  mt={heading ? 2 : 0}
                  sx={{ color }}
                  variant={bodyVariant || 'body1'}
                />
              )}
              {callToActionText && callToActionHref && (
                <Box mt={heading || body ? 3 : 0}>
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
