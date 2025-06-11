import React, { useState } from 'react';
import { Plus, FileText, Trash2, Menu, X, Search, Edit3, Check, X as XIcon } from 'lucide-react';
import { Document } from '../types';

interface SidebarProps {
  documents: Document[];
  activeDocumentId: string;
  onDocumentSelect: (id: string) => void;
  onNewDocument: () => void;
  onDeleteDocument: (id: string) => void;
  onRenameDocument: (id: string, name: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  documents,
  activeDocumentId,
  onDocumentSelect,
  onNewDocument,
  onDeleteDocument,
  onRenameDocument,
  isOpen,
  onToggle
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    }).format(date);
  };

  const startEditing = (doc: Document) => {
    setEditingId(doc.id);
    setEditingName(doc.name);
  };

  const saveEdit = (id: string) => {
    if (editingName.trim() && editingName.trim() !== documents.find(d => d.id === id)?.name) {
      onRenameDocument(id, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit(id);
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-300 ease-in-out
        w-80 bg-white border-r border-gray-200 flex flex-col
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Documents
            </h2>
            <button
              onClick={onToggle}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <button
            onClick={onNewDocument}
            className="w-full flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>New Document</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Documents list */}
        <div className="flex-1 overflow-y-auto">
          {filteredDocuments.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">
                {searchTerm ? 'No documents found' : 'No documents yet'}
              </p>
            </div>
          ) : (
            <div className="p-2">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`
                    group relative flex items-center p-3 mb-1 rounded-lg cursor-pointer transition-all
                    ${activeDocumentId === doc.id 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                    }
                  `}
                  onClick={() => !editingId && onDocumentSelect(doc.id)}
                >
                  <FileText className={`
                    h-4 w-4 mr-3 flex-shrink-0
                    ${activeDocumentId === doc.id ? 'text-blue-600' : 'text-gray-400'}
                  `} />
                  
                  <div className="flex-1 min-w-0">
                    {editingId === doc.id ? (
                      <div className="flex items-center space-x-1">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, doc.id)}
                          className="flex-1 text-sm font-medium bg-white border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            saveEdit(doc.id);
                          }}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Save"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelEdit();
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Cancel"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className={`
                          text-sm font-medium truncate
                          ${activeDocumentId === doc.id ? 'text-blue-900' : 'text-gray-900'}
                        `}>
                          {doc.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDate(doc.updatedAt)}
                        </p>
                      </>
                    )}
                  </div>

                  {editingId !== doc.id && (
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(doc);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                        title="Rename document"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (documents.length > 1) {
                            onDeleteDocument(doc.id);
                          }
                        }}
                        className={`
                          p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all
                          ${documents.length <= 1 ? 'cursor-not-allowed opacity-30' : ''}
                        `}
                        disabled={documents.length <= 1}
                        title={documents.length <= 1 ? 'Cannot delete the last document' : 'Delete document'}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;