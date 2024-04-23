const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {

  // --- Copy Assets

  eleventyConfig.addPassthroughCopy({
    "src/static": ".",
    "src/static/icons": "icons",
    "src/static/img": "img"
  });

  if (process.env.NODE_ENV === "production") {
    eleventyConfig.addPassthroughCopy({"node_modules/htmx.org/dist/htmx.min.js": "js/htmx.js"});
  } else {
    eleventyConfig.addPassthroughCopy({"node_modules/htmx.org/dist/htmx.js": "js/htmx.js"});
  }
  
  // --- Liquid Options

  eleventyConfig.setLiquidOptions({
    jsTruthy: true,
  });

  // --- Plugins

  eleventyConfig.addPlugin(syntaxHighlight, {
    templateFormats: ["liquid", "md"]
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
    templateFormats: ["liquid", "md"],
  }
};
