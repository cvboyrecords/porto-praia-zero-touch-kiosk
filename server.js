const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ONLINE', system: 'Porto da Praia Zero Touch Kiosk', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[PORTO PRAIA KIOSK] Servidor a correr na porta ${PORT}`);
});
