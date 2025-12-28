import mongoose from "mongoose";

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
};

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    image: {
      type: String,
      required: false, // Image is optional
    },
    categoryType: {
      type: String,
      required: true,
      enum: ["Featured", "Hot Categories", "Top Categories"], // Mandatory with specific values
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate slug
categorySchema.pre("save", async function (next) {
  if (!this.isModified("name") && this.slug) {
    return next();
  }

  this.slug = slugify(this.name);
  next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
