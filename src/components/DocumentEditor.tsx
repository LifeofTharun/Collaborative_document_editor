import React, { useState, useRef, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Toolbar from './Toolbar';
import EditorArea from './EditorArea';
import { Document, ToolbarState } from '../types';

interface DocumentEditorProps {
  document: Document;
  onUpdate: (content: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  document,
  onUpdate,
  sidebarOpen,
  onToggleSidebar
}) => {
  const [toolbarState, setToolbarState] = useState<ToolbarState>({
    bold: false,
    italic: false,
    underline: false,
    fontSize: '16',
    textAlign: 'left',
    fontFamily: 'Arial'
  });

  const editorRef = useRef<HTMLDivElement>(null);

  const updateToolbarState = () => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Get the current selection and check formatting
    const range = selection.getRangeAt(0);
    const parentElement = range.commonAncestorContainer.nodeType === Node.TEXT_NODE 
      ? range.commonAncestorContainer.parentElement 
      : range.commonAncestorContainer as Element;

    if (parentElement && editorRef.current.contains(parentElement)) {
      const computedStyle = window.getComputedStyle(parentElement);
      
      setToolbarState({
        bold: window.document.queryCommandState('bold'),
        italic: window.document.queryCommandState('italic'),
        underline: window.document.queryCommandState('underline'),
        fontSize: computedStyle.fontSize.replace('px', '') || '16',
        textAlign: computedStyle.textAlign || 'left',
        fontFamily: computedStyle.fontFamily.split(',')[0].replace(/['"]/g, '') || 'Arial'
      });
    }
  };

  const executeCommand = (command: string, value?: string) => {
    if (!editorRef.current) return;
    
    editorRef.current.focus();
    
    // Handle font size specially to ensure it works properly
    if (command === 'fontSize') {
      // Use a more reliable method for font size
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (range.collapsed) {
          // If no text is selected, create a span with the font size
          const span = window.document.createElement('span');
          span.style.fontSize = value + 'px';
          span.innerHTML = '&#8203;'; // Zero-width space
          range.insertNode(span);
          range.setStartAfter(span);
          range.setEndAfter(span);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          // If text is selected, wrap it in a span with the font size
          const span = window.document.createElement('span');
          span.style.fontSize = value + 'px';
          try {
            range.surroundContents(span);
          } catch (e) {
            // If surroundContents fails, extract and wrap the content
            const contents = range.extractContents();
            span.appendChild(contents);
            range.insertNode(span);
          }
        }
      }
    } else if (command.startsWith('justify')) {
      // Handle text alignment
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let element = range.commonAncestorContainer;
        
        // Find the block element to apply alignment
        while (element && element.nodeType !== Node.ELEMENT_NODE) {
          element = element.parentNode;
        }
        
        while (element && element !== editorRef.current) {
          const tagName = (element as Element).tagName?.toLowerCase();
          if (['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
            const alignValue = command === 'justifyLeft' ? 'left' :
                             command === 'justifyCenter' ? 'center' :
                             command === 'justifyRight' ? 'right' :
                             command === 'justifyFull' ? 'justify' : 'left';
            (element as HTMLElement).style.textAlign = alignValue;
            break;
          }
          element = element.parentNode;
        }
      }
    } else {
      // Use standard execCommand for other formatting
      window.document.execCommand(command, false, value);
    }
    
    updateToolbarState();
    if (editorRef.current) {
      onUpdate(editorRef.current.innerHTML);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Mobile header with hamburger */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-medium text-gray-600">
          {document.name}
        </span>
        <div className="w-9" /> {/* Spacer for centering */}
      </div>

      {/* Desktop hamburger button */}
      <div className="hidden lg:flex items-center p-2 border-b border-gray-200">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <Toolbar
        state={toolbarState}
        onCommand={executeCommand}
        onInsertImage={insertImage}
      />
      
      <EditorArea
        ref={editorRef}
        content={document.content}
        onUpdate={onUpdate}
        onSelectionChange={updateToolbarState}
      />
    </div>
  );
};

export default DocumentEditor;