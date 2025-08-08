// app/models/Page.model.ts
import mongoose, { Document, Model, Schema } from "mongoose";

// 1. Khai báo interface TypeScript cho document
export interface PageDocument extends Document {
    title: string;
    content?: string;
    pageTitle?: string;
    metaDescription?: string;
    visibility?: string[];
    template: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

// 2. Định nghĩa schema như cũ, có timestamps
const PageSchema = new Schema<PageDocument>(
    {
        title: { type: String, required: true },
        content: String,
        pageTitle: String,
        metaDescription: String,
        visibility: [String],
        template: { type: String, default: "default" },
        status: { type: String, default: "active" },
    },
    { timestamps: true }
);

// 3. Export model với đúng kiểu Model<PageDocument>
export const Page: Model<PageDocument> =
    mongoose.models.Page || mongoose.model<PageDocument>("Page", PageSchema);
