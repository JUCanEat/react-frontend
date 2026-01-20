import MenuClient from '~/components/menu/menu_client';

export default function Menu() {
  // server-rendered route that delegates to a client component
  return <MenuClient />;
}
