const path = require('path');

/**
 * When data is queried from a Gatsby source using graphql, any empty properties
 * are set to null. React expects optional props to not be set in order to know
 * to use default values. So, this function deletes all the nulls from the
 * graphql results so they can be used as React props with default behaviour.
 */
const removeNullsDeep = node => {
  for (const prop in node) {
    if (typeof node[prop] === 'object') {
      if (node[prop] === null) {
        delete node[prop];
      } else {
        node[prop] = removeNullsDeep(node[prop]);
      }
    }
  }
  return node;
};

exports.createPages = async ({ actions: { createPage }, graphql }) => {
  const listPagesResult = await graphql(`
    query ListPages {
      allPagesYaml {
        nodes {
          background
          description
          title
          sections {
            background
            backgroundMobile
            columns {
              body
              bodyComponent
              bodyTextAlign
              bodyVariant
              callToActionColor
              callToActionHref
              callToActionText
              callToActionVariant
              color
              formAction
              formButtonText
              formFields {
                label
                required
                type
              }
              formHeading
              formName
              heading
              headingComponent
              headingTextAlign
              headingVariant
              imageAlt
              imageAspectRatio
              imageFile
              imageOriginalHeight
              imageOriginalWidth
              span
              verticalWhiteSpace
            }
            id
            minHeight
            verticalAlignment
            verticalWhiteSpace
          }
          parent {
            ... on File {
              name
            }
          }
        }
      }
    }
  `);

  const listBlogPostsResult = await graphql(`
    query ListBlogPosts {
      allMarkdownRemark {
        nodes {
          excerpt(format: PLAIN)
          frontmatter {
            author
            publicationDate
            slug
            subtitle
            title
          }
          html
        }
      }
    }
  `);

  const pageTemplatePath = path.resolve(`./src/components/PageTemplate.tsx`);
  const postTemplatePath = path.resolve(`./src/components/PostTemplate.tsx`);

  for (const {
    parent: { name: path },
    ...context
  } of listPagesResult.data.allPagesYaml.nodes) {
    createPage({
      path: path === 'index' ? '/' : path,
      component: pageTemplatePath,
      context: removeNullsDeep(context),
    });
  }

  for (const context of listBlogPostsResult.data.allMarkdownRemark.nodes) {
    const {
      frontmatter: { publicationDate, slug },
    } = context;
    const { frontmatter, ...otherProps } = context;
    const flattenedFrontmatter = { ...frontmatter, ...otherProps };
    createPage({
      path: `/blog/${publicationDate.substr(0, 10)}-${slug}/`,
      component: postTemplatePath,
      context: removeNullsDeep(flattenedFrontmatter),
    });
  }
};
