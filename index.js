const express = require('express');
const { Atem } = require('atem-connection');

const app = express();
const port = 55555;
app.use(express.json());

const atemIP = '192.168.5.206';
const atem = new Atem();

let isConnected = false;

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

atem.on('connected', () => {
    isConnected = true;
    console.log(`Verbindung zu Atem ${atemIP} hergestellt.`);
});

atem.on('disconnected', () => {
    isConnected = false;
    console.log(`Verbindug zum Atem ${atemIP} abgebrochen. Versuche neu zu verbinden...`);
});

function connectWithRetry() {
    if (!isConnected) {
        try {
            atem.connect(atemIP);
        } catch (err) {console.log(err)};
    };
};

connectWithRetry();
setInterval(connectWithRetry, 5000);

async function scheduledStreamStart() {
    if (isConnected) {
        const now = new Date();
        if (now.getDay() == 0 && now.getHours() == 11 && now.getMinutes() == 55) {
            await Promise.all([
                atem.setClassicAudioMixerInputProps(1, {mixOption: 0}),
                atem.setClassicAudioMixerInputProps(2, {mixOption: 1}),
                atem.changeProgramInput(1),
                atem.fadeToBlack()
            ])
                .then(() => console.log('1/2 Schritte für Stream Start fertig. Warte 3 Sekunden...'))
                .catch(err => console.log(`Error beim starten vom Stream bei Schritt 1/2: ${err.message}`));
            await wait(3000);
            await atem.startStreaming()
                .then(() => console.log('Schritt 2/2 für Stream Start fertig. Stream läuft.'))
                .catch(err => console.log(`Fehler beim starten vom Stream bei Schritt 2/2: ${err.message}`));
        };
    };
};
scheduledStreamStart();
setInterval(scheduledStreamStart, 5000);

// Change Camera PROGRAM
app.post('/api/program/:id', (req, res) => {
    const input = parseInt(req.params.id);
    atem.changeProgramInput(input)
        .then(() => res.send({status: 'success', input}))
        .catch(err => res.status(500).send({status: 'error', message: err.message}));
});

// Change Camera PREVIEW
app.post('/api/preview/:id', (req, res) => {
    const input = parseInt(req.params.id);
    if (input == 1 || input == 2 || input == 3 || input == 4) {
        atem.changePreviewInput(input)
            .then(() => res.send({status: 'success', input}))
            .catch(err => res.status(500).send({status: 'error', message: err.message}));
    } else res.status(400).send({status: 'error', message: 'The allowed values are 1, 2, 3, 4'});
});

// Fade To Black
app.post('/api/ftb', (req, res) => {
    atem.fadeToBlack()
        .then(() => res.send({status: 'success'}))
        .catch(err => res.status(500).send({status: 'error', message: err.message}));
});

// Change Audio Input
app.post('/api/audio/:id', (req, res) => {
    const input = parseInt(req.params.id);
    if (input == 1 || input == 2) {
        const props1 = {mixOption: input === 1 ? 1 : 0};
        const props2 = {mixOption: input === 2 ? 1 : 0};

        Promise.all([
            atem.setClassicAudioMixerInputProps(1, props1),
            atem.setClassicAudioMixerInputProps(2, props2)
        ])
            .then(() => res.send({status: 'success', activeInput: input}))
            .catch(err => res.status(500).send({status: 'error', message: err.message}));
    } else res.status(400).send({status: 'error', message: 'The allowed values are 1 (Aux 1 - Mixer) or 2 (Aux 2 - PC)'});
});

// Set Chroma Key State
app.post('/api/key/:state', (req, res) => {
    const input = parseInt(req.params.state);
    if (input == 0 || input == 1) {
        const onAir = input === 1;
        atem.setUpstreamKeyerOnAir(onAir, 0, 0)
                .then(() => res.send({status: 'success', input}))
                .catch(err => res.status(500).send({status: 'error', message: err.message}));
    } else res.status(400).send({status: 'error', message: 'The allowed values are 1 (on) or 0 (off)!'});
});

// Switch Preview and Program
app.post('/api/auto', (req, res) => {
    atem.autoTransition()
        .then(() => res.send({status: 'success'}))
        .catch(err => res.status(500).send({status: 'error', message: err.message}));
});

// Start Streaming
app.post('/api/stream/start', (req, res) => {
    atem.startStreaming()
        .then(() => res.send({status: 'success'}))
        .catch(err => res.status(500).send({status: 'error', message: err.message}));
});

app.listen(port, () => {
    console.log(`CGN ATEM REST API läuft auf port ${port}`);
});