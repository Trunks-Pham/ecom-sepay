import mongoose, { Schema, Document } from 'mongoose';

export interface IVariant {
  name: string; // e.g., "Size", "Color"
  options: string[]; // e.g., ["S", "M", "L", "XL"]
}

export interface ICustomField {
  fieldName: string; // e.g., "Engraving Text"
  fieldType: 'text' | 'number' | 'select';
  required: boolean;
  options?: string[]; // For select type
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  category: mongoose.Types.ObjectId;
  price: number;
  comparePrice?: number;
  stock: number;
  images: string[];
  thumbnail: string;
  variants: IVariant[];
  customFields: ICustomField[];
  sku: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  ratings: number;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  options: [String],
});

const CustomFieldSchema = new Schema({
  fieldName: {
    type: String,
    required: true,
  },
  fieldType: {
    type: String,
    enum: ['text', 'number', 'select'],
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  options: [String],
});

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    comparePrice: {
      type: Number,
      default: null,
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    thumbnail: {
      type: String,
      required: true,
    },
    variants: [VariantSchema],
    customFields: [CustomFieldSchema],
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    weight: {
      type: Number,
      default: null,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
