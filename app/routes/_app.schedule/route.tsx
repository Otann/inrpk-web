import {
  Button,
  Stack,
  ContainedList,
  ContainedListItem,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
} from '@carbon/react';
import { Close, Video } from '@carbon/icons-react';
import { LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { authenticator } from '~/lib/auth.server';
import CarbonContentPage from '~/components/CarbonContentPage';
import styles from './styles.module.css';

export const meta: MetaFunction = () => {
  return [{ title: 'ИНРПК: Профиль' }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/login',
  });
  return json({ user });
};

const data = [
  {
    time: '11:00',
    events: [
      {
        place: 'Третий этаж',
        name: 'Второй уровень, 6й поток - Р.В. Газенко',
        zoom: 'http://...',
        sent: false,
      },
      {
        place: 'Второй этаж',
        name: 'Первый уровень, 18й поток - А.Г. Ибрагимов',
        zoom: 'http://...',
        sent: true,
      },
      {
        place: 'Зелёная комната',
        name: 'ФМПЖ, 1я группа - А. Сунцов',
        zoom: 'http://...',
        sent: false,
      },
    ],
  },
  {
    time: '14:00',
    events: [
      {
        place: 'Третий этаж',
        name: 'Первый уровень, 19й поток - А.Г. Ибрагимов',
        zoom: 'http://...',
        sent: false,
      },
      {
        place: 'Зелёная комната',
        name: 'ФМПЖ, 2я группа - А. Сунцов',
        zoom: 'http://...',
        sent: false,
      },
    ],
  },
];

export default function Profile() {
  return (
    <CarbonContentPage>
      <Stack gap={7}>
        {/* <Stack orientation="horizontal">
          <h1>Расписание занятий</h1>
          <Button>Добавить</Button>
        </Stack> */}
        <Stack>
          <h2>Сегодня</h2>
          {data.map((section) => (
            <Stack key={section.time}>
              <h3>{section.time}</h3>
              <StructuredListWrapper>
                {/* <StructuredListHead>
                  <StructuredListRow>
                    <StructuredListCell head>{section.time}</StructuredListCell>
                    <StructuredListCell head>а</StructuredListCell>
                    <StructuredListCell head>а</StructuredListCell>
                  </StructuredListRow>
                </StructuredListHead> */}
                <StructuredListBody>
                  {section.events.map((event) => (
                    <StructuredListRow key={event.place}>
                      <StructuredListCell>
                        {/* <Button
                          kind="ghost"
                          iconDescription="Открыть зум"
                          hasIconOnly
                          renderIcon={Video}
                        /> */}
                        <a href="/#">Открыть зум</a>
                      </StructuredListCell>
                      <StructuredListCell noWrap className={styles.place}>
                        {event.place}
                      </StructuredListCell>
                      <StructuredListCell>{event.name}</StructuredListCell>
                      <StructuredListCell>
                        {event.sent ? (
                          'Ссылка отправлена'
                        ) : (
                          <a href="/#">Отправить ссылку в чат</a>
                        )}
                      </StructuredListCell>
                    </StructuredListRow>
                  ))}
                </StructuredListBody>
              </StructuredListWrapper>
            </Stack>
          ))}
        </Stack>
        <Stack></Stack>
      </Stack>
    </CarbonContentPage>
  );
}
