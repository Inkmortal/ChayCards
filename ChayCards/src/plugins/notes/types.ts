import { BaseDocument } from '../../core/types/document';

export interface NoteDocument extends BaseDocument {
  type: 'note';
  content: string;
  status: string;
  metadata: {
    wordCount?: number;
    lastEditedAt?: Date;
    [key: string]: any;
  };
}
