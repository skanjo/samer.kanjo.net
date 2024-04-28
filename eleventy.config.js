const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

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

  // Inter Font
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource/inter/latin.css": "fonts/inter/latin.css",
    "node_modules/@fontsource/inter/files/inter-latin-*": "fonts/inter/files/",
  })

  // Roboto Mono
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource/roboto-mono/latin.css": "fonts/roboto-mono/latin.css",
    "node_modules/@fontsource/roboto-mono/files/roboto-mono-latin-*": "fonts/roboto-mono/files/",
  })

  // Roboto Serif
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource/roboto-serif/latin.css": "fonts/roboto-serif/latin.css",
    "node_modules/@fontsource/roboto-serif/files/roboto-serif-latin-*": "fonts/roboto-serif/files/",
  })

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
