import { 
  Combine, Scissors, FileArchive, FileText, FileSignature, 
  Image as ImageIcon, Type, Lock, Zap, ShieldCheck, Globe 
} from 'lucide-react';
import { PDFTool, Feature } from './types';

export const PRIMARY_BLUE = '#0061ff';

export const TOOLS: PDFTool[] = [
  { id: 'merge', title: 'Merge PDF', description: 'Combine multiple PDF files into one single document easily.', icon: Combine, category: 'edit', color: 'bg-blue-50 text-blue-600' },
  { id: 'split', title: 'Split PDF', description: 'Separate one page or a whole set into independent PDF files.', icon: Scissors, category: 'edit', color: 'bg-indigo-50 text-indigo-600' },
  { id: 'compress', title: 'Compress PDF', description: 'Reduce file size while optimizing for maximal PDF quality.', icon: FileArchive, category: 'optimize', color: 'bg-sky-50 text-sky-600' },
  { id: 'pdf-to-word', title: 'PDF to Word', description: 'Convert your PDF to DOCX with incredible accuracy.', icon: FileText, category: 'convert', color: 'bg-blue-50 text-blue-600' },
  { id: 'pdf-to-jpg', title: 'PDF to JPG', description: 'Extract all images within a PDF or convert each page to JPG.', icon: ImageIcon, category: 'convert', color: 'bg-cyan-50 text-cyan-600' },
  { id: 'edit-pdf', title: 'Edit PDF', description: 'Add text, images, shapes or annotations to your PDF.', icon: Type, category: 'edit', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'sign-pdf', title: 'Sign PDF', description: 'Sign a document and request signatures from others.', icon: FileSignature, category: 'security', color: 'bg-blue-50 text-blue-600' },
  { id: 'protect-pdf', title: 'Protect PDF', description: 'Encrypt PDF with a password for secure access.', icon: Lock, category: 'security', color: 'bg-slate-100 text-slate-700' }
];

export const FEATURES: Feature[] = [
  { title: "Fast & Easy to Use", description: "Our intuitive interface makes PDF editing accessible for everyone. Process your documents in seconds.", icon: Zap },
  { title: "Secure Processing", description: "Your files are encrypted using 256-bit SSL and deleted automatically within 2 hours.", icon: ShieldCheck },
  { title: "Works on Any Device", description: "Access our full suite of PDF tools from your desktop, tablet, or smartphone.", icon: Globe }
];