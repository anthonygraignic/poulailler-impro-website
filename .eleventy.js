const { DateTime } = require("luxon");
const { execSync } = require("child_process");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/img");
  //   eleventyConfig.addPassthroughCopy("src/css/tailwind.css");

  //   eleventyConfig.setServerOptions({
  //     watch: ["public/assets/css/tailwind.css"],
  //   });

  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addFilter("past", function (collection) {
    return collection.filter((item) => Date.parse(item.data.date) < new Date());
  });
  eleventyConfig.addFilter("upcoming", function (collection) {
    return collection.filter(
      (item) => Date.parse(item.data.date) >= new Date()
    );
  });

  return {
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts",
      output: "public",
    },
  };
};
