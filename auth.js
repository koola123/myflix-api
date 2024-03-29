const jwtSecret = "your_jwt_secret"; // This has to be the same key used in the JWTStrategy

const jwt = require("jsonwebtoken"),
  passport = require("passport");

require("./passport"); // Your local passport file

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // This is the username you’re encoding in the JWT
    expiresIn: "7d", // This specifies that the token will expire in 7 days
    algorithm: "HS256", // This is the algorithm used to “sign” or encode the values of the JWT
  });
};

/**
 * ENABLES THE USER TO LOG IN INTO THE APP
 * @description - Enables the user to log in into the app
 * @param {URL} - /login
 * @param {HTTP} - POST
 * @param {Query_Paramenters} - none
 * @param {Request_Body} - JSON object
 * @example
 * // Request data format
 * {
 *  "Username": "User1",
 *  "Password": "Password1"
 * }
 * @param {Response} - JSON object
 * @example
 * // Response data format
 * {
 *  user: {
 *    "_id": "asdasd123123123asd",
 *    "Username": "User1",
 *    "Password": "Password1",
 *  	"Email": "user1@email.com",
 *    "Birthdate": "1990-01-01" ,
 *    "FavoriteMovies": []
 *  },
 *  token: "zxcvbnmmnbvcxz1029384756zxcvbnm"
 * }
 * @param {authentication} - Basic HTTP authentication (Username, Password)
 * @callback requestCallback
 * @returns {obejct} - An object containing a JWT token and the logged in user object
 */

/* POST login. */
module.exports = (router) => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
