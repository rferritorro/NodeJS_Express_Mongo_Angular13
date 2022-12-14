var router = require("express").Router();

router.use("/category", require("./category.routes"));
router.use("/user", require("./users.routes"));
router.use("/product", require("./product.routes"));
router.use("/profile", require("./profiles.routes"));
router.use("/product_category", require("./product_category.routes"));
router.use("/comments", require("./comment.routes"));

router.use(function (err, req, res, next) {
    if (err.name === "ValidationError") {
      return res.status(422).json({
        errors: Object.keys(err.errors).reduce(function (errors, key) {
          errors[key] = err.errors[key].message;
  
          return errors;
        }, {}),
      });
    }
  
    return next(err);
});

module.exports = router;