import {
  Button,
  ButtonSet,
  InlineNotification,
  Stack,
  TextInput,
} from '@carbon/react';
import { Form as RemixForm } from '@remix-run/react';
import styles from './styles.module.css';
import type { FC } from 'react';
import { Account } from '~/lib/db/schema.server';

type LoginPageProps = {
  error?: Error;
  user?: Account;
};

const LoginPage: FC<LoginPageProps> = ({ error, user }) => {
  if (user) {
    return <NotAllowed user={user} />;
  } else {
    return <LoginForm error={error} />;
  }
};

interface LoginFormProps {
  error?: Error;
}

function NotAllowed({ user }: { user: Account }) {
  return (
    <div className={styles.box}>
      <RemixForm method="post" className={styles.root}>
        <Stack gap={7}>
          <h1>
            Недостаточно прав, {user.firstName} {user.lastName}
          </h1>
          <p>Обратитесь к администратору</p>
          <Button kind="danger" href="/auth/logout">
            Выйти из системы
          </Button>
        </Stack>
      </RemixForm>
    </div>
  );
}

const LoginForm: FC<LoginFormProps> = ({ error }) => {
  const errorMessage = error ? (
    <InlineNotification
      kind="error"
      statusIconDescription="notification"
      subtitle={error.message}
      lowContrast={true}
      hideCloseButton={true}
    />
  ) : null;

  return (
    <div className={styles.box}>
      <RemixForm method="post" className={styles.root}>
        <Stack gap={7}>
          <h1>Вход в систему</h1>
          <p>
            Чтобы войти, получите новый код для входа в телеграм-боте{' '}
            <a href="https://t.me/inrpk_bot">@inrpk_bot</a>.
          </p>
          <p>
            Для этого перейдите в телеграм, нажмите на кнопку &quot;Начать&quot;
            или &quot;Получить новый код&quot;.
          </p>
          <TextInput
            type="code"
            name="code"
            id="code"
            labelText="Код из телеграма"
            autoComplete="off"
          />
          {errorMessage}
          <ButtonSet>
            <Button
              href="https://t.me/inrpk_bot"
              kind="secondary"
              className={styles.button}
              size="xl"
              style={{ maxInlineSize: '50%' }}
            >
              Перейти к боту
            </Button>
            <Button
              type="submit"
              className={styles.button}
              style={{ maxInlineSize: '50%' }}
            >
              Авторизоваться
            </Button>
          </ButtonSet>
          <div className={styles.actions}></div>
        </Stack>

        {/* <button type="submit">Войти</button> */}
      </RemixForm>
    </div>
  );
};

export { LoginPage };
