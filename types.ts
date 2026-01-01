
import { LucideIcon } from 'lucide-react';

export interface PDFTool {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: 'edit' | 'convert' | 'optimize' | 'security';
  color: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}
