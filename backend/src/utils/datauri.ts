import DataUriParser from "datauri/parser";
import path from "path";

const parser = new DataUriParser();

const getDataUri = (optimizedImageBuffer: any, file: any) => {
  const extName = path.extname(file.originalname).toString();

  return parser.format(extName, optimizedImageBuffer).content;
};

export default getDataUri;
