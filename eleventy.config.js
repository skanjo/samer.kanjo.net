const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const {DateTime} = require("luxon");

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {

  // --- Copy Assets

  eleventyConfig.addPassthroughCopy({"src/static": "/"});

  // HTMX
  if (process.env.NODE_ENV === "production") {
    eleventyConfig.addPassthroughCopy({"node_modules/htmx.org/dist/htmx.min.js": "js/htmx.js"});
  } else {
    eleventyConfig.addPassthroughCopy({"node_modules/htmx.org/dist/htmx.js": "js/htmx.js"});
  }

  // Alpine.js
  if (process.env.NODE_ENV === "production") {
    eleventyConfig.addPassthroughCopy({"node_modules/alpinejs/dist/cdn.min.js": "js/alpine.js"});
  } else {
    eleventyConfig.addPassthroughCopy({"node_modules/alpinejs/dist/cdn.js": "js/alpine.js"});
  }

  // --- Plugins

  eleventyConfig.addPlugin(syntaxHighlight, {
    templateFormats: ["njk", "md"]
  });

  // --- Filters

  eleventyConfig.addFilter("jsonify", function (value) {
    return JSON.stringify(value, null, 4);
  });

  eleventyConfig.addFilter("keys", function (value) {
    return Object.keys(value);
  });

  // --- Shortcodes

  eleventyConfig.addShortcode("tsFormat", function (value) {
    const dt = DateTime.fromJSDate(value);
    return dt.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
  });

  eleventyConfig.addShortcode("copyrightNotice", function () {
    dt = DateTime.now();
    return `Copyright 2020-${dt.year} Samer Kanjo. All rights reserved.`
  });

  // --- Collections

  // Create a sections collection to support rendering section pages using a single layout. This does require that any
  // content that is considered part of a section have the section name defined in frontmatter, at least, but should be
  // defined within an 11ty data file of the directory for that section.
  eleventyConfig.addCollection("sections", function (collectionApi) {
    let sections = {};

    collectionApi.getAll().forEach(item => {
      if (item.data.section) {
        let sectionName = item.data.section;
        if (!sections[sectionName]) {
          sections[sectionName] = [];
        }
        sections[sectionName].push(item);
      }
    });

    // console.log(sections);

    return sections;
  });

  // --- Base Config

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },

    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md"],
  }
};
