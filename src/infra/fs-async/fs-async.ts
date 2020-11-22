import * as util from 'util';
import * as fs from 'fs';
import {
  FileReader,
  FileReaderOptions,
} from '../../domain/port-interfaces/file-reader.interface';

export class FSAsync implements FileReader {
  public readFile(path: string, opts: FileReaderOptions): Promise<string> {
    return util.promisify(fs.readFile)(path, opts);
  }
}
