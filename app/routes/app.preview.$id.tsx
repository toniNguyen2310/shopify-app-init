// File: app/routes/app.preview.$id.tsx

import { type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "app/shopify.server";
import { connectDB } from "app/lib/db.server";
import { Page } from "app/models/Page.model";
import { BlockStack, Card, InlineStack, Text, Page as BlockPage } from "@shopify/polaris";
import { useEffect } from "react";

interface PagePreview {
    title: string;
    content: string;
    pageTitle?: string;
    metaDescription?: string;
    template?: string;
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    console.log('=== PREVIEW ROUTE LOADER ===');

    try {
        // Authenticate with Shopify
        await authenticate.admin(request);

        const { id } = params;
        console.log('📄 Preview page ID:', id);

        if (!id) {
            throw new Response("Page ID is required", {
                status: 400,
                statusText: "Bad Request"
            });
        }

        // Validate MongoDB ObjectId format
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            throw new Response("Invalid page ID format", {
                status: 400,
                statusText: "Bad Request"
            });
        }

        await connectDB();
        console.log('🔗 Database connected');

        const page = await Page.findById(id).lean();

        if (!page) {
            console.error('❌ Page not found:', id);
            throw new Response("Page not found", {
                status: 404,
                statusText: "Not Found"
            });
        }

        console.log('✅ Page loaded for preview:', page.title);

        const previewData: PagePreview = {
            title: page.title || 'Untitled Page',
            content: page.content || '',
            pageTitle: page.pageTitle,
            metaDescription: page.metaDescription,
            template: page.template || 'default'
        };

        return previewData;

    } catch (error: any) {
        console.error('❌ Preview loader error:', error);

        if (error instanceof Response) {
            throw error;
        }

        if (error.name === 'CastError') {
            throw new Response("Invalid page ID", {
                status: 400,
                statusText: "Bad Request"
            });
        }

        throw new Response("Failed to load preview", {
            status: 500,
            statusText: "Internal Server Error"
        });
    }
};

export default function PreviewPage() {
    const data = useLoaderData<typeof loader>();
    useEffect(() => {
        console.log('LOADER DATA COM>> ', data)
    }, [data])
    const {
        title = 'Untitled Page',
        content = '',
        pageTitle,
        metaDescription,
        template = 'default'
    } = data as PagePreview;


    return (
        <BlockPage narrowWidth>
            <Card>
                <BlockStack gap="200" >
                    <InlineStack align="space-between">
                        <Text as="h1" variant="heading2xl">
                            Title : {title}
                        </Text>
                    </InlineStack>
                    <InlineStack align="space-between">
                        <Text as="h1" variant="headingXl">
                            Content : {content || 'Rỗng'}
                        </Text>
                    </InlineStack>

                </BlockStack>
            </Card>
        </BlockPage>

    );
}