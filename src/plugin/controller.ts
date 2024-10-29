import { traverse } from './traverse';
import { DocumentationChunk, InteractionData } from '../types/documentation';
import { sendToUI } from './messaging';

export class PluginController {
  private isGenerating = false;
  private shouldCancel = false;

  async generateDocumentation(scope: 'current' | 'all') {
    if (this.isGenerating) {
      throw new Error('Documentation generation already in progress');
    }

    try {
      this.isGenerating = true;
      this.shouldCancel = false;

      const pages = scope === 'current' 
        ? [figma.currentPage]
        : figma.root.children;

      let totalNodes = 0;
      pages.forEach(page => {
        totalNodes += traverse(page, () => true).length;
      });

      let processedNodes = 0;

      for (const page of pages) {
        if (this.shouldCancel) {
          sendToUI({
            type: 'generation-error',
            error: 'Generation cancelled',
            canResume: true,
            pageId: page.id
          });
          return;
        }

        try {
          await this.processPage(page, processedNodes, totalNodes);
          processedNodes += traverse(page, () => true).length;
        } catch (error) {
          sendToUI({
            type: 'generation-error',
            error: error.message,
            canResume: true,
            pageId: page.id
          });
          return;
        }
      }

      sendToUI({
        type: 'generation-complete',
        stats: {
          totalPages: pages.length,
          totalNodes: totalNodes,
          totalInteractions: processedNodes
        }
      });

    } finally {
      this.isGenerating = false;
      this.shouldCancel = false;
    }
  }

  private async processPage(page: PageNode, processedNodes: number, totalNodes: number) {
    const nodes = traverse(page, (node) => {
      return 'reactions' in node && node.reactions.length > 0;
    });

    for (const node of nodes) {
      if (this.shouldCancel) return;

      const chunk = this.createDocumentationChunk(node as FrameNode | ComponentNode);
      
      sendToUI({
        type: 'chunk-loaded',
        chunk
      });

      processedNodes++;
      
      sendToUI({
        type: 'generation-progress',
        pageId: page.id,
        progress: Math.round((processedNodes / totalNodes) * 100),
        processedNodes
      });

      // Prevent UI freezing
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  private createDocumentationChunk(node: FrameNode | ComponentNode): DocumentationChunk {
    const interactions: InteractionData[] = node.reactions.map(reaction => ({
      trigger: {
        type: reaction.trigger.type,
        metadata: this.getReactionMetadata(reaction.trigger)
      },
      action: {
        type: reaction.action.type,
        metadata: this.getActionMetadata(reaction.action)
      }
    }));

    return {
      pageId: node.parent?.id || '',
      nodeId: node.id,
      name: node.name,
      type: node.type,
      interactions,
      timestamp: Date.now(),
      version: 1
    };
  }

  private getReactionMetadata(trigger: Trigger) {
    switch (trigger.type) {
      case 'HOVER':
        return {
          delay: trigger.delay,
          preventDefault: trigger.preventDefault
        };
      case 'CLICK':
        return {
          preventDefault: trigger.preventDefault
        };
      case 'AFTER_TIMEOUT':
        return {
          timeout: trigger.timeout
        };
      default:
        return {};
    }
  }

  private getActionMetadata(action: Action) {
    switch (action.type) {
      case 'NAVIGATE':
        return {
          destination: action.destination,
          transition: action.transition
        };
      case 'OPEN_OVERLAY':
        return {
          overlay: action.overlay?.name
        };
      default:
        return {};
    }
  }

  cancelGeneration() {
    this.shouldCancel = true;
  }
}