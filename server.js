const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

let filaAtendimento = [];
let ultimaChamada = { senha: '---', balcao: '---', lingua: 'pt' };

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/balcao', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'balcao.html'));
});

app.get('/tv', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tv.html'));
});

// Check-in com fuso horário estrito de Cabo Verde (Atlantic/Cape_Verde)
app.post('/api/checkin', (req, res) => {
  const { serviceCode, language, whatsapp } = req.body;
  
  const dataCV = new Date().toLocaleString('en-US', { timeZone: 'Atlantic/Cape_Verde' });
  const timestampCV = new Date(dataCV).toISOString();
  const senhaGerada = `${serviceCode}-${Math.floor(100 + Math.random() * 900)}`;
  
  filaAtendimento.push({
    senha: senhaGerada,
    servico: serviceCode,
    lingua: language || 'cv',
    whatsapp: whatsapp || 'N/A',
    dataHora: timestampCV,
    estado: 'AGUARDANDO'
  });

  res.json({ status: 'success', senha: senhaGerada, timestamp: timestampCV, fuso: 'Atlantic/Cape_Verde' });
});

app.post('/api/chamar', (req, res) => {
  const { balcao } = req.body;
  if (filaAtendimento.length > 0) {
    const proximo = filaAtendimento.shift();
    proximo.estado = 'EM_ATENDIMENTO';
    proximo.balcaoAtribuido = balcao || 'Balcão 01';
    
    ultimaChamada = {
      senha: proximo.senha,
      balcao: proximo.balcaoAtribuido,
      lingua: proximo.lingua,
      servico: proximo.servico
    };
    res.json({ status: 'success', chamado: ultimaChamada });
  } else {
    res.json({ status: 'empty', message: 'Nenhum cidadão em espera na fila.' });
  }
});

app.get('/api/estado-tv', (req, res) => {
  res.json({ ultimaChamada, filaEspera: filaAtendimento.length });
});

app.listen(PORT, () => {
  console.log(`[PORTO DA PRAIA] Servidor unificado ativo na porta ${PORT} (Fuso: Atlantic/Cape_Verde)`);
});
