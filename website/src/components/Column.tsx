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

const Column = ({
  body,
  bodyComponent,
  bodyTextAlign,
  bodyVariant,
  callToActionColor,
  callToActionHref,
  callToActionText,
  callToActionVariant,
  color,
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
}: ColumnData) => {
  const hasForm = formName && formAction && formFields.length > 0;
  const hasCallToAction = callToActionText && callToActionHref;
  const hasImage =
    imageFile && imageAlt && imageOriginalHeight && imageOriginalWidth;
  const totalColumns = 12;
  const columns = span || totalColumns;
  const containerWidth = 1520;
  const imageMaxWidth =
    columns === totalColumns
      ? containerWidth
      : Math.ceil((containerWidth / totalColumns) * columns - 32);
  return (
    <Grid
      key={Math.random()}
      item
      md={columns}
      py={
        Number.isFinite(columnVerticalWhiteSpace) ? columnVerticalWhiteSpace : 2
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
            variant={headingVariant || 'h2'}
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
          <Box py={1}>
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
};

export default Column;
