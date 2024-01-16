const http = require("http");
const Filter = require("bad-words");

const hostname = "127.0.0.1";
const port = 3000;

const predictions = [
  "A surprising opportunity will knock on your door. Say yes.",
  "A long-lost connection will re-enter your life, bringing with it a wave of nostalgia and valuable lessons.",
  "Take a leap of faith in pursuing your dreams. The universe is aligning in your favor.",
  "Your creativity will soar to new heights.",
];

const filter = new Filter();
function containsProfanity(str) {
  return filter.isProfane(str);
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/api/prediction") {
    const randomIndex = Math.floor(Math.random() * predictions.length);
    const prediction = predictions[randomIndex];

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ prediction: prediction }));
  } else if (req.method === "POST" && req.url === "/api/prediction") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const data = JSON.parse(body);

      if (data.prediction) {
        const isValid = !containsProfanity(data.prediction);

        if (isValid) {
          predictions.push(data.prediction);
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "Prediction submitted successfully." })
          );
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Prediction contains profanity." }));
        }
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Invalid input. Please provide a prediction.",
          })
        );
      }
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running http://${hostname}:${port}`);
});
