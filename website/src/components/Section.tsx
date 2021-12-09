import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { ImgixGatsbyImage } from '@imgix/gatsby';
import { Link as GatsbyLink } from 'gatsby';
import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import FormBuilder from './FormBuilder';
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
  minHeight,
  verticalAlignment,
  verticalWhiteSpace: sectionVerticalWhiteSpace,
}: SectionData) => (
  <Box component="section" id={id} sx={{ background }}>
    <Container
      maxWidth="xl"
      sx={{
        py: Number.isFinite(sectionVerticalWhiteSpace)
          ? sectionVerticalWhiteSpace
          : 10,
      }}
    >
      <Grid
        alignItems={verticalAlignmentsMap[verticalAlignment || 'top']}
        columnSpacing={4}
        container
        justifyContent="center"
        sx={{ minHeight }}
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
              formAction,
              formButtonText,
              formFields = [],
              formHeading,
              formName,
              heading,
              headingComponent,
              headingTextAlign,
              headingVariant,
              imageAlt,
              imageAspectRatio,
              imageFile,
              imageOriginalHeight,
              imageOriginalWidth,
              span,
              verticalWhiteSpace: columnVerticalWhiteSpace,
            },
            contentIndex
          ) => {
            const hasForm = formName && formAction && formFields.length > 0;
            const hasCallToAction = callToActionText && callToActionHref;
            const hasImage =
              imageFile &&
              imageAlt &&
              imageOriginalHeight &&
              imageOriginalWidth;
            const totalColumns = 12;
            const columns = span || totalColumns;
            const containerWidth = 1520;
            const imageMaxWidth =
              columns === totalColumns
                ? containerWidth
                : Math.ceil((containerWidth / totalColumns) * columns - 32);
            return (
              <Grid
                key={contentIndex}
                item
                md={columns}
                py={
                  Number.isFinite(columnVerticalWhiteSpace)
                    ? columnVerticalWhiteSpace
                    : 2
                }
                xs={totalColumns}
              >
                <Stack spacing={2}>
                  {hasImage && (
                    <Box sx={{ alignSelf: 'center' }}>
                      <ImgixGatsbyImage
                        alt={imageAlt}
                        src={`https://opentree-education.imgix.net/${imageFile}`}
                        sourceHeight={imageOriginalHeight}
                        sourceWidth={imageOriginalWidth}
                        layout="constrained"
                        aspectRatio={imageAspectRatio}
                        width={imageMaxWidth}
                      />
                    </Box>
                  )}
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
                      sx={{ color }}
                      variant={bodyVariant || 'body1'}
                    />
                  )}
                  {hasCallToAction && (
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
                  {hasForm && (
                    <FormBuilder
                      formAction={formAction}
                      formButtonText={formButtonText}
                      formFields={formFields}
                      formHeading={formHeading}
                      formName={formName}
                    />
                  )}
                </Stack>
              </Grid>
            );
          }
        )}
      </Grid>
    </Container>
  </Box>
);

export default Section;
