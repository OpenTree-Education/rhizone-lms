const path = require('path');

exports.createPages = async ({ actions: { createPage }, graphql }) => {
  const listPagesResult = await graphql(`
    query ListPages {
      allPagesYaml {
        nodes {
          background
          title
          sections {
            background
            backgroundMobile
            color
            columns {
              body
              bodyComponent
              bodyTextAlign
              bodyVariant
              callToActionColor
              callToActionHref
              callToActionText
              callToActionVariant
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

  const pageTemplatePath = path.resolve(`./src/templates/Page.tsx`);
  const postTemplatePath = path.resolve(`./src/templates/Post.tsx`);

  for (const {
    parent: { name: path },
    ...context
  } of listPagesResult.data.allPagesYaml.nodes) {
    createPage({
      path: path === 'index' ? '/' : path,
      component: pageTemplatePath,
      context,
    });
  }

  for (const context of listBlogPostsResult.data.allMarkdownRemark.nodes) {
    const {
      frontmatter: { publicationDate, slug },
    } = context;
    createPage({
      path: `/blog/${publicationDate.substr(0, 10)}-${slug}/`,
      component: postTemplatePath,
      context,
    });
  }
};
