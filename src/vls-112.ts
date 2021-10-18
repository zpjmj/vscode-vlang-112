import { ExtensionContext, workspace, window } from 'vscode';
import { getWorkspaceConfig } from './utils';
import * as cp from 'child_process';
import {
    LanguageClient,
    ServerOptions,
    StreamInfo,
    LanguageClientOptions
} from 'vscode-languageclient/node';
import * as net from 'net';

let shouldSpawnProcess = true;
let vls112Process: cp.ChildProcess;
let client: LanguageClient;

//检查是否允许启用vls112
export function isVls112Enabled(): boolean {
    return getWorkspaceConfig().get<boolean>('vls-112.enable') ?? false;
}

//启动vsl112
export async function activateVls112(context: ExtensionContext): Promise<void> {
    console.log('准备启动语言服务器`vls-112`');
    if (!isVls112Enabled()) {
        console.log('请修改V-112插件的配置项,以启用语言服务器`vls-112`');
        return undefined;
    }

    const customVls112Path = getWorkspaceConfig().get<string>('vls-112.customPath');
    if (!customVls112Path) {
        console.log('请配置vls-112可执行文件路径');
        return undefined;
    } else {
        console.log('以获取vls-112可执行文件路径:' + customVls112Path);
        connectVls112(customVls112Path, context);
    }
}
//禁用vsl112
export async function deactivateVls112(): Promise<void> {
    console.log('deactivateVls112');
}

export function connectVls112(vls112Path: string, context: ExtensionContext): void {
    const args: string[] = [];
    const isDebug = getWorkspaceConfig().get<boolean>('vls-112.debug');
    const connectionMode = getWorkspaceConfig().get<string>('vls-112.connectionMode');
    const tcpPort = getWorkspaceConfig().get<number>('vls-112.tcpMode.port');

    if (isDebug) {
        console.log('配置vls-112启动参数`--debug`');
        args.push('--debug');
    }

    if (connectionMode === 'tcp') {
        console.log('配置vls-112启动参数`--socket` ' + `--port=${tcpPort}`);
        args.push('--socket');
        args.push(`--port=${tcpPort}`);
        shouldSpawnProcess = false;
    }

    args.push('--loglv=2');

    if (shouldSpawnProcess) {
        console.log('Spawning VLS process...');
        vls112Process = cp.spawn(vls112Path.trim(), args);
    }

    const serverOptions: ServerOptions = connectionMode === 'tcp'
        ? () => connectVls112ViaTcp(tcpPort!)
        : () => Promise.resolve(vls112Process);

    // LSP Client options
    const clientOptions: LanguageClientOptions = {
        //documentSelector: [{ scheme: 'file', language: 'v'}],
        documentSelector: [{ scheme: 'file', pattern: '**/*.{v,vsh,vv}' }],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher('**/*.v')
        },
    };

    client = new LanguageClient(
        'V Language Server 112',
        serverOptions,
        clientOptions,
        true
    );

    client.onReady()
        .then(() => {
            window.setStatusBarMessage('V language server 112 已经就绪.', 3000);
        })
        .catch(() => {
            window.setStatusBarMessage('V language server 112 初始化失败.', 3000);
        });

    context.subscriptions.push(client.start());
}

function connectVls112ViaTcp(port: number): Promise<StreamInfo> {
    const socket = net.connect({ port });
    const result: StreamInfo = {
        writer: socket,
        reader: socket
    };
    return Promise.resolve(result);
}
