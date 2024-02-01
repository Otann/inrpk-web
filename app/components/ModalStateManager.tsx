import React, { useState } from 'react';
import ReactDOM from 'react-dom';

export interface StateManagerModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

interface ModelStateManagerProps {
  renderLauncher: React.ComponentType<StateManagerModalProps>;
  children: React.ComponentType<StateManagerModalProps>;
}

export const ModalStateManager = ({
  renderLauncher: LauncherContent,
  children: ModalContent,
}: ModelStateManagerProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!ModalContent || typeof document === 'undefined'
        ? null
        : ReactDOM.createPortal(
            <ModalContent open={open} setOpen={setOpen} />,
            document.body
          )}
      {LauncherContent && <LauncherContent open={open} setOpen={setOpen} />}
    </>
  );
};
