const messagesDiv = document.getElementById("messages");
const input = document.getElementById("input");
const ws = new WebSocket(`ws://${window.location.host}`);

ws.onmessage = function (event) {
  const message = document.createElement("div");
  // 将 event.data 序列化为字符串
  // 解析接收到的消息为对象
  const parsedData = JSON.parse(event.data);
  // 获取 data 数组并转换为 Uint8Array
  const byteArray = new Uint8Array(parsedData.message.data);
  // 使用 TextDecoder 解码字节数组为字符串
  const decoder = new TextDecoder("utf-8"); // 指定编码为 UTF-8
  const stringMessage = decoder.decode(byteArray);
  message.textContent = stringMessage;
  messagesDiv.appendChild(message);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // 滚动到底部
};

input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    ws.send(input.value);
    input.value = "";
  }
});
