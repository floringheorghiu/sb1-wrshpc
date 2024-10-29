import type { DocumentationChunk, Scope } from './documentation';

export type UIToPluginMessage =
  | {
      type: 'generate-docs';
      options: {
        scope: Scope;
      };
    }
  | {
      type: 'cancel-generation';
    };

export type PluginToUIMessage =
  | {
      type: 'generation-progress';
      pageId: string;
      progress: number;
      processedNodes: number;
    }
  | {
      type: 'chunk-loaded';
      chunk: DocumentationChunk;
    }
  | {
      type: 'generation-error';
      error: string;
      canResume: boolean;
      pageId?: string;
    }
  | {
      type: 'generation-complete';
      stats: {
        totalPages: number;
        totalNodes: number;
        totalInteractions: number;
      };
    };