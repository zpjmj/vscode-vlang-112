import * as vscode from 'vscode';
import { workspace, ConfigurationChangeEvent } from 'vscode';
import { activateVls112, deactivateVls112, isVls112Enabled } from './vls-112';

export function activate(context: vscode.ExtensionContext) {

	console.log('`vscode-vlang-112` 插件已启动!');

	const restartVls112 = vscode.commands.registerCommand('v-112.vls-112.restart', () => {
		const restartMsg = vscode.window.setStatusBarMessage('Restarting VLS-112...', 3000);
		deactivateVls112()
			.then(() => { 
				restartMsg.dispose(); 
			})
			.then(() => activateVls112(context))
			.catch((err) => vscode.window.showErrorMessage(err));
	});

	context.subscriptions.push(restartVls112);

	workspace.onDidChangeConfiguration((e: ConfigurationChangeEvent) => {
		if (e.affectsConfiguration('v-112.vls-112.enable')) {
			if (isVls112Enabled()) {
				//激活vls-112
				activateVls112(context);
			} else {
				//禁用vls-112
				deactivateVls112();
			}
		}
	});

	//初次启动
	const shouldEnableVls = isVls112Enabled();
	if (shouldEnableVls) {
		activateVls112(context);
	}
}

export function deactivate() { }