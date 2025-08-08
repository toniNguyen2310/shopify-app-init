import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import PageForm, { FormState } from "app/components/PageForm/PageForm";
import { useFetcher, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { useCallback } from "react";
import { authenticate } from "app/shopify.server";
import { connectDB } from "app/lib/db.server";
import { Page } from "app/models/Page.model";
import { isValidObjectId, Types } from "mongoose";

export async function loader({ params, request }: LoaderFunctionArgs) {
    console.log('=== EDIT PAGE LOADER CALLED ===');
    try {
        const startTime = performance.now();
        console.log('🔄 New Page Loader started');

        // Simulate any necessary data loading
        await new Promise(resolve => setTimeout(resolve, 0)); // Minimal delay



        const { session } = await authenticate.admin(request);
        console.log('✅ Authentication LOADER', session);

        const { pageId } = params;
        console.log('📄 Page ID param:', params);

        if (!pageId) {
            throw new Response("Page ID is required", { status: 400 });
        }
        await connectDB();

        // Fetch page from MongoDB
        const page = await Page.findById(pageId).lean();
        console.log('📄 Page found:', !!page);

        if (!page) {
            throw new Response("Page not found", { status: 404 });
        }

        // Transform MongoDB data to match FormState
        const transformedPage = {
            id: page._id.toString(),
            title: page.title || '',
            content: page.content || '',
            pageTitle: page.pageTitle || '',
            metaDescription: page.metaDescription || '',
            visibility: page.visibility || ['Hidden'],
            template: page.template || 'default',
        };

        console.log(`✅ LOADER EDIT ${performance.now() - startTime}ms`);
        return Response.json(transformedPage);
    } catch (error) {
        console.error('❌ Error loading page:', error);
        throw new Response("Internal server error", { status: 500 });
    };
}

export async function action({ request, params }: ActionFunctionArgs) {
    console.log('=== EDIT PAGE ACTION CALLED ===');
    console.log('Request method:', request.method);
    const startTime = performance.now();
    console.log('🔄 New Page Action started');
    try {
        const { session } = await authenticate.admin(request);
        const { pageId } = params;

        if (!pageId) {
            throw new Response("Page ID is required", { status: 400 });
        }
        const formData = await request.formData();
        const actionType = formData.get('_action') as string;

        await connectDB();

        switch (actionType) {
            case 'update': {
                const pageData = Object.fromEntries(formData) as any;
                const updatedPage = await Page.findByIdAndUpdate(
                    pageId,
                    {
                        title: pageData.title,
                        content: pageData.content,
                        pageTitle: pageData.pageTitle,
                        metaDescription: pageData.metaDescription,
                        visibility: JSON.parse(pageData.visibility || '["Hidden"]'),
                        template: pageData.template || 'default',
                        updatedAt: new Date(),
                    },
                    {
                        new: true, // Return updated document
                        runValidators: true // Run mongoose validations
                    }
                );

                if (!updatedPage) {
                    throw new Response("Page not found", { status: 404 });
                }
                console.log(`✅ UPDATE Action completed in ${performance.now() - startTime}ms`);
                return Response.json({ success: true });
            }

            case 'delete': {
                const deletedPage = await Page.findByIdAndDelete(pageId)
                if (!deletedPage) {
                    throw new Response("Page not found", { status: 404 });
                }
                console.log(`✅ DELETE Action completed in ${performance.now() - startTime}ms`);

                return redirect('/app');
            }

            case 'duplicate': {
                const originalPage = await Page.findById(pageId).lean()
                if (!originalPage) {
                    throw new Response("Page not found", { status: 404 });
                }

                // Create new page with duplicated data
                const duplicatedPage = new Page({
                    title: `Copy of ${originalPage.title}`,
                    content: originalPage.content,
                    pageTitle: `Copy of ${originalPage.pageTitle || originalPage.title}`,
                    metaDescription: originalPage.metaDescription,
                    visibility: originalPage.visibility,
                    template: originalPage.template,
                });

                const savedDuplicate = await duplicatedPage.save();

                if (isValidObjectId(savedDuplicate._id)) {
                    const stringId = (savedDuplicate._id as Types.ObjectId).toString();
                    console.log(`✅ DUPLICATE Action completed in ${performance.now() - startTime}ms`);

                    return redirect(`/app/${stringId}`);
                } else {
                    throw new Error("❌ Invalid ObjectId for saved duplicate page");
                }

            }

        }
    } catch (error) {
        console.error('Error updating page:', error);
        return Response.json(
            { error: 'Failed to update page' },
            { status: 500 }
        );
    }
}

export default function EditPage() {
    const page = useLoaderData<typeof loader>();
    const updateFetcher = useFetcher();
    const deleteFetcher = useFetcher();
    const duplicateFetcher = useFetcher();


    console.log('📄 Page data:', page);

    const handleSubmit = useCallback((formData: FormState) => {
        console.log('🚀 EditPage handleSubmit called with:', formData);

        // Create FormData object for submission
        const submitData = new FormData();
        submitData.append('_action', 'update'); // Specify action type

        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, Array.isArray(value) ? JSON.stringify(value) : String(value || ""));
        });

        console.log('📤 Submitting update via useSubmit...');
        updateFetcher.submit(submitData, { method: "post" });
    }, [updateFetcher]);

    const handleDelete = useCallback(() => {
        console.log('🗑️ Deleting page:', page.id);
        const deleteData = new FormData();
        deleteData.append('_action', 'delete');
        deleteFetcher.submit(deleteData, { method: "post" });

    }, [deleteFetcher])

    const handleDuplicate = useCallback(() => {
        console.log('📋 Duplicating page:', page.id);
        const duplicateData = new FormData();
        duplicateData.append('_action', 'duplicate');
        duplicateFetcher.submit(duplicateData, { method: "post" });
    }, [duplicateFetcher])

    // Separate the different loading states
    const isUpdating = updateFetcher.state !== "idle";
    const isDeleting = deleteFetcher.state !== "idle";
    const isDuplicating = duplicateFetcher.state !== "idle";

    // Only disable form when updating, not when deleting/duplicating
    const shouldDisableForm = isUpdating;

    return (
        <PageForm
            mode="edit"
            initialState={page}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            isLoading={isUpdating}
            isDeleting={isDeleting}
            isDuplicating={isDuplicating} />
    );
}