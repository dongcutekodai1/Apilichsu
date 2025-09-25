const axios = require('axios');
const express = require('express');

const app = express();
const PORT = 3000;
const API_URL = 'https://hitclub-historyprohdx.onrender.com/api/md5';

let dataList = [];
let lastPhien = null;

// Gọi API
const fetchData = async () => {
  try {
    const { data } = await axios.get(API_URL);
    if (!data || !data.Phien) return;

    if (lastPhien === null) {
      lastPhien = data.Phien;
      dataList.push(data);
      console.log(`🔄 Thu thập Phien đầu tiên: ${data.Phien}`);
    }

    if (data.Phien !== lastPhien) {
      lastPhien = data.Phien;
      dataList.unshift(data);
      if (dataList.length > 50) dataList.pop();
      console.log(`🟢 Mới: Phien ${data.Phien} - Tổng: ${dataList.length}`);
    }
  } catch (err) {
    console.error('🔴 Lỗi API:', err.message);
  }
};

// Lặp lại mỗi 2 giây
setInterval(fetchData, 2000);

// Route ping cho UptimeRobot
app.get('/', (req, res) => {
  res.send('Server is alive!');
});

// Trả kết quả theo format: [{}]
app.get('/history', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const lines = dataList.map(item => JSON.stringify(item));
  const response = '[' + lines.join(',\n') + ']';

  res.send(response);
});

app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
