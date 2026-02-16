export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export type Theme = 'light' | 'dark' | 'midnight' | 'purple' | 'cream' | 'mint' | 'rose';

export interface ThemeConfig {
  name: string;
  class: string;
  icon: string;
  description: string;
}

export type TextSize = 'small' | 'normal' | 'large' | 'huge';

export interface EditorState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  textSize: TextSize;
  isUnorderedList: boolean;
  isOrderedList: boolean;
}
