export type InteractionTrigger = 
  | 'click'
  | 'hover'
  | 'timeout'
  | 'drag'
  | 'key'
  | 'scroll'
  | 'swipe';

export type ActionType =
  | 'navigate'
  | 'overlay'
  | 'animation'
  | 'state-change'
  | 'component-swap'
  | 'smart-animate';

export interface InteractionMetadata {
  delay?: number;
  duration?: number;
  easing?: string;
  preventDefault?: boolean;
  keyboard?: {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
  };
  gesture?: {
    direction?: 'up' | 'down' | 'left' | 'right';
    distance?: number;
  };
}

export interface ActionMetadata {
  destination?: string;
  overlay?: string;
  animation?: {
    type: string;
    duration: number;
    easing: string;
  };
  state?: {
    from: string;
    to: string;
  };
  component?: {
    from: string;
    to: string;
  };
}

export interface Interaction {
  trigger: InteractionTrigger;
  action: ActionType;
  metadata?: InteractionMetadata;
  actionMetadata?: ActionMetadata;
  description?: string;
}

export interface DocumentationItem {
  id: string;
  name: string;
  type: string;
  interactions: Interaction[];
  path?: string[];
  constraints?: {
    horizontal: string;
    vertical: string;
  };
  isComponent?: boolean;
  componentProperties?: Record<string, any>;
}

export type Scope = 'current' | 'all';