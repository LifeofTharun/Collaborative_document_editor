import React from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Image,
  Type
} from 'lucide-react';
import { ToolbarState } from '../types';

interface ToolbarProps {
  state: ToolbarState;
  onCommand: (command: string, value?: string) => void;
  onInsertImage: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ state, onCommand, onInsertImage }) => {
  const fontSizes = ['8', '10', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];
  const fontFamilies = ['Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana', 'Courier New'];

  const ToolbarButton: React.FC<{
    active?: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
  }> = ({ active, onClick, icon, title }) => (
    <button
      onClick={onClick}
      title={title}
      className={`
        p-2 rounded-md transition-all duration-200 
        ${active 
          ? 'bg-blue-100 text-blue-700 shadow-sm' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
        }
      `}
    >
      {icon}
    </button>
  );

  return (
    <div className="bg-white border-b border-gray-200 p-3">
      <div className="flex flex-wrap items-center gap-1">
        {/* Font Family */}
        <select
          value={state.fontFamily}
          onChange={(e) => onCommand('fontName', e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {fontFamilies.map(font => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>

        {/* Font Size */}
        <select
          value={state.fontSize}
          onChange={(e) => onCommand('fontSize', e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ml-2"
        >
          {fontSizes.map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Text Formatting */}
        <ToolbarButton
          active={state.bold}
          onClick={() => onCommand('bold')}
          icon={<Bold className="h-4 w-4" />}
          title="Bold"
        />
        
        <ToolbarButton
          active={state.italic}
          onClick={() => onCommand('italic')}
          icon={<Italic className="h-4 w-4" />}
          title="Italic"
        />
        
        <ToolbarButton
          active={state.underline}
          onClick={() => onCommand('underline')}
          icon={<Underline className="h-4 w-4" />}
          title="Underline"
        />

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Text Alignment */}
        <ToolbarButton
          active={state.textAlign === 'left'}
          onClick={() => onCommand('justifyLeft')}
          icon={<AlignLeft className="h-4 w-4" />}
          title="Align Left"
        />
        
        <ToolbarButton
          active={state.textAlign === 'center'}
          onClick={() => onCommand('justifyCenter')}
          icon={<AlignCenter className="h-4 w-4" />}
          title="Align Center"
        />
        
        <ToolbarButton
          active={state.textAlign === 'right'}
          onClick={() => onCommand('justifyRight')}
          icon={<AlignRight className="h-4 w-4" />}
          title="Align Right"
        />
        
        <ToolbarButton
          active={state.textAlign === 'justify'}
          onClick={() => onCommand('justifyFull')}
          icon={<AlignJustify className="h-4 w-4" />}
          title="Justify"
        />

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Insert Image */}
        <ToolbarButton
          onClick={onInsertImage}
          icon={<Image className="h-4 w-4" />}
          title="Insert Image"
        />

        {/* Text Color */}
        <div className="ml-2 flex items-center space-x-1">
          <Type className="h-4 w-4 text-gray-600" />
          <input
            type="color"
            onChange={(e) => onCommand('foreColor', e.target.value)}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            title="Text Color"
          />
        </div>

        {/* Background Color */}
        <input
          type="color"
          onChange={(e) => onCommand('hiliteColor', e.target.value)}
          className="w-8 h-8 border border-gray-300 rounded cursor-pointer ml-1"
          title="Background Color"
        />
      </div>
    </div>
  );
};

export default Toolbar;