const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {

  // --- Copy Assets

  eleventyConfig.addPassthroughCopy({
    "src/static": ".",
    "src/static/icons": "icons",
    "src/static/img": "img",
    "node_modules/@fortawesome/fontawesome-free/webfonts": "webfonts"
  });

  // HTMX
  if (process.env.NODE_ENV === "production") {
    eleventyConfig.addPassthroughCopy({"node_modules/htmx.org/dist/htmx.min.js": "js/htmx.js"});
  } else {
    eleventyConfig.addPassthroughCopy({"node_modules/htmx.org/dist/htmx.js": "js/htmx.js"});
  }

  // Font Awesome
  if (process.env.NODE_ENV === "production") {
    eleventyConfig.addPassthroughCopy({"node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css": "css/fontawesome.css"});
    eleventyConfig.addPassthroughCopy({"node_modules/@fortawesome/fontawesome-free/css/solid.min.css": "css/solid.css"});
    eleventyConfig.addPassthroughCopy({"node_modules/@fortawesome/fontawesome-free/css/brands.min.css": "css/brands.css"});
  } else {
    eleventyConfig.addPassthroughCopy({"node_modules/@fortawesome/fontawesome-free/css/fontawesome.css": "css/fontawesome.css"});
    eleventyConfig.addPassthroughCopy({"node_modules/@fortawesome/fontawesome-free/css/solid.css": "css/solid.css"});
    eleventyConfig.addPassthroughCopy({"node_modules/@fortawesome/fontawesome-free/css/brands.css": "css/brands.css"});
  }

  // Alpine.js
  if (process.env.NODE_ENV === "production") {
    eleventyConfig.addPassthroughCopy({"node_modules/alpinejs/dist/cdn.min.js": "js/alpine.js"});
  } else {
    eleventyConfig.addPassthroughCopy({"node_modules/alpinejs/dist/cdn.js": "js/alpine.js"});
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
