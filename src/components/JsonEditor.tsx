import React, { useState, useEffect, useRef } from 'react';
import { useSave } from '../contexts/SaveContext';

// Component props
interface JsonEditorProps {
  isActive: boolean;
}

// JSON node types
interface JsonNode {
  key: string;
  path: string;
  value: any;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  depth: number;
  expanded: boolean;
  children?: JsonNode[];
}

const JsonEditorComponent: React.FC<JsonEditorProps> = ({ isActive }) => {
  const { modifiedSaveData, updateSaveData } = useSave();
  const [jsonText, setJsonText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [lineCount, setLineCount] = useState<number>(0);
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const [parsed, setParsed] = useState<any>(null);
  const [isValidJson, setIsValidJson] = useState<boolean>(true);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchResult, setCurrentSearchResult] = useState<number>(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [jsonTree, setJsonTree] = useState<JsonNode[]>([]);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [preventTreeRebuild, setPreventTreeRebuild] = useState<boolean>(false);

  // Update textarea content when save data changes
  useEffect(() => {
    if (modifiedSaveData) {
      try {
        const formatted = JSON.stringify(modifiedSaveData, null, 2);
        setJsonText(formatted);
        setParsed(modifiedSaveData);
        setIsValidJson(true);
        setError(null);
        setUnsavedChanges(false);
        
        // Count number of lines
        setLineCount((formatted.match(/\n/g) || []).length + 1);
        
        // Parse the JSON into a tree structure for the collapsible view
        if (!preventTreeRebuild) {
          parseJsonToTree(modifiedSaveData);
        }
      } catch (e) {
        console.error('Error formatting JSON:', e);
        setError('Error formatting JSON');
      }
    }
  }, [modifiedSaveData, preventTreeRebuild]);

  // Parse JSON into a tree structure
  const parseJsonToTree = (jsonData: any) => {
    const rootNode: JsonNode[] = [];
    
    // Keep track of expanded states by path
    const expandedStates = new Map<string, boolean>();
    
    // Save current expanded states before rebuilding
    const saveExpandedStates = (nodes: JsonNode[]) => {
      nodes.forEach(node => {
        expandedStates.set(node.path, node.expanded);
        if (node.children && node.children.length > 0) {
          saveExpandedStates(node.children);
        }
      });
    };
    
    // Save existing expanded states if we have a tree
    if (jsonTree.length > 0) {
      saveExpandedStates(jsonTree);
    }
    
    // This buildTree function now uses collapsed state by default
    // All nodes will start collapsed on initial load
    // On subsequent updates, it will preserve the previous expanded/collapsed state
    const buildTree = (data: any, path: string = '', key: string = 'root', depth: number = 0) => {
      const type = Array.isArray(data) ? 'array' : typeof data === 'object' && data !== null ? 'object' : typeof data;
      
      // Check if this path was previously expanded
      // For initial load (empty jsonTree), keep everything collapsed by default
      // Otherwise use previously saved expansion state or collapse by default
      const wasExpanded = jsonTree.length > 0 
        ? (expandedStates.has(path) ? expandedStates.get(path) : false) 
        : false;
      
      const node: JsonNode = {
        key,
        path,
        value: data,
        type: type as any,
        depth,
        expanded: wasExpanded,
        children: [],
      };
      
      if (type === 'object' && data !== null) {
        node.children = Object.keys(data).map((k) => {
          const childPath = path ? `${path}.${k}` : k;
          return buildTree(data[k], childPath, k, depth + 1);
        });
      } else if (type === 'array') {
        node.children = data.map((item: any, index: number) => {
          const childPath = path ? `${path}[${index}]` : `[${index}]`;
          return buildTree(item, childPath, `${index}`, depth + 1);
        });
      }
      
      return node;
    };
    
    if (typeof jsonData === 'object' && jsonData !== null) {
      if (Array.isArray(jsonData)) {
        jsonData.forEach((item, index) => {
          rootNode.push(buildTree(item, `[${index}]`, `${index}`, 0));
        });
      } else {
        Object.keys(jsonData).forEach(key => {
          rootNode.push(buildTree(jsonData[key], key, key, 0));
        });
      }
    }
    
    setJsonTree(rootNode);
  };

  // Toggle node expansion
  const toggleNode = (path: string) => {
    const toggleNodeInTree = (nodes: JsonNode[]): JsonNode[] => {
      return nodes.map(node => {
        if (node.path === path) {
          return { ...node, expanded: !node.expanded };
        }
        
        if (node.children && node.children.length > 0) {
          return { ...node, children: toggleNodeInTree(node.children) };
        }
        
        return node;
      });
    };
    
    setJsonTree(toggleNodeInTree(jsonTree));
  };
  
  // Expand all nodes
  const expandAllNodes = () => {
    // Get total number of nodes to set a reasonable depth limit
    const countNodes = (nodes: JsonNode[]): number => {
      let count = nodes.length;
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          count += countNodes(node.children);
        }
      });
      return count;
    };
    
    const totalNodes = countNodes(jsonTree);
    const maxExpandDepth = totalNodes > 1000 ? 3 : totalNodes > 500 ? 4 : totalNodes > 200 ? 6 : 10;
    
    const expandNodes = (nodes: JsonNode[], currentDepth: number = 0): JsonNode[] => {
      return nodes.map(node => {
        // Only expand nodes up to the max depth to prevent performance issues
        const shouldExpand = currentDepth <= maxExpandDepth;
        
        if (node.children && node.children.length > 0) {
          return { 
            ...node, 
            expanded: shouldExpand, 
            children: expandNodes(node.children, currentDepth + 1) 
          };
        }
        return { ...node, expanded: shouldExpand };
      });
    };
    
    const expandedTree = expandNodes(jsonTree);
    setJsonTree(expandedTree);
    
    // Show a notification if we limited expansion
    if (totalNodes > 200) {
      alert(`Large JSON structure detected (${totalNodes} nodes). Expansion limited to ${maxExpandDepth} levels to prevent performance issues.`);
    }
  };
  
  // Collapse all nodes
  const collapseAllNodes = () => {
    const collapseNodes = (nodes: JsonNode[]): JsonNode[] => {
      return nodes.map(node => {
        if (node.children && node.children.length > 0) {
          return { ...node, expanded: false, children: collapseNodes(node.children) };
        }
        return { ...node, expanded: false };
      });
    };
    
    setJsonTree(collapseNodes(jsonTree));
  };

  // Focus search input when opened
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Search functionality in tree
  useEffect(() => {
    if (!searchTerm || !jsonText) {
      setSearchResults([]);
      setCurrentSearchResult(0);
      return;
    }

    const results: number[] = [];
    let index = -1;
    let text = jsonText.toLowerCase();
    const term = searchTerm.toLowerCase();

    while ((index = text.indexOf(term, index + 1)) !== -1) {
      results.push(index);
    }

    setSearchResults(results);
    setCurrentSearchResult(results.length > 0 ? 1 : 0);
  }, [searchTerm, jsonText]);

  const handleFormat = () => {
    try {
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
      setLineCount((formatted.match(/\n/g) || []).length + 1);
      setError(null);
      
      // Parse the JSON into a tree structure for the collapsible view
      parseJsonToTree(parsed);
    } catch (e) {
      console.error('Cannot format JSON:', e);
      setError('Cannot format JSON');
    }
  };

  const handleSave = () => {
    if (isValidJson && unsavedChanges) {
      try {
        updateSaveData('', parsed);
        setUnsavedChanges(false);
      } catch (e) {
        console.error('Error saving data:', e);
        setError('Error saving data');
      }
    }
  };

  // Navigate between search results - display a message for now since we're in tree view
  const navigateSearch = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = currentSearchResult % searchResults.length;
      if (newIndex === 0) newIndex = searchResults.length;
    } else {
      newIndex = currentSearchResult - 1;
      if (newIndex === 0) newIndex = searchResults.length;
    }

    setCurrentSearchResult(newIndex);
    
    // In tree view, we just display a message with the current search position
    alert(`Search result ${newIndex} of ${searchResults.length}\nUse text search to locate this result in the JSON data.`);
  };

  // Render node value
  const renderNodeValue = (node: JsonNode) => {
    // Check if this node is currently being edited
    if (editingNode === node.path) {
      return (
        <input
          className="tree-node-editor"
          type={node.type === 'number' ? 'number' : 'text'}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter') {
              saveNodeEdit(node);
            } else if (e.key === 'Escape') {
              setEditingNode(null);
            }
          }}
          onBlur={() => saveNodeEdit(node)}
          autoFocus
          onClick={(e) => e.stopPropagation()}
          style={{
            minWidth: '100px',
            fontFamily: 'monospace',
            fontSize: '15px',
          }}
        />
      );
    }
    
    // For non-objects and non-arrays, show editable value
    if (node.type !== 'object' && node.type !== 'array') {
      return (
        <span 
          className={`json-${node.type} editable-value`}
          onClick={(e) => {
            e.stopPropagation();
            startNodeEdit(node);
          }}
          title={`Edit value (${node.type})`}
        >
          {node.type === 'string' ? (
            <>
              <i className="fa fa-quote-left" style={{ fontSize: '8px', marginRight: '2px', opacity: 0.6 }}></i>
              <span>{node.value}</span>
              <i className="fa fa-quote-right" style={{ fontSize: '8px', marginLeft: '2px', opacity: 0.6 }}></i>
            </>
          ) : node.type === 'boolean' ? (
            <span>
              <i className={`fa fa-${node.value ? 'check' : 'times'}`} style={{ marginRight: '4px' }}></i>
              {node.value ? 'true' : 'false'}
            </span>
          ) : node.type === 'null' ? (
            <span>
              <i className="fa fa-ban" style={{ marginRight: '4px', opacity: 0.7 }}></i>
              null
            </span>
          ) : (
            <span>
              <i className="fa fa-hashtag" style={{ marginRight: '4px', opacity: 0.7, fontSize: '11px' }}></i>
              {node.value}
            </span>
          )}
        </span>
      );
    }
    
    // For objects and arrays, show collapsed/expanded state
    if (node.type === 'object') {
      return (
        <span className="json-object" title={`Object with ${Object.keys(node.value).length} properties`}>
          {node.expanded 
            ? <><i className="fa fa-circle-o" style={{ marginRight: '4px', opacity: 0.7 }}></i>{"{}"}</>
            : <><i className="fa fa-folder-o" style={{ marginRight: '4px' }}></i>{ `{ ${Object.keys(node.value).length} properties }` }</>
          }
        </span>
      );
    } else if (node.type === 'array') {
      return (
        <span className="json-array" title={`Array with ${node.value.length} items`}>
          {node.expanded 
            ? <><i className="fa fa-angle-double-right" style={{ marginRight: '4px', opacity: 0.7 }}></i>{"[]"}</> 
            : <><i className="fa fa-list" style={{ marginRight: '4px' }}></i>{ `[ ${node.value.length} items ]` }</> 
          }
        </span>
      );
    }
    return null;
  };
  
  // Start editing a node
  const startNodeEdit = (node: JsonNode) => {
    setEditingNode(node.path);
    
    // Set initial edit value based on node type
    if (node.type === 'string') {
      setEditValue(node.value);
    } else if (node.type === 'number') {
      setEditValue(node.value.toString());
    } else if (node.type === 'boolean') {
      setEditValue(node.value ? 'true' : 'false');
    } else if (node.type === 'null') {
      setEditValue('null');
    }
  };
  
  // Save node edit
  const saveNodeEdit = (node: JsonNode) => {
    let newValue: any = editValue;
    let isValid = true;
    
    // Parse value based on type
    try {
      switch (node.type) {
        case 'string':
          // Keep as string
          break;
        case 'number':
          newValue = parseFloat(newValue);
          if (isNaN(newValue)) {
            isValid = false;
          }
          break;
        case 'boolean':
          if (newValue.toLowerCase() === 'true') {
            newValue = true;
          } else if (newValue.toLowerCase() === 'false') {
            newValue = false;
          } else {
            isValid = false;
          }
          break;
        case 'null':
          if (newValue.toLowerCase() === 'null') {
            newValue = null;
          } else {
            isValid = false;
          }
          break;
      }
    } catch (e) {
      isValid = false;
    }
    
    if (isValid) {
      // Temporarily prevent tree rebuilds during auto-update
      setPreventTreeRebuild(true);
      
      // Update the node value
      updateNodeValue(node.path, newValue);
      
      // Allow tree rebuilds again after a short delay
      setTimeout(() => {
        setPreventTreeRebuild(false);
      }, 50);
    } else {
      alert(`Invalid value for ${node.type}`);
    }
    
    // Exit edit mode
    setEditingNode(null);
  };
  
  // Update node value in the tree and JSON
  const updateNodeValue = (path: string, newValue: any) => {
    // Function to recursively update the node in the tree
    const updateNodeInTree = (nodes: JsonNode[]): JsonNode[] => {
      return nodes.map(node => {
        if (node.path === path) {
          return { ...node, value: newValue };
        }
        
        if (node.children && node.children.length > 0) {
          return { ...node, children: updateNodeInTree(node.children) };
        }
        
        return node;
      });
    };
    
    // Update the tree directly
    const updatedTree = updateNodeInTree(jsonTree);
    setJsonTree(updatedTree);
    
    // Update the JSON object
    const updateJsonObject = (obj: any, path: string, value: any) => {
      // Handle root level properties
      if (!path.includes('.') && !path.includes('[')) {
        obj[path] = value;
        return obj;
      }
      
      // Handle nested properties
      const parts = path.split('.');
      let current = obj;
      
      for (let i = 0; i < parts.length - 1; i++) {
        let part = parts[i];
        
        // Handle array indices in path like "array[0]"
        if (part.includes('[')) {
          const arrayName = part.split('[')[0];
          const indexStr = part.split('[')[1].split(']')[0];
          const index = parseInt(indexStr, 10);
          
          current = current[arrayName][index];
        } else {
          current = current[part];
        }
      }
      
      let lastPart = parts[parts.length - 1];
      
      // Handle array indices in the last part
      if (lastPart.includes('[')) {
        const arrayName = lastPart.split('[')[0];
        const indexStr = lastPart.split('[')[1].split(']')[0];
        const index = parseInt(indexStr, 10);
        
        current[arrayName][index] = value;
      } else {
        current[lastPart] = value;
      }
      
      return obj;
    };
    
    try {
      // Clone the parsed JSON to avoid reference issues
      const updatedJson = JSON.parse(JSON.stringify(parsed));
      
      // Update the value in the JSON
      const result = updateJsonObject(updatedJson, path, newValue);
      
      // Update the state
      setParsed(result);
      
      // Update the text but don't trigger tree rebuild
      setJsonText(JSON.stringify(result, null, 2));
      
      setUnsavedChanges(true);
      
      // Auto update if enabled
      if (autoUpdate) {
        // Temporarily prevent tree rebuilds during auto-update
        setPreventTreeRebuild(true);
        updateSaveData('', result);
        setUnsavedChanges(false);
        
        // Allow tree rebuilds again after a short delay
        setTimeout(() => {
          setPreventTreeRebuild(false);
        }, 50);
      }
    } catch (e) {
      console.error('Error updating JSON:', e);
    }
  };

  // Add a new property to an object or item to an array
  const addNodeProperty = (parentPath: string, isArray: boolean) => {
    // Prompt for key name if object, or use array index if array
    let key = '';
    if (!isArray) {
      key = prompt('Enter property name:');
      if (!key) return;
    }
    
    // Prompt for value type
    const typeOptions = ['string', 'number', 'boolean', 'null', 'object', 'array'];
    const type = prompt(`Select value type (${typeOptions.join(', ')}):`, 'string');
    if (!type || !typeOptions.includes(type)) return;
    
    // Get default value based on type
    let value;
    switch (type) {
      case 'string':
        value = prompt('Enter string value:', '');
        break;
      case 'number':
        const numValue = prompt('Enter number value:', '0');
        value = numValue ? parseFloat(numValue) : 0;
        if (isNaN(value)) value = 0;
        break;
      case 'boolean':
        value = confirm('Select boolean value (OK for true, Cancel for false)');
        break;
      case 'null':
        value = null;
        break;
      case 'object':
        value = {};
        break;
      case 'array':
        value = [];
        break;
    }
    
    // Update the JSON structure
    try {
      // Clone the parsed JSON
      const updatedJson = JSON.parse(JSON.stringify(parsed));
      
      // Navigate to the parent node
      let parent = updatedJson;
      if (parentPath) {
        const parts = parentPath.split('.');
        
        for (const part of parts) {
          // Handle array indices in path
          if (part.includes('[')) {
            const arrayName = part.split('[')[0];
            const indexStr = part.split('[')[1].split(']')[0];
            const index = parseInt(indexStr, 10);
            
            parent = parent[arrayName][index];
          } else {
            parent = parent[part];
          }
        }
      }
      
      // Add the new property
      if (isArray) {
        parent.push(value);
      } else {
        parent[key] = value;
      }
      
      // Update the state
      setParsed(updatedJson);
      setJsonText(JSON.stringify(updatedJson, null, 2));
      
      // Rebuild the tree while preserving expansion state
      parseJsonToTree(updatedJson);
      
      setUnsavedChanges(true);
      
      // Auto update if enabled
      if (autoUpdate) {
        // Temporarily prevent tree rebuilds during auto-update
        setPreventTreeRebuild(true);
        updateSaveData('', updatedJson);
        setUnsavedChanges(false);
        
        // Allow tree rebuilds again after a short delay
        setTimeout(() => {
          setPreventTreeRebuild(false);
        }, 50);
      }
    } catch (e) {
      console.error('Error updating JSON:', e);
      alert('Error adding property: ' + e);
    }
  };
  
  // Remove a node from the JSON structure
  const removeNode = (nodePath: string) => {
    if (!confirm('Are you sure you want to delete this node?')) {
      return;
    }
    
    try {
      // Clone the parsed JSON
      const updatedJson = JSON.parse(JSON.stringify(parsed));
      
      // Handle root level properties
      if (!nodePath.includes('.') && !nodePath.includes('[')) {
        delete updatedJson[nodePath];
      } else {
        // Handle nested properties
        const parts = nodePath.split('.');
        let parent = updatedJson;
        
        // Navigate to the parent object
        for (let i = 0; i < parts.length - 1; i++) {
          let part = parts[i];
          
          // Handle array indices in path
          if (part.includes('[')) {
            const arrayName = part.split('[')[0];
            const indexStr = part.split('[')[1].split(']')[0];
            const index = parseInt(indexStr, 10);
            
            parent = parent[arrayName][index];
          } else {
            parent = parent[part];
          }
        }
        
        // Get the key or index to remove
        let lastPart = parts[parts.length - 1];
        
        // Handle array indices in the last part
        if (lastPart.includes('[')) {
          const arrayName = lastPart.split('[')[0];
          const indexStr = lastPart.split('[')[1].split(']')[0];
          const index = parseInt(indexStr, 10);
          
          parent[arrayName].splice(index, 1);
        } else {
          delete parent[lastPart];
        }
      }
      
      // Update the state
      setParsed(updatedJson);
      setJsonText(JSON.stringify(updatedJson, null, 2));
      
      // Rebuild the tree while preserving expansion state
      parseJsonToTree(updatedJson);
      
      setUnsavedChanges(true);
      
      // Auto update if enabled
      if (autoUpdate) {
        // Temporarily prevent tree rebuilds during auto-update
        setPreventTreeRebuild(true);
        updateSaveData('', updatedJson);
        setUnsavedChanges(false);
        
        // Allow tree rebuilds again after a short delay
        setTimeout(() => {
          setPreventTreeRebuild(false);
        }, 50);
      }
    } catch (e) {
      console.error('Error removing node:', e);
      alert('Error removing node: ' + e);
    }
  };
  
  // Render tree node
  const renderTreeNode = (node: JsonNode) => {
    const hasChildren = node.children && node.children.length > 0;
    const isArray = node.type === 'array';
    const isObject = node.type === 'object';
    
    // Calculate indentation - limit to a maximum to avoid excessive horizontal scrolling
    const maxIndent = 8; // Maximum depth levels before reducing indentation
    const baseIndent = 20; // Base indentation in pixels
    const reducedIndent = 10; // Reduced indentation for deep levels
    
    let leftMargin;
    if (node.depth <= maxIndent) {
      leftMargin = node.depth * baseIndent;
    } else {
      // Use reduced indentation for deeper levels
      leftMargin = (maxIndent * baseIndent) + ((node.depth - maxIndent) * reducedIndent);
    }
    
    return (
      <div className="json-tree-node" key={node.path} style={{ marginLeft: `${leftMargin}px` }}>
        <div 
          className="node-content"
          onClick={(e) => {
            // Only toggle if clicking directly on the node content, not on child elements
            if (e.target === e.currentTarget) {
              if (hasChildren) toggleNode(node.path);
            }
          }}
          title={node.path}
        >
          {hasChildren && (
            <span 
              className={`toggle-icon ${node.expanded ? 'expanded' : 'collapsed'}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.path);
              }}
              title={node.expanded ? 'Collapse' : 'Expand'}
            >
              <i className={`fa ${node.expanded ? 'fa-chevron-down' : 'fa-chevron-right'}`}></i>
            </span>
          )}
          
          <span 
            className="node-key"
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) toggleNode(node.path);
            }}
            title={`Key: ${node.key}`}
          >
            {node.key}:
          </span>
          
          {renderNodeValue(node)}
          
          <div className="node-actions">
            {(isObject || isArray) && node.expanded && (
              <span 
                className="action-icon add-icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  addNodeProperty(node.path, isArray);
                }}
                title={isArray ? "Add item to array" : "Add property to object"}
              >
                <i className="fa fa-plus-circle"></i>
              </span>
            )}
            <span 
              className="action-icon remove-icon" 
              onClick={(e) => {
                e.stopPropagation();
                removeNode(node.path);
              }}
              title={`Remove ${node.key}`}
            >
              <i className="fa fa-trash"></i>
            </span>
          </div>
        </div>
        
        {node.expanded && hasChildren && (
          <div className="node-children">
            {node.children?.map(childNode => renderTreeNode(childNode))}
          </div>
        )}
      </div>
    );
  };
  
  // Render JSON tree view
  const renderJsonTree = () => {
    return (
      <div className="json-tree-container">
        {jsonTree.map(node => renderTreeNode(node))}
      </div>
    );
  };

  if (!isActive) {
    return null;
  }

  if (!modifiedSaveData) {
    return (
      <div className="empty-editor-message">
        <p>Decrypt a save to view and edit its JSON content.</p>
      </div>
    );
  }

  return (
    <div className="json-editor-container">
      <div className="json-editor-toolbar">
        <div className="editor-stats">
          <span>Lines: {lineCount}</span>
          <span>Characters: {jsonText.length}</span>
          <span className={isValidJson ? "status-valid" : "status-invalid"}>
            {isValidJson ? 'Valid JSON' : 'Invalid JSON'}
          </span>
          {searchResults.length > 0 && (
            <span>
              Results: {searchResults.length} matches
            </span>
          )}
          {unsavedChanges && !autoUpdate && (
            <span className="status-unsaved">
              <i className="fa fa-exclamation-circle"></i>
              Unsaved changes
            </span>
          )}
        </div>
        <div className="editor-actions">
          <button
            onClick={() => setShowSearch(true)}
            className="btn secondary-outline"
            title="Search (Ctrl+F)"
          >
            <i className="fa fa-search"></i>
            Search
          </button>
          
          <button
            onClick={expandAllNodes}
            className="btn secondary-outline"
            title="Expand All Nodes"
          >
            <i className="fa fa-plus-square-o"></i>
            Expand All
          </button>
          <button
            onClick={collapseAllNodes}
            className="btn secondary-outline"
            title="Collapse All Nodes"
          >
            <i className="fa fa-minus-square-o"></i>
            Collapse All
          </button>
          
          <div className="auto-update-toggle">
            <label>
              <input 
                type="checkbox" 
                checked={autoUpdate} 
                onChange={() => setAutoUpdate(!autoUpdate)}
              />
              Auto-update
            </label>
          </div>
          
          <button
            onClick={handleFormat}
            className="btn secondary-outline"
            title="Format JSON (Ctrl+Shift+F)"
          >
            <i className="fa fa-indent"></i>
            Format
          </button>
          
          {unsavedChanges && !autoUpdate && (
            <button
              onClick={handleSave}
              className="btn primary"
              title="Save changes (Ctrl+S)"
            >
              <i className="fa fa-save"></i>
              Save
            </button>
          )}
        </div>
      </div>

      {showSearch && (
        <div className="search-bar">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigateSearch('next');
              }
              if (e.key === 'Escape') {
                setShowSearch(false);
              }
            }}
          />
          <span className="search-status">
            {searchResults.length > 0 ? `${searchResults.length} matches found` : 'No matches'}
          </span>
          <button
            onClick={() => navigateSearch('prev')}
            className="btn secondary-outline"
            disabled={searchResults.length === 0}
            title="Previous match (Shift+F3)"
          >
            <i className="fa fa-chevron-up"></i>
          </button>
          <button
            onClick={() => navigateSearch('next')}
            className="btn secondary-outline"
            disabled={searchResults.length === 0}
            title="Next match (F3)"
          >
            <i className="fa fa-chevron-down"></i>
          </button>
          <button
            onClick={() => setShowSearch(false)}
            className="btn secondary-outline"
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
      )}

      {error && (
        <div className="json-error">
          <i className="fa fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      <div className="editor-content">
        <div className="json-tree-view">
          {renderJsonTree()}
        </div>
      </div>
    </div>
  );
};

export default JsonEditorComponent; 