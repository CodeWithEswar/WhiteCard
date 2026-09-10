import { normalizeSafePath } from './archive-security'
import { formatBytes } from '@/features/search/search.utils'

export interface ArchiveTreeNode {
  name: string
  path: string
  dir: boolean
  size: number
  formattedSize: string
  children: ArchiveTreeNode[]
  directFileCount: number
  directDirCount: number
}

export interface FlatArchiveEntry {
  path: string
  name: string
  dir: boolean
  size: number
}

/**
 * Builds a hierarchical virtual tree from flat archive paths.
 * Guarantees folders appear first, followed by alphabetical files.
 */
export function buildVirtualTree(rawEntries: FlatArchiveEntry[]): ArchiveTreeNode {
  const root: ArchiveTreeNode = {
    name: 'root',
    path: '',
    dir: true,
    size: 0,
    formattedSize: '0 B',
    children: [],
    directFileCount: 0,
    directDirCount: 0,
  }

  // Directory lookup map to quickly find parent nodes
  const dirMap = new Map<string, ArchiveTreeNode>()
  dirMap.set('', root)

  // Sort raw entries so parent directories are registered before children
  const sortedRaw = [...rawEntries].sort((a, b) => {
    const depthA = a.path.split('/').length
    const depthB = b.path.split('/').length
    if (depthA !== depthB) return depthA - depthB
    return a.path.localeCompare(b.path)
  })

  // First pass: create all directories in the tree
  for (const entry of sortedRaw) {
    const safePath = normalizeSafePath(entry.path)
    if (!safePath) continue

    const parts = safePath.split('/')

    // Ensure all ancestor directory nodes exist
    let currentPath = ''
    for (let i = 0; i < parts.length - (entry.dir ? 0 : 1); i++) {
      const part = parts[i]
      const nextPath = currentPath ? `${currentPath}/${part}` : part

      if (!dirMap.has(nextPath)) {
        const parentNode = dirMap.get(currentPath) || root
        const newDirNode: ArchiveTreeNode = {
          name: part,
          path: nextPath,
          dir: true,
          size: 0,
          formattedSize: '-',
          children: [],
          directFileCount: 0,
          directDirCount: 0,
        }
        parentNode.children.push(newDirNode)
        parentNode.directDirCount += 1
        dirMap.set(nextPath, newDirNode)
      }
      currentPath = nextPath
    }

    // If it's a file, add it under its parent directory
    if (!entry.dir) {
      const parentPath = parts.slice(0, -1).join('/')
      const fileName = parts[parts.length - 1]
      const parentNode = dirMap.get(parentPath) || root

      const fileNode: ArchiveTreeNode = {
        name: fileName,
        path: safePath,
        dir: false,
        size: entry.size,
        formattedSize: formatBytes(entry.size),
        children: [],
        directFileCount: 0,
        directDirCount: 0,
      }
      parentNode.children.push(fileNode)
      parentNode.directFileCount += 1
      parentNode.size += entry.size
    }
  }

  // Recursive sort: folders first, then files alphabetically
  function sortTreeNodes(node: ArchiveTreeNode) {
    node.children.sort((a, b) => {
      if (a.dir && !b.dir) return -1
      if (!a.dir && b.dir) return 1
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    })

    for (const child of node.children) {
      if (child.dir) {
        sortTreeNodes(child)
      }
    }
  }

  sortTreeNodes(root)
  return root
}

/**
 * Retrieves children at a given normalized directory path.
 * If at root (''), returns root children.
 */
export function getChildrenAtDirectory(
  root: ArchiveTreeNode,
  directoryPath: string
): ArchiveTreeNode[] {
  const safePath = normalizeSafePath(directoryPath)
  if (!safePath) return root.children

  const parts = safePath.split('/')
  let current: ArchiveTreeNode | undefined = root

  for (const part of parts) {
    current = current.children.find((c) => c.dir && c.name.toLowerCase() === part.toLowerCase())
    if (!current) return []
  }

  return current.children
}

/**
 * Finds a specific node (file or directory) by path.
 */
export function getNodeAtPath(
  root: ArchiveTreeNode,
  targetPath: string
): ArchiveTreeNode | null {
  const safePath = normalizeSafePath(targetPath)
  if (!safePath) return root

  const parts = safePath.split('/')
  let current: ArchiveTreeNode | undefined = root

  for (let i = 0; i < parts.length; i++) {
    const isLast = i === parts.length - 1
    const part = parts[i]

    current = current.children.find(
      (c) => c.name.toLowerCase() === part.toLowerCase() && (isLast || c.dir)
    )
    if (!current) return null
  }

  return current
}
