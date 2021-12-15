import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { ImgixGatsbyImage } from '@imgix/gatsby';
import { Link as GatsbyLink } from 'gatsby';
import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ColumnData } from '../types/content';
import FormBuilder from './FormBuilder';

const totalGridColumns = 12;

const Column = ({
  body,
  bodyComponent = 'p',
  bodyTextAlign = 'left',
  bodyVariant = 'body1',
  callToActionColor = 'primary',
  callToActionHref,
  callToActionText,
  callToActionVariant = 'contained',
  color,
  formAction,
  formButtonText,
  formFields = [],
  formHeading,
  formName,
  heading,
  headingComponent = 'h2',
  headingTextAlign = 'left',
  headingVariant = 'h2',
  imageAlt,
  imageAspectRatio,
  imageFile,
  imageOriginalHeight,
  imageOriginalWidth,
  span = totalGridColumns,
  verticalWhiteSpace = 2,
}: ColumnData) => {
  const hasForm = formName && formAction && formFields.length > 0;
  const hasCallToAction = callToActionText && callToActionHref;
  const hasImage =
    imageFile && imageAlt && imageOriginalHeight && imageOriginalWidth;
  const columns = span;
  const containerWidth = 1520;
  const imageMaxWidth =
    columns === totalGridColumns
      ? containerWidth
      : Math.ceil((containerWidth / totalGridColumns) * columns - 32);
  return (
    <Grid
      key={Math.random()}
      item
      md={columns}
      py={verticalWhiteSpace}
      xs={totalGridColumns}
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
            align={headingTextAlign}
            component={headingComponent}
            dangerouslySetInnerHTML={{
              __html: heading,
            }}
            variant={headingVariant}
            sx={{ color }}
          />
        )}
        {body && (
          <Typography
            align={bodyTextAlign}
            component={bodyComponent}
            dangerouslySetInnerHTML={{ __html: body }}
            sx={{ color }}
            variant={bodyVariant}
          />
        )}
        {hasCallToAction && (
          <Box py={1}>
            <Button
              color={callToActionColor}
              component={GatsbyLink}
              size="large"
              to={callToActionHref}
              variant={callToActionVariant}
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
};

export default Column;
