import { Page } from '@shopify/polaris';
import { Page as PageModel } from "../models/Page.model";
import { TitleBar } from "@shopify/app-bridge-react";
import { PageTable } from "app/components/PageTable";
import { useLoaderData, useNavigate } from '@remix-run/react';
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { PageType } from 'app/components/PageTable/types';
import { connectDB } from 'app/lib/db.server';
import { useEffect, useMemo } from 'react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const startTime = performance.now();

    await authenticate.admin(request);
    await connectDB();

    const pages = await PageModel.find().lean().sort({ createdAt: -1 }); // Sort by newest first

    console.log(`✅ LOADER /APP in ${performance.now() - startTime}ms`);

    return { pages };
  } catch (error) {
    console.error('Error loading pages:', error);
    return { pages: [] };
  }
};

export default function AppIndex() {
  const { pages } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const transformedPages: PageType[] = useMemo(() => {
    return pages.map((page: any) => ({
      id: page._id.toString(),
      title: page.title,
      visibility: page.visibility[0],
      updated: page.updatedAt
        ? new Date(page.updatedAt).toLocaleDateString('en-US', {
          weekday: 'long',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
        : new Date(page.createdAt).toLocaleDateString('en-US', {
          weekday: 'long',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
      // Thêm các field khác nếu PageType cần
      content: page.content,
      pageTitle: page.pageTitle,
      metaDescription: page.metaDescription,
      template: page.template,
      status: page.status
    }));
  }, [pages]);
  console.log('transformedPages>> ', transformedPages)

  useEffect(() => {
    // console.log('transformedPages>> ', transformedPages)
  }, [pages])

  return (
    <Page fullWidth>
      <TitleBar title="Pages">
        <button variant="primary" onClick={() => navigate('/app/new')}>Add page</button>
      </TitleBar>
      <PageTable pages={transformedPages} />
    </Page>
  );
}
