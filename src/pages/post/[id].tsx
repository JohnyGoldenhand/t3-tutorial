import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/Layout";
import { LoadingPage } from "~/components/LoadingSpinner";
import { PostView } from "~/components/PostView";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const SinglePostPage: NextPage<{ postId: string }> = ({ postId }) => {
  const { data, isLoading } = api.posts.getPostById.useQuery({
    postId,
  });
  if (isLoading) return <LoadingPage />;
  if (!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = generateSSGHelper();
  const postId = context.params?.id as string;

  if (typeof postId !== "string") throw new Error("no id");

  await helpers.posts.getPostById.prefetch({ postId });

  return {
    props: {
      trcpState: helpers.dehydrate(),
      postId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SinglePostPage;
