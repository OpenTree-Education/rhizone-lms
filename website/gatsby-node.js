const path = require('path');

// HACK For now, all page data is hard coded in this JSON file. The plan is to
//   migrate the data into a database or CMS and use appropriate Gatsby source
//   and Gatsby transformers to query and produce pages.
const pages = require('./data/pages.json');

exports.createPages = ({ actions: { createPage } }) => {
  const pageTemplatePath = path.resolve(`./src/templates/Page.tsx`);

  for (const { path, ...context } of pages) {
    createPage({
      path,
      component: pageTemplatePath,
      context,
    });
  }
};
