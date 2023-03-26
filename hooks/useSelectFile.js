import { useState } from 'react';

export default function useSelectFile() {
  const [selectedFile, setSelectedFile] = useState('');

  function onSelectFile(e) {
    const reader = new FileReader();
    if (e.target.files?.[0]) {
      console.log(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target?.result);
      }
    };
  }
  return { selectedFile, setSelectedFile, onSelectFile };
}
