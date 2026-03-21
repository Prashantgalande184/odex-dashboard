import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

const MONITORING_URLS = [
  { name: 'in.odex.global', url: 'https://in.odexglobal.com/' },
  { name: 'QC Auth', url: 'https://qctest.odexglobal.com/auth' },
  { name: 'QC API', url: 'https://qctest.odexglobal.com/api' },
  { name: 'QC OPC', url: 'https://qctest.odexglobal.com/opc' },
  { name: 'QC Zipkin', url: 'https://qctest.odexglobal.com/zipkin' },
  { name: 'QC Kibana', url: 'https://qctest.odexglobal.com/kibana' },
  { name: 'QC MFT', url: 'https://qctest.odexglobal.com/mft' },
  { name: 'QC CPP', url: 'https://qctest.odexglobal.com/cpp' },
  { name: 'QC HL', url: 'https://qctest.odexglobal.com/hl' },
  { name: 'QC Main', url: 'https://qctest.odexglobal.com' },
  { name: 'QC Kafka UI', url: 'https://qckafkaui.odexglobal.com' },
  { name: 'QC Grafana', url: 'https://qcgrafana.odexglobal.com' },
  { name: 'QC Payments', url: 'https://qc-payments.odexglobal.com' },
  { name: 'QC Payments ALT', url: 'https://www.qctest.odexglobal.com' },
  { name: 'TPDCS OPC Auth', url: 'https://qctest.tpdcs.com/opc-auth' },
  { name: 'TPDCS API', url: 'https://qctest.tpdcs.com/api' },
  { name: 'TPDCS Main', url: 'https://qctest.tpdcs.com' },
  { name: 'TPDCS ALT', url: 'https://www.qctest.tpdcs.com' },
  { name: 'QC Test 2786', url: 'https://qctest2786.odexglobal.com/api' },
  { name: 'QC Payment Svc', url: 'https://qctest-payment.odexglobal.com/api' },
];

app.get('/api/health-check', async (req, res) => {
  const results = await Promise.all(
    MONITORING_URLS.map(async (service) => {
      try {
        const start = Date.now();
        const response = await fetch(service.url, { 
          method: 'GET',
          timeout: 5000 
        });
        const responseTime = Date.now() - start;
        const statusCode = response.status;
        const isOnline = statusCode >= 200 && statusCode < 300;
        
        return { ...service, isOnline, responseTime, statusCode };
      } catch (error) {
        return { 
          ...service, 
          isOnline: false, 
          responseTime: null, 
          statusCode: 'ERROR' 
        };
      }
    })
  );
  
  res.json(results);
});

app.listen(3001, () => {
  console.log('Health check server running on http://localhost:3001');
});
