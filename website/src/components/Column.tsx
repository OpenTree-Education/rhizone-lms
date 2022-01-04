import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { ImgixGatsbyImage } from '@imgix/gatsby';
import { Link as GatsbyLink } from 'gatsby';
import React from 'react';
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
  const content = [];
  if (imageFile && imageAlt && imageOriginalHeight && imageOriginalWidth) {
    const columns = span;
    const containerWidth = 1520;
    const imageMaxWidth =
      columns === totalGridColumns
        ? containerWidth
        : Math.ceil((containerWidth / totalGridColumns) * columns - 32);
    content.push(
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
    );
  }
  if (heading) {
    content.push(
      <Typography
        align={headingTextAlign}
        component={headingComponent}
        dangerouslySetInnerHTML={{
          __html: heading,
        }}
        variant={headingVariant}
        sx={{ color }}
      />
    );
  }
  if (body) {
    content.push(
      <Typography
        align={bodyTextAlign}
        component={bodyComponent}
        dangerouslySetInnerHTML={{ __html: body }}
        sx={{ color }}
        variant={bodyVariant}
      />
    );
  }
  if (callToActionText && callToActionHref) {
    content.push(
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
    );
  }
  if (formName && formAction && formFields.length > 0) {
    content.push(
      <FormBuilder
        formAction={formAction}
        formButtonText={formButtonText}
        formFields={formFields}
        formHeading={formHeading}
        formName={formName}
      />
    );
  }
  return (
    <Grid
      key={Math.random()}
      item
      md={span}
      py={verticalWhiteSpace}
      xs={totalGridColumns}
    >
      {content.map((item, index) => (
        <Box key={index} mt={index === 0 ? 0 : 2}>
          {item}
        </Box>
      ))}
    </Grid>
  );
};

export default Column;
