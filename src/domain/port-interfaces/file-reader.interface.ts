export type FileReaderOptions = {
  encoding: BufferEncoding;
};

export interface FileReader {
  readFile(path: string, options: FileReaderOptions): Promise<string>;
}
