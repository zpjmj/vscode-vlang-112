import {
    workspace,
    WorkspaceConfiguration,
    WorkspaceFolder,
    Uri,
    TextDocument,
    window
} from 'vscode';

//获取配置项
export function getWorkspaceConfig(): WorkspaceConfiguration {
    const currentWorkspaceFolder = getWorkspaceFolder();
    return workspace.getConfiguration('v-112', currentWorkspaceFolder.uri);
}


/** Get workspace of current document.
 * @param uri The URI of document
 */
export function getWorkspaceFolder(uri?: Uri): WorkspaceFolder {
    if (uri) {
        return workspace.getWorkspaceFolder(uri)!;
    } else {
        const currentDoc = getCurrentDocument();

        if (currentDoc) {
            return workspace.getWorkspaceFolder(currentDoc.uri)!;
        } else {
            if (workspace.workspaceFolders) {
                if (workspace.workspaceFolders.length > 0) {
                    return workspace.workspaceFolders[0];
                } else {
                    return undefined!;
                }
            } else {
                return undefined!;
            }
        }
    }
}

export function getCurrentDocument(): TextDocument {
    return window.activeTextEditor ? window.activeTextEditor.document : null!;
}