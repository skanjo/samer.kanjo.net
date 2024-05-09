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

  // Font Awesome
  eleventyConfig.addPassthroughCopy({"node_modules/@fortawesome/fontawesome-free/webfonts": "fonts/fontawesome/webfonts"});
  if (process.env.NODE_ENV === "production") {
    eleventyConfig.addPassthroughCopy({"node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css": "fonts/fontawesome/css/fontawesome.css"});
    eleventyConfig.addPassthroughCopy({"node_modules/@fortawesome/fontawesome-free/css/solid.min.css": "fonts/fontawesome/css/solid.css"});
    eleventyConfig.addPassthroughCopy({"node_modules/@fortawesome/fontawesome-free/css/brands.min.css": "fonts/fontawesome/css/brands.css"});
  } else {
    eleventyConfig.addPassthroughCopy({"node_modules/@fortawesome/fontawesome-free/css/fontawesome.css": "fonts/fontawesome/css/fontawesome.css"});
    eleventyConfig.addPassthroughCopy({"node_modules/@fortawesome/fontawesome-free/css/solid.css": "fonts/fontawesome/css/solid.css"});
    eleventyConfig.addPassthroughCopy({"node_modules/@fortawesome/fontawesome-free/css/brands.css": "fonts/fontawesome/css/brands.css"});
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

  // --- Shortcodes

  eleventyConfig.addShortcode("tsFormat", function (value) {
    const dt = DateTime.fromJSDate(value);
    return dt.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
  });

  eleventyConfig.addShortcode("copyrightNotice", function () {
    dt = DateTime.now();
    return `Copyright 2020-${dt.year} Samer Kanjo. All rights reserved.`
  });

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
