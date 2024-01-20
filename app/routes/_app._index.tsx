import type { MetaFunction } from '@remix-run/node';
import CarbonContentPage from '~/components/CarbonContentPage';

export const meta: MetaFunction = () => {
  return [
    { title: 'ИНРПК' },
    { name: 'description', content: 'Управление ботом' },
  ];
};

export default function Index() {
  return (
    <CarbonContentPage>
      <h1>Панель управления ботом ИНРПК</h1>
    </CarbonContentPage>
  );
}
