import { Camera } from '@phosphor-icons/react';
import { Document } from '@recogito/studio-sdk';
import html2canvas from 'html2canvas';

interface PNGDownloadProps {

  document: Document;

}

export const PNGDownload = (props: PNGDownloadProps) => {

  const onExportPNG = () => {
    html2canvas(document.querySelector('.ou-gtp-document-map')!, { useCORS: true, scale: 2 }).then(canvas => {
      const anchor = document.createElement('a');
      anchor.download = `${props.document.name}.png`;
      anchor.href = canvas.toDataURL()
      anchor.click();
    });
  }

  return (
    <button
      className="unstyled download-geojson"
      onClick={onExportPNG}>
      <Camera size={20} /> PNG
    </button>
  )

}