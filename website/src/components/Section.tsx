import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Link as GatsbyLink } from 'gatsby';
import { micromark } from 'micromark';
import React from 'react';
import Typography from '@mui/material/Typography';

import { SectionData } from '../@types/data';

const Section = ({
  background,
  color,
  content,
  id,
  verticalWhiteSpace,
}: SectionData) => (
  <Box
    component="section"
    id={id}
    px={3}
    py={verticalWhiteSpace || 12}
    sx={{ background }}
  >
    <Grid container alignItems="center" justifyContent="center" spacing={3}>
      {content.map(
        (
          {
            body,
            bodyVariant,
            callToActionColor,
            callToActionHref,
            callToActionText,
            callToActionVariant,
            columns,
            heading,
            headingComponent,
            headingVariant,
          },
          key
        ) => (
          <Grid key={key} item xs={12} md={columns || 3}>
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
                  __html: micromark(body, 'utf8', { allowDangerousHtml: true }),
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
  </Box>
);

export default Section;
