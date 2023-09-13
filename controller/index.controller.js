const createError = require("http-errors");
const ShortUrl = require("../models/url.model");
const shortId = require("shortid");
const { urlSchema } = require("../helper/validation_schema");

const indexController = {
  /**
   * GET "/"
   * Access: Public
   * Index page
   */
  index: async (req, res, next) => {
    const urls = await ShortUrl.find();
    res.render("index", { urls });
  },

  /**
   * POST "/"
   * Access: Public
   * create short Url
   */
  create: async (req, res, next) => {
    try {
      const result = await urlSchema.validateAsync(req.body);

      const urls = await ShortUrl.find();
      const urlExists = await ShortUrl.findOne({ url: result.url });
      if (urlExists) {
        res.render("index", {
          // shortUrl: `${req.hostname}/${urlExists.shortId}`,
          shortUrl: `http://${req.headers.host}/${urlExists.shortId}`,
          urls,
        });
        return;
      }
      const shortUrl = new ShortUrl({
        url: result.url,
        shortId: shortId.generate(),
      });
      const savedShortUrl = await shortUrl.save();
      res.render("index", {
        // shortUrl: `${req.hostname}/${savedShortUrl.shortId}`,
        shortUrl: `http://${req.headers.host}/${savedShortUrl.shortId}`,
        urls,
      });
    } catch (error) {
      if (error.isJoi === true) {
        const urls = await ShortUrl.find();
        req.flash(createError.BadRequest());
        res.render("index", { alerts: req.flash(), urls });
        return;
      }
      next(error);
    }
  },

  /**
   * GET "/:shortID"
   * Access: Public
   * search for shortUrl
   */
  show: async (req, res, next) => {
    try {
      const { shortId } = req.params;
      const result = await ShortUrl.findOne({ shortId });
      if (!result) {
        const urls = await ShortUrl.find();
        req.flash("danger", createError.NotFound("Short URL does not exists."));
        // throw createError.NotFound("Short URL does not exists.");
        res.render("index", { alerts: req.flash(), urls });
        return;
      }

      res.redirect(result.url);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = indexController;
