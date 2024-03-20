import * as Dialog from '@radix-ui/react-dialog';
import { DocumentMap } from './components/DocumentMap';

export const DocumentMapExtension = () => {

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        Map
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />

        <Dialog.Content 
          className="dialog-content ou-gtp-document-map not-annotatable">

          <DocumentMap />
         
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )

}