import { uploadService } from "../service/document/upload.service.js";
import { load } from "cheerio";

export const uploadMiddleware = {

    single: (options = {}) => {
        return uploadService.single(options);
    },

    multiple: (options = {}) => {
        return uploadService.multiple(options);
    },

    fields: (fields, options = {}) => {
        return uploadService.fields(fields, options);
    }

};

export const replacePendingImages = (
    description,
    uploadedImages = []
) => {
    if (!description || !uploadedImages.length) {
        return description;
    }

    const $ = load(description);

    uploadedImages.forEach(({ pendingId, url }) => {
        if (!pendingId || !url) return;

        const image = $(
            `img[data-pending-id="${pendingId}"]`
        );

        if (!image.length) return;

        image.attr("src", url);
        image.removeAttr("data-pending-id");
    });

    return $("body").html();
};

export default replacePendingImages;
