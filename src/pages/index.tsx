import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import Chat from "@/Components/Chat";
import Auth from "@/Components/Auth";

export default function Home() {
  const { data } = useSession();
  return data ? <Chat /> : <Auth />;
}

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);

  return {
    props: {
      session,
    },
  };
}
