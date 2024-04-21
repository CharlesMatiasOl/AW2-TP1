import { fileURLToPath } from 'url';
import express from 'express';
import os from 'os';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

// Definir rota para gerar o relatório
app.get('/gerar-relatorio', (req, res) => {
    // Gerar o relatório
    const relatorio = gerarRelatorio();
    
    // Criar o diretório 'relatorios' se ele não existir
    const relatoriosDir = path.join(__dirname, 'relatorios');
    if (!fs.existsSync(relatoriosDir)) {
        fs.mkdirSync(relatoriosDir);
    }
    
    // Armazenar o relatório em um arquivo
    const filePath = path.join(relatoriosDir, `relatorio_${new Date().getTime()}.txt`);
    fs.writeFileSync(filePath, relatorio);

    // Enviar resposta ao cliente
    res.send('Relatório gerado com sucesso!');
});


// Função para gerar o relatório do estado do servidor
function gerarRelatorio() {
    const uptime = os.uptime();
    const uptimeString = formatarTempo(uptime);

    const relatorio = `
        Data completa do relatório: ${new Date().toLocaleString()}
        Início de atividade do servidor: ${new Date(Date.now() - uptime * 1000).toLocaleString()}
        Tempo que o servidor esteve ativo: ${uptimeString}
        Informações sobre CPU: ${JSON.stringify(os.cpus())}
        Memória RAM total: ${formatarBytes(os.totalmem())}
        Memória RAM utilizada: ${formatarBytes(os.totalmem() - os.freemem())}
        Interfaces de rede: ${JSON.stringify(os.networkInterfaces())}
    `;

    return relatorio;
}

// Função para formatar o tempo em segundos para um formato legível
function formatarTempo(segundos) {
    const dias = Math.floor(segundos / (3600 * 24));
    const horas = Math.floor((segundos % (3600 * 24)) / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    return `${dias} dias, ${horas} horas, ${minutos} minutos e ${segundosRestantes} segundos`;
}

// Função para formatar bytes para um formato legível
function formatarBytes(bytes) {
    const unidades = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    let index = 0;
    while (bytes >= 1024 && index < unidades.length - 1) {
        bytes /= 1024;
        index++;
    }

    return `${bytes.toFixed(2)} ${unidades[index]}`;
}

// Iniciar o servidor na porta especificada
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
