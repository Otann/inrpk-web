import { Edit } from '@carbon/icons-react';
import {
  Button,
  Modal,
  Select,
  SelectItem,
  Stack,
  TextInput,
} from '@carbon/react';
import { Form, useSubmit } from '@remix-run/react';
import { useRef, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { StudyGroupWithTg, TelegramGroup } from '~/lib/db/schema';

interface EditGroupButtonProps {
  group: StudyGroupWithTg;
  tgGroups: TelegramGroup[];
  usedGroups: Set<number>;
}

export function EditGroupButton({
  group,
  tgGroups,
  usedGroups,
}: EditGroupButtonProps) {
  const [open, setOpen] = useState(false);
  const button = useRef();
  const [groupName, setGroupName] = useState<string>(group.name || '');
  const [telegramId, setTelegramId] = useState<number | null>(
    group.telegramChatId
  );
  const submit = useSubmit();

  return (
    <>
      <ClientOnly>
        {() => (
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
                  Позже возможно будет так же автоматически создавать звонки в
                  зум
                </em>
                <TextInput
                  data-modal-primary-focus
                  id="group_name"
                  labelText="Название учебного потока"
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
                  labelText="Привязанная группа в телеграме"
                  placeholder="Выберите группу в телеграме"
                  onChange={(value) =>
                    setTelegramId(parseInt(value.target.value))
                  }
                >
                  <SelectItem value={0} text="Группа не выбрана" />
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
              </Stack>
            </Form>
          </Modal>
        )}
      </ClientOnly>
      <Button
        // ref={button}
        onClick={() => setOpen(true)}
        size="sm"
        kind="ghost"
        hasIconOnly
        renderIcon={Edit}
        iconDescription="Редактировать"
        isSelected={false}
      />
    </>
  );
}
