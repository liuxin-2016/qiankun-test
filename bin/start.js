/**
 * 启动所有微应用开发环境下服务
 */
const fs = require('fs')
const path = require('path')
const util = require('util')

const sub_app_path = path.resolve();

const sub_apps = fs.readdirSync(sub_app_path).filter(i => /^main|app-vue/.test(i));

console.info(`[hm-install-all] 即将进入所有模块并启动服务：${JSON.stringify(sub_apps)} ing...`)

const exec = util.promisify(require('child_process').exec);

const maxBufferLength = 2000 * 1024

function start() {
    sub_apps.forEach(async i => {
        if (!fs.existsSync(`${i}/package.json`)) {
            console.log(`[${i}] 应用缺少package.json文件，将跳过此应用`)
            return false;
        }
        if (!fs.existsSync(`${i}/node_modules`)) {
            console.log(`[${i}] 应用未检测到node_modules目录，将跳过此应用`)
            return;
        }
        let packageJson = fs.readFileSync(`${i}/package.json`).toString();
        let packageData = JSON.parse(packageJson);
        console.log(`[${i}] 开始启动... 端口：${packageData.devPort} 全部启动需要时间，请稍加等候，或刷新浏览器即可`)
        await exec('npm run start', { cwd: path.resolve(i), maxBuffer: maxBufferLength });
    });
    const packageJson = fs.readFileSync('main/package.json').toString();
    const packageData = JSON.parse(packageJson);
    exec(`start http://localhost:${packageData.devPort}`);
}
start();

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
