const express = require("express");
const { signin, signup, signout, isSignedIn } = require("../controllers/auth");
const { check } = require("express-validator");

var router = express.Router();

router.post(
  "/signup",
  [
    check("name", "name should be at least three charecter").isLength({
      min: 3,
    }),
    check("email", "email is required").isEmail(),
    check("password", "password should be at least three charecter").isLength({
      min: 3,
    }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "password field is required").isLength({
      min: 1,
    }),
  ],
  signin
);

router.post("/signout", signin);

router.get("/testroute", isSignedIn, (req, res) => {
  res.send("a protected route");
});

module.exports = router;
