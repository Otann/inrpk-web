import { Button, Modal, Stack, TextInput } from '@carbon/react';
import { useSubmit, Form } from '@remix-run/react';
import { useRef, MutableRefObject, useState } from 'react';
import {
  StateManagerModalProps,
  ModalStateManager,
} from '~/components/ModalStateManager';

export function AddNewGroupButton() {
  const button = useRef();
  return (
    <ModalStateManager
      renderLauncher={({ setOpen }) => (
        <Button ref={button} onClick={() => setOpen(true)}>
          Добавить группу
        </Button>
      )}
    >
      {({ open, setOpen }) => (
        <CreateGroupModal open={open} setOpen={setOpen} button={button} />
      )}
    </ModalStateManager>
  );
}

function CreateGroupModal({
  open,
  setOpen,
  button,
}: StateManagerModalProps & { button: MutableRefObject<undefined> }) {
  const [groupName, setGroupName] = useState<string>('');
  const submit = useSubmit();

  return (
    <Modal
      launcherButtonRef={button}
      modalHeading="Добавить учебную группу"
      primaryButtonText="Добавить"
      secondaryButtonText="Отмена"
      open={open}
      onRequestClose={() => setOpen(false)}
      onRequestSubmit={() => {
        setOpen(false);
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
            placeholder="ФВУ. 1-й уровень. 239-й поток"
            style={{
              marginBottom: '1rem',
            }}
            defaultValue={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            autoComplete="off"
          />
        </Stack>
      </Form>
    </Modal>
  );
}
