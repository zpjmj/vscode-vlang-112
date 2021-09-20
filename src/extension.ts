import * as vscode from 'vscode';
import { workspace, ConfigurationChangeEvent } from 'vscode';
import { activateVls112, deactivateVls112, isVls112Enabled } from './vls-112';

export function activate(context: vscode.ExtensionContext) {

	console.log('"vscode-vlang-112" is now active!');

	workspace.onDidChangeConfiguration((e: ConfigurationChangeEvent) => {
		if (e.affectsConfiguration('v-112.vls-112.enable')) {
			if (isVls112Enabled()) {
				//激活vls-112
				void activateVls112(context);
			} else {
				//禁用vls-112
				void deactivateVls112();
			}
		}
	});
}

export function deactivate() { }