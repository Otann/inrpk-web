import { Button, Modal, Stack, TextInput } from '@carbon/react';
import { ModalProps } from '@carbon/react/lib/components/Modal/Modal';
import { Form, useSubmit } from '@remix-run/react';
import { useRef, useState } from 'react';
import { ModalStateManager } from '~/components/ModalStateManager';

export interface LaunchButtonProps {
  onLaunch: (value: boolean) => void;
  ref: React.MutableRefObject<undefined>;
}

interface ButtonWithModalProps extends ModalProps {
  launchButton: React.ComponentType<LaunchButtonProps>;
  children: React.ReactElement;
}

export function ButtonWithModal({
  launchButton: LaunchButton,
  children,
  ...props
}: ButtonWithModalProps) {
  const button = useRef();

  return (
    <ModalStateManager
      renderLauncher={({ setOpen }) => (
        <LaunchButton ref={button} onLaunch={() => setOpen(true)} />
      )}
    >
      {({ open, setOpen }) => (
        <Modal
          {...props}
          launcherButtonRef={button}
          open={open}
          onRequestClose={() => setOpen(false)}
          onRequestSubmit={(e) => {
            setOpen(false);
            if (props.onRequestSubmit) {
              props.onRequestSubmit(e);
            }
          }}
        >
          {children}
        </Modal>
      )}
    </ModalStateManager>
  );
}

/**
 * TODO: input flickers when on value change, meaning something is re-rendering unnecessarily
 */
export function ExampleModal() {
  const [groupName, setGroupName] = useState<string>('');
  const submit = useSubmit();

  return (
    <ButtonWithModal
      launchButton={({ onLaunch, ref }) => (
        <Button onClick={() => onLaunch(true)} ref={ref}>
          Открыть
        </Button>
      )}
      modalHeading="Добавить учебную группу"
      modalLabel="Учебные группы"
      primaryButtonText="Добавить"
      secondaryButtonText="Отмена"
      onRequestSubmit={() => {
        submit(
          {
            action: 'add',
            name: groupName,
          },
          { method: 'post' }
        );
      }}
    >
      <Form>
        <Stack gap={5}>
          <p>
            Для которой можно создавать занятия и отправлять сообщения в
            телеграм.
          </p>
          <em>
            Позже возможно будет так же автоматически создавать звонки в зум
          </em>
          <TextInput
            data-modal-primary-focus
            id="group_name"
            labelText="Название группы"
            placeholder="239 поток ФВУ. Информационный чат"
            style={{
              marginBottom: '1rem',
            }}
            defaultValue={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            autoComplete="false"
          />
        </Stack>
      </Form>
    </ButtonWithModal>
  );
}
