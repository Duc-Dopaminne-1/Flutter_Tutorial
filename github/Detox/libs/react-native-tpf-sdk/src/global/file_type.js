import React from 'react';
import { ICFile, ICImage } from '../assets/icons';

export const SupportFile = ['PNG', 'JPG', 'JPEG', 'PDF', 'XLSX', 'DOC', 'DOCX'];

export const FileType = {
  JPG: <ICImage />,
  JPEG: <ICImage />,
  PNG: <ICImage />,
  PDF: <ICFile />,
  FILE: <ICFile />
};
