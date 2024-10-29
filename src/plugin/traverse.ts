type TraverseFilter = (node: SceneNode) => boolean;

export function traverse(
  node: BaseNode,
  filter: TraverseFilter
): SceneNode[] {
  const nodes: SceneNode[] = [];

  function walk(current: BaseNode) {
    if ('children' in current) {
      for (const child of current.children) {
        if ('type' in child) {
          if (filter(child)) {
            nodes.push(child);
          }
        }
        walk(child);
      }
    }
  }

  walk(node);
  return nodes;
}