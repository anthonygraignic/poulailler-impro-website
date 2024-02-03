const { DateTime } = require("luxon");
const { execSync } = require("child_process");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/img");
  //   eleventyConfig.addPassthroughCopy("src/css/tailwind.css");

  //   eleventyConfig.setServerOptions({
  //     watch: ["public/assets/css/tailwind.css"],
  //   });

  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addNunjucksGlobal(
    "upcomingEvent",
    (eventDate) => Date.parse(eventDate) > new Date().getTime()
  );
  eleventyConfig.addFilter("past", function (collection) {
    return collection
      .filter((item) => Date.parse(item.data.date) < new Date())
      .sort(function (a, b) {
        return b.date - a.date; // sort by date - descending
      });
  });
  eleventyConfig.addFilter("upcoming", function (collection) {
    return collection
      .filter((item) => Date.parse(item.data.date) >= new Date())
      .sort(function (a, b) {
        return a.date - b.date; // sort by date - ascending
      });
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
