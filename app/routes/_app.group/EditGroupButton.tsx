import {
  Button,
  Dropdown,
  Modal,
  Select,
  SelectItem,
  Stack,
  TextInput,
} from '@carbon/react';
import { useSubmit, Form } from '@remix-run/react';
import { useRef, MutableRefObject, useState } from 'react';
import {
  StateManagerModalProps,
  ModalStateManager,
} from '~/components/ModalStateManager';
import { Edit } from '@carbon/icons-react';
import { StudyGroupWithTg, TelegramGroup } from '~/lib/db/schema';

interface EditGroupButtonProps {
  group: StudyGroupWithTg;
  tgGroups: TelegramGroup[];
  usedGroups: Set<number>;
}

export function EditGroupButton(props: EditGroupButtonProps) {
  const button = useRef();
  return (
    <ModalStateManager
      renderLauncher={({ setOpen }) => (
        <Button
          ref={button}
          onClick={() => setOpen(true)}
          size="sm"
          kind="ghost"
          hasIconOnly
          renderIcon={Edit}
          iconDescription="Редактировать"
          isSelected={false}
        />
      )}
    >
      {({ open, setOpen }) => (
        <EditGroupModal
          open={open}
          setOpen={setOpen}
          button={button}
          {...props}
        />
      )}
    </ModalStateManager>
  );
}

function EditGroupModal({
  open,
  setOpen,
  button,
  group,
  tgGroups,
  usedGroups,
}: StateManagerModalProps & {
  button: MutableRefObject<undefined>;
} & EditGroupButtonProps) {
  const [groupName, setGroupName] = useState<string>(group.name || '');
  const [telegramId, setTelegramId] = useState<number | null>(
    group.telegramChatId
  );
  const submit = useSubmit();

  return (
    <Modal
      launcherButtonRef={button}
      modalHeading="Редактировать учебную группу"
      primaryButtonText="Сохранить"
      secondaryButtonText="Отмена"
      open={open}
      onRequestClose={() => setOpen(false)}
      onRequestSubmit={() => {
        setOpen(false);
        submit(
          {
            action: 'edit',
            id: group.id,
            name: groupName,
            chatId: telegramId,
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
          <Select
            id="select-1"
            defaultValue={group.telegramChatId}
            labelText="Region"
            placeholder="Выберите группу в телеграме"
            onChange={(value) => setTelegramId(parseInt(value.target.value))}
          >
            <SelectItem value={null} text="Группа не выбрана" />
            {tgGroups.map((tgGroup) => (
              <SelectItem
                value={tgGroup.telegramId}
                text={tgGroup.title || ''}
                key={tgGroup.id}
                disabled={
                  group.telegramChatId !== tgGroup.telegramId &&
                  usedGroups.has(tgGroup.telegramId!)
                }
              />
            ))}
          </Select>
          {/* <Dropdown
            id="inline"
            // initialSelectedItem={tgOptions[1]}
            label="Выберите группу в телеграме"
            type="inline"
            items={tgGroups}
            itemToString={(item) => (item ? item.title : '')}
          /> */}
        </Stack>
      </Form>
    </Modal>
  );
}
