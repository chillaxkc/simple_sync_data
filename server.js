const express = require("express");
const WebSocket = require("ws");
const http = require("http");
const path = require("path");
const os = require("os"); // 引入 os 模块

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 获取本地 IP 地址的函数
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const interface in interfaces) {
    for (const addr of interfaces[interface]) {
      // 选择 IPv4 地址且不是回环地址
      if (addr.family === "IPv4" && !addr.internal) {
        return addr.address;
      }
    }
  }
  return "localhost"; // 如果没有找到有效的地址
}

app.use(express.static(path.join(__dirname, "client")));

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    // 广播消息给所有连接的客户端
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        // 可以将消息封装为对象并序列化 , timestamp: new Date()
        const dataToSend = { message: message };
        client.send(JSON.stringify(dataToSend));
      }
    });
  });
});

const PORT = 3000;
const localIP = getLocalIPAddress(); // 获取本地 IP 地址
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Access the app on http://${localIP}:${PORT}`); // 打印本地 IP 地址
});
