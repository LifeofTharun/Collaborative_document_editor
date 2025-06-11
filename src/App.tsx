import React, { useState, useEffect } from 'react';
import { FileText, Settings, Users, Lock, Globe, Share2 } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DocumentEditor from './components/DocumentEditor';
import AccessModal from './components/AccessModal';
import NewFileModal from './components/NewFileModal';
import ShareModal from './components/ShareModal';
import { Document, AccessType, SharedUser } from './types';

function App() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Welcome Document',
      content: '<h1>Welcome to Collaborative Editor</h1><p>Start editing your document here...</p>',
      accessType: 'private',
      sharedUsers: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  
  const [activeDocumentId, setActiveDocumentId] = useState<string>('1');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [showAccessModal, setShowAccessModal] = useState<boolean>(false);
  const [showNewFileModal, setShowNewFileModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  const activeDocument = documents.find(doc => doc.id === activeDocumentId);

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id 
        ? { ...doc, ...updates, updatedAt: new Date() }
        : doc
    ));
  };

  const updateDocumentName = (id: string, name: string) => {
    updateDocument(id, { name });
  };

  const createDocument = (name: string, accessType: AccessType = 'private') => {
    const newDoc: Document = {
      id: Date.now().toString(),
      name,
      content: `<h1>${name}</h1><p>Start writing your document...</p>`,
      accessType,
      sharedUsers: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setDocuments(prev => [...prev, newDoc]);
    setActiveDocumentId(newDoc.id);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    if (activeDocumentId === id && documents.length > 1) {
      const remainingDocs = documents.filter(doc => doc.id !== id);
      setActiveDocumentId(remainingDocs[0]?.id || '');
    }
  };

  const updateAccess = (accessType: AccessType, sharedUsers: SharedUser[] = []) => {
    if (activeDocument) {
      updateDocument(activeDocument.id, { accessType, sharedUsers });
    }
  };

  const generateShareLink = () => {
    if (activeDocument && activeDocument.accessType === 'public') {
      return `${window.location.origin}/doc/${activeDocument.id}`;
    }
    return '';
  };

  const copyShareLink = () => {
    const link = generateShareLink();
    if (link) {
      navigator.clipboard.writeText(link);
      // You could add a toast notification here
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar
        documents={documents}
        activeDocumentId={activeDocumentId}
        onDocumentSelect={setActiveDocumentId}
        onNewDocument={() => setShowNewFileModal(true)}
        onDeleteDocument={deleteDocument}
        onRenameDocument={updateDocumentName}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {activeDocument && (
          <>
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-semibold text-gray-900 truncate">
                  {activeDocument.name}
                </h1>
                <div className="flex items-center space-x-2">
                  {activeDocument.accessType === 'private' && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                      <Lock className="h-3 w-3" />
                      <span>Private</span>
                    </div>
                  )}
                  {activeDocument.accessType === 'public' && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-full text-xs text-green-700">
                      <Globe className="h-3 w-3" />
                      <span>Public</span>
                    </div>
                  )}
                  {activeDocument.accessType === 'shared' && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 rounded-full text-xs text-blue-700">
                      <Users className="h-3 w-3" />
                      <span>Shared ({activeDocument.sharedUsers.length})</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {activeDocument.accessType === 'public' && (
                  <button
                    onClick={copyShareLink}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Copy Link</span>
                  </button>
                )}
                <button
                  onClick={() => setShowShareModal(true)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  title="Share Settings"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowAccessModal(true)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  title="Access Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <DocumentEditor
              document={activeDocument}
              onUpdate={(content) => updateDocument(activeDocument.id, { content })}
              sidebarOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />
          </>
        )}
      </div>

      {showAccessModal && activeDocument && (
        <AccessModal
          document={activeDocument}
          onClose={() => setShowAccessModal(false)}
          onUpdateAccess={updateAccess}
        />
      )}

      {showNewFileModal && (
        <NewFileModal
          onClose={() => setShowNewFileModal(false)}
          onCreateDocument={createDocument}
        />
      )}

      {showShareModal && activeDocument && (
        <ShareModal
          document={activeDocument}
          onClose={() => setShowShareModal(false)}
          onUpdateAccess={updateAccess}
          shareLink={generateShareLink()}
        />
      )}
    </div>
  );
}

export default App;