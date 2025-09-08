const routeExist = (app) => {
  app.use((req, res) => {
    res.status(404).json({ errorMessage: "This route does not exist" });
  });
};

const serverError = (app) => {
  app.use((err, req, res) => {
    console.error("ERROR", req.method, req.path, err);

    if (!res.headersSent) {
      res.status(500).json({
        errorMessage: "Internal server error. Check the server console",
      });
    }
  });
};

module.exports = { routeExist, serverError };
