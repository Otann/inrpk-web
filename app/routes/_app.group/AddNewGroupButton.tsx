import { Button, Modal, Stack, TextInput } from '@carbon/react';
import { Form, useSubmit } from '@remix-run/react';
import { useRef, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import ReactDOM from 'react-dom';

export function AddNewGroupButton() {
  const [open, setOpen] = useState(false);
  const button = useRef();
  const [groupName, setGroupName] = useState<string>('');
  const submit = useSubmit();

  return (
    <>
      <ClientOnly>
        {() =>
          ReactDOM.createPortal(
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
                    Позже возможно будет так же автоматически создавать звонки в
                    зум
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
            </Modal>,
            document.body
          )
        }
      </ClientOnly>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Добавить группу
      </Button>
    </>
  );
}
