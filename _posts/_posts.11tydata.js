// Every file in _posts is a blog post: same layout, same tag, and the
// Jekyll permalink scheme /:year/:month/:day/:title/ taken from the file name.
import { postUrlFromFile } from "../_config/post-url.js";

export default {
  layout: "post",
  tags: ["posts"],
  permalink: (data) => postUrlFromFile(data.page.inputPath),
};
