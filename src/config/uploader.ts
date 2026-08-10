import multer from "multer";

/**
 * Photos are stored directly in MongoDB as a Buffer (see the `photo` field on
 * the User and Blog models), then streamed back out through the dedicated
 * `/photo` endpoints. Memory storage gives us `file.buffer` and `file.mimetype`
 * without ever touching the disk - a good fit for a small, low-traffic API and
 * an ephemeral filesystem host like Render.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    // 10 MB, matching the original create-blog limit.
    fileSize: 10 * 1024 * 1024,
  },
});

export default upload;
