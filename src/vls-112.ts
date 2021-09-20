import { ExtensionContext } from 'vscode';
import { getWorkspaceConfig } from './utils';

//检查是否开启vls112
export function isVls112Enabled(): boolean {
    return getWorkspaceConfig().get<boolean>('vls-112.enable') ?? false;
}

//启动vsl112
export async function activateVls112(context: ExtensionContext): Promise<void> {
    console.log('activateVls112');
    if (!isVls112Enabled()) {
        return undefined;
    }

    const customVlsPath = getWorkspaceConfig().get<string>('vls-112.customPath');
    console.log('customVlsPath');
    console.log(customVlsPath);

    if (!customVlsPath) {
        return undefined;
    } else {
        connectVls(customVlsPath, context);
    }
}
//禁用vsl112
export async function deactivateVls112(): Promise<void> {
    console.log('deactivateVls112');
}

export function connectVls(pathToVls: string, context: ExtensionContext): void {
    console.log('connectVls');
}