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
  eleventyConfig.addFilter("limit", function (array, limit) {
    return array.slice(0, limit);
  });
  eleventyConfig.addFilter("toYear", function (date) {
    return new Date(Date.parse(date)).getFullYear();
  });
  eleventyConfig.addFilter(
    "betweenDates",
    function (collection, startDate, endDate) {
      const start = Date.parse(startDate);
      const end = Date.parse(endDate);
      return collection
        .filter((item) => {
          const itemDate = Date.parse(item.data.date);
          return itemDate >= start && itemDate <= end;
        })
        .sort(function (a, b) {
          return a.date - b.date; // sort by date - ascending
        });
    }
  );
  eleventyConfig.addFilter("nextShow", (collection) => {
    const now = new Date();
    const upcoming = collection
      .filter((show) => new Date(show.data.date) >= now)
      .sort((a, b) => new Date(a.data.date) - new Date(b.data.date));

    return upcoming.length > 0 ? upcoming[0] : null;
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
