import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import PageForm, { FormState } from "app/components/PageForm/PageForm";
import { useNavigation, useSubmit } from "@remix-run/react";
import { useCallback } from "react";
import { connectDB } from "app/lib/db.server";
import { Page } from "../models/Page.model";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  console.log('SESSION IN loader:', session);
  return null;
};

export async function action({ request }: ActionFunctionArgs) {
  console.log('=== ACTION CALLED ===');
  console.log('Request method:', request.method);
  console.log('Request URL:', request.url);
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  try {
    const { session } = await authenticate.admin(request);
    console.log('✅ Authentication successful');
    console.log('SESSION IN ACTION:', session);

    const formData = await request.formData();
    const pageData = Object.fromEntries(formData) as any;
    await connectDB();
    console.log('🔗 Database connected');

    const newPage = new Page({
      title: pageData.title,
      content: pageData.content,
      pageTitle: pageData.pageTitle,
      metaDescription: pageData.metaDescription,
      visibility: JSON.parse(pageData.visibility || '["Hidden"]'),
      template: pageData.template || 'default',
      status: "active",
    });


    const valueSave = await newPage.save();
    console.log('✅ Page created successfully:', valueSave);
    return redirect(`/app`)

  } catch (error) {
    console.error('Error creating page:', error);
    return Response.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}

export default function AddPage() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const submit = useSubmit();

  const handleSubmit = useCallback((formData: FormState) => {
    const submitData = new FormData();


    // Thêm các field vào form
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        submitData.append(key, JSON.stringify(value));
      } else {
        submitData.append(key, String(value || ''));
      }
    });

    try {
      submit(submitData, {
        method: "post",
      });
      console.log('✅ Submit call completed');
    } catch (error) {
      console.error('❌ Submit error:', error);
    }
    console.log('run end')
  }, [submit]);
  // Log navigation changes
  console.log('🔄 Component render - navigation.state:', navigation.state);
  return (
    <PageForm mode="create" onSubmit={handleSubmit} isLoading={isSubmitting} />
  );
}