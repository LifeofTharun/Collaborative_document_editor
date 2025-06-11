import React, { forwardRef, useEffect } from 'react';

interface EditorAreaProps {
  content: string;
  onUpdate: (content: string) => void;
  onSelectionChange: () => void;
}

const EditorArea = forwardRef<HTMLDivElement, EditorAreaProps>(
  ({ content, onUpdate, onSelectionChange }, ref) => {
    useEffect(() => {
      if (ref && typeof ref === 'object' && ref.current) {
        // Ensure proper text direction and prevent reversal
        ref.current.innerHTML = content;
        ref.current.style.direction = 'ltr';
        ref.current.style.unicodeBidi = 'normal';
      }
    }, [content, ref]);

    const handleInput = () => {
      if (ref && typeof ref === 'object' && ref.current) {
        onUpdate(ref.current.innerHTML);
      }
    };

    const handleSelectionChange = () => {
      // Add a small delay to ensure the selection has been updated
      setTimeout(() => {
        onSelectionChange();
      }, 10);
    };

    const handleKeyUp = () => {
      handleSelectionChange();
    };

    const handleMouseUp = () => {
      handleSelectionChange();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      
      // Insert plain text to prevent formatting issues
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      handleInput();
    };

    useEffect(() => {
      document.addEventListener('selectionchange', handleSelectionChange);
      return () => {
        document.removeEventListener('selectionchange', handleSelectionChange);
      };
    }, []);

    return (
      <div className="flex-1 bg-gray-50 overflow-hidden">
        <div className="h-full overflow-y-auto p-4">
          <div className="max-w-full mx-auto">
            <div
              ref={ref}
              contentEditable
              onInput={handleInput}
              onKeyUp={handleKeyUp}
              onMouseUp={handleMouseUp}
              onPaste={handlePaste}
              className="
                min-h-full p-8 bg-white rounded-lg shadow-sm border border-gray-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                prose prose-lg max-w-none
                [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
              "
              style={{
                lineHeight: '1.6',
                fontSize: '16px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                minHeight: 'calc(100vh - 200px)',
                direction: 'ltr',
                unicodeBidi: 'normal',
                textAlign: 'left',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
              suppressContentEditableWarning={true}
              spellCheck={true}
            />
          </div>
        </div>
      </div>
    );
  }
);

EditorArea.displayName = 'EditorArea';

export default EditorArea;