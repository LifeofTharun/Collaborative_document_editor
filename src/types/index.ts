export type AccessType = 'private' | 'public' | 'shared';

export type Permission = 'view' | 'edit';

export interface SharedUser {
  email: string;
  permission: Permission;
}

export interface Document {
  id: string;
  name: string;
  content: string;
  accessType: AccessType;
  sharedUsers: SharedUser[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ToolbarState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  fontSize: string;
  textAlign: string;
  fontFamily: string;
}
