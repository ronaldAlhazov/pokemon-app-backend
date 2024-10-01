const server = require("./server");
const PORT = process.env.PORT || 3000;

const startServer = () => {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
