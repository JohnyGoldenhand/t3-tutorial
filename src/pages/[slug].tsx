import { GetStaticPathsContext, GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { PageLayout } from "~/components/Layout";
import { LoadingPage } from "~/components/LoadingSpinner";
import { PostView } from "~/components/PostView";
import { api } from "~/utils/api";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import SuperJSON from "superjson";
import { prisma } from "~/server/db";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Link from "next/link";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });
  if (isLoading) return <LoadingPage />;
  if (!data || data.length === 0) return <div>User has not posted</div>;
  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username,
  });
  if (!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36  border-slate-400 bg-slate-600">
          <Image
            src={data.profileImgUrl}
            alt={`${data.username ?? ""}'s profile image`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-2 border-black bg-black"
          />
        </div>
        <div className="h-[64px]" />
        <div className="flex w-full justify-between p-4 text-2xl font-bold">
          <span>{`@${data.username ?? ""}`}</span>
          <Link href="/" className="font-normal">
            Home page
          </Link>
        </div>
        <div className="w-full border-b border-r-slate-400" />
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = generateSSGHelper();
  const slug = context.params?.slug as string;

  if (typeof slug !== "string") throw new Error("no user");

  const username = slug.replace("@", "");

  await helpers.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trcpState: helpers.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
