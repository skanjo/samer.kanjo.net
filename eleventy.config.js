const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {

  // --- Copy Assets

  eleventyConfig.addPassthroughCopy({
    "src/static": ".",
    "src/static/icons": "icons",
    "src/static/img": "img"
  });

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
