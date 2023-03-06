const electron = require('electron');
const { app, BrowserWindow } = electron;

var win;
var args = process.argv.slice(1);
var serve = args.some((val) => val === '--serve');

function createWindow () {
    //Create the browser window
    win = new BrowserWindow({
        width: 800,
        height: 500,
        autoHideMenuBar: true,
        resizable: false,
        show: false
    })

    win.once('ready-to-show', () => {
        win.show();
    })

    if(serve){
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`)
        });
        win.loadURL('http://localhost:5200');
    }
    else {
        win.loadURL(`file://${__dirname}/dist/fitness-center-qrcode-scanner/index.html`);
    }

    //Uncomment below to open the DevTools.
    // win.webContents.openDevTools();
    
    //Event when the window is closed.
    win.on('closed', () => {
        win = null;
    })
}

//Create window on electron initialization
app.on('ready', createWindow);
