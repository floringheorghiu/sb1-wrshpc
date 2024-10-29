import type { PluginToUIMessage, UIToPluginMessage } from '../types/messages';

export function sendToUI(message: PluginToUIMessage) {
  figma.ui.postMessage(message);
}

export function setupMessageHandlers(controller: PluginController) {
  figma.ui.onmessage = async (message: UIToPluginMessage) => {
    switch (message.type) {
      case 'generate-docs':
        try {
          await controller.generateDocumentation(message.options.scope);
        } catch (error) {
          sendToUI({
            type: 'generation-error',
            error: error.message,
            canResume: false
          });
        }
        break;

      case 'cancel-generation':
        controller.cancelGeneration();
        break;

      default:
        console.error('Unknown message type:', message.type);
    }
  };
}