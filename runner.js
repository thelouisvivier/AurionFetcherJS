const credFetcher = require('./core/credFetcher.js')
const eventsFetcher = require('./core/eventsFetcher.js')
const eventsFormater = require('./core/eventsFormater.js')
const eventsSync = require('./core/eventsSync.js')
const notify = require('./core/notify.js')
const server = require('./core/server.js')
const config = require('./config/config.json')

var trail = {};

async function runner() {
    try {
        await credFetcher(trail);
    }
    catch(error) {
        console.error(error+"\nTrying again in 20min");
        notify.onError(error);
        setTimeout(runner,1200*1000);//20min
        return;
    }
    try {
        await eventsFetcher(trail);
    }
    catch(error) {
        console.error(error+"\nTrying again in 20min");
        notify.onError(error);
        setTimeout(runner,1200*1000);//20min
        return;
    }
    try {
        await eventsFormater(trail);
    }
    catch(error) {
        console.error(error+"\nTrying again in 20min");
        notify.onError(error);
        setTimeout(runner,1200*1000);//20min
        return;
    }
    try {
        await eventsSync(trail);
    }
    catch(error) {
        console.error(error+"\nTrying again in 20min");
        notify.onError(error);
        setTimeout(runner,1200*1000);//20min
        return;
    }
    try {
        await notify.onSync(trail);
    }
    catch(error) {
        console.error(error+"\nTrying again in 20min");
        notify.onError(error);
        setTimeout(runner,1200*1000);//20min
        return;
    }
    setTimeout(runner, config.refreshInterval*1000);
}

server();
notify.onBoot();
runner();
