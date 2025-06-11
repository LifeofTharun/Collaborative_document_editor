import React, { useState } from 'react';
import { X, Lock, Globe, Users } from 'lucide-react';
import { Document, AccessType, SharedUser } from '../types';

interface AccessModalProps {
  document: Document;
  onClose: () => void;
  onUpdateAccess: (accessType: AccessType, sharedUsers?: SharedUser[]) => void;
}

const AccessModal: React.FC<AccessModalProps> = ({ document, onClose, onUpdateAccess }) => {
  const [accessType, setAccessType] = useState<AccessType>(document.accessType);
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>(document.sharedUsers);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAccess(accessType, sharedUsers);
    onClose();
  };

  const addSharedUser = () => {
    const email = prompt('Enter email address:');
    if (email && !sharedUsers.find(user => user.email === email)) {
      setSharedUsers([...sharedUsers, { email, permission: 'edit' }]);
    }
  };

  const removeSharedUser = (email: string) => {
    setSharedUsers(sharedUsers.filter(user => user.email !== email));
  };

  const updateUserPermission = (email: string, permission: 'view' | 'edit') => {
    setSharedUsers(sharedUsers.map(user => 
      user.email === email ? { ...user, permission } : user
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Access Settings</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                id="private"
                name="accessType"
                value="private"
                checked={accessType === 'private'}
                onChange={(e) => setAccessType(e.target.value as AccessType)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div className="flex-1">
                <label htmlFor="private" className="flex items-center space-x-2 cursor-pointer">
                  <Lock className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900">Private</span>
                </label>
                <p className="text-sm text-gray-500 mt-1">Only you can access this document</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="radio"
                id="public"
                name="accessType"
                value="public"
                checked={accessType === 'public'}
                onChange={(e) => setAccessType(e.target.value as AccessType)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div className="flex-1">
                <label htmlFor="public" className="flex items-center space-x-2 cursor-pointer">
                  <Globe className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-gray-900">Public</span>
                </label>
                <p className="text-sm text-gray-500 mt-1">Anyone with the link can view and edit</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="radio"
                id="shared"
                name="accessType"
                value="shared"
                checked={accessType === 'shared'}
                onChange={(e) => setAccessType(e.target.value as AccessType)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div className="flex-1">
                <label htmlFor="shared" className="flex items-center space-x-2 cursor-pointer">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-900">Shared</span>
                </label>
                <p className="text-sm text-gray-500 mt-1">Only specific people can access</p>
              </div>
            </div>
          </div>

          {accessType === 'shared' && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">Shared with</h4>
                <button
                  type="button"
                  onClick={addSharedUser}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Add person
                </button>
              </div>
              
              {sharedUsers.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded-md">
                  No one has access yet. Click "Add person" to share.
                </p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {sharedUsers.map((user) => (
                    <div key={user.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <span className="text-sm text-gray-900">{user.email}</span>
                      <div className="flex items-center space-x-2">
                        <select
                          value={user.permission}
                          onChange={(e) => updateUserPermission(user.email, e.target.value as 'view' | 'edit')}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="view">View</option>
                          <option value="edit">Edit</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => removeSharedUser(user.email)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccessModal;
