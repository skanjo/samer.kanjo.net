const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const {DateTime} = require("luxon");
const markdownIt = require("markdown-it");
const markdownItLinkAttributes = require('markdown-it-link-attributes');

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

  // --- Libraries

  let markdown = markdownIt({
    html: true
  }).use(markdownItLinkAttributes, {
    matcher(href, config) {
      return href.startsWith("https:");
    },
    attrs: {
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  });

  eleventyConfig.setLibrary('md', markdown);

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true
  });

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

  eleventyConfig.addFilter("parseDate", function (value) {
    if (typeof value === 'string') {
      return DateTime.fromISO(value);
    } else if (value instanceof Date) {
      return DateTime.fromJSDate(value);
    } else {
      throw new Error("Unsupported date value.");
    }
  });

  eleventyConfig.addFilter("formatDateFull", function (value) {
    return value.toLocaleString(DateTime.DATE_FULL);
  })

  eleventyConfig.addFilter("formatTimestampShort", function (value) {
    return value.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
  })

  eleventyConfig.addFilter("md", function (content = "") {
    return markdown.render(content);
  });

  // --- Shortcodes

  eleventyConfig.addShortcode("currentYear", function () {
    return DateTime.now().year;
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

    return sections;
  });

  const sortedPosts = (maxPosts = null) => (collectionApi) => {
    const descendingPubDate = (a, b) => {
      return b.data.publicationDate.localeCompare(a.data.publicationDate);
    };

    const posts = collectionApi.getFilteredByTag("post").sort(descendingPubDate);

    return maxPosts ? posts.slice(0, maxPosts) : posts;
  }
  eleventyConfig.addCollection("posts", sortedPosts());
  eleventyConfig.addCollection("newestPosts", sortedPosts(4));

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
