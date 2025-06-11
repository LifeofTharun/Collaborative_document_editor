import React, { useState } from 'react';
import { X, Copy, Check, Mail, Link } from 'lucide-react';
import { Document, AccessType, SharedUser } from '../types';

interface ShareModalProps {
  document: Document;
  onClose: () => void;
  onUpdateAccess: (accessType: AccessType, sharedUsers?: SharedUser[]) => void;
  shareLink: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ document, onClose, onUpdateAccess, shareLink }) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('edit');

  const copyLink = async () => {
    if (shareLink) {
      try {
        await navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const addSharedUser = () => {
    if (email && !document.sharedUsers.find(user => user.email === email)) {
      const newSharedUsers = [...document.sharedUsers, { email, permission }];
      onUpdateAccess('shared', newSharedUsers);
      setEmail('');
    }
  };

  const makePublic = () => {
    onUpdateAccess('public');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Share Document</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Share via email */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Invite people
            </h4>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <select
                  value={permission}
                  onChange={(e) => setPermission(e.target.value as 'view' | 'edit')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="edit">Can edit</option>
                  <option value="view">Can view</option>
                </select>
              </div>
              <button
                onClick={addSharedUser}
                disabled={!email}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send Invite
              </button>
            </div>
          </div>

          {/* Share via link */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Link className="h-4 w-4 mr-2" />
              Share via link
            </h4>
            
            {document.accessType === 'public' ? (
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                  />
                  <button
                    onClick={copyLink}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-colors flex items-center space-x-1"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Anyone with this link can view and edit the document
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-3">
                  Make this document public to generate a shareable link
                </p>
                <button
                  onClick={makePublic}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Make Public
                </button>
              </div>
            )}
          </div>

          {/* Current shares */}
          {document.sharedUsers.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Shared with ({document.sharedUsers.length})
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {document.sharedUsers.map((user) => (
                  <div key={user.email} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-900">{user.email}</span>
                    <span className="text-xs text-gray-500 capitalize">{user.permission}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;