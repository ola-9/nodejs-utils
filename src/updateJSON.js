import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

async function writeObjectToJsonFile(obj, filePath) {
  const jsonContent = JSON.stringify(obj, null, 2) + '\n';
  try {
    await writeFile(filePath, jsonContent, 'utf-8');
    console.log('Объект успешно записан в файл:', filePath);
  } catch (err) {
    console.error('Ошибка записи в файл:', err);
    throw err;
  }
}

function updateTsconfig(tsconfig) {
  if (!tsconfig.compilerOptions) {
    tsconfig.compilerOptions = {};
  }

  if (!tsconfig.compilerOptions.strict) {
    tsconfig.compilerOptions.strict = true;
  }

  if (!tsconfig.compilerOptions.target) {
    tsconfig.compilerOptions.target = "es2022";
  }

  return tsconfig;
}

async function parseTsconfig(directoryPath) {
  try {
    const files = await readdir(directoryPath);
    const tsconfigFile = files.find(file => file === 'tsconfig.json');

    if (!tsconfigFile) {
      throw new Error('Файл tsconfig.json не найден');
    }

    const tsconfigPath = path.join(directoryPath, tsconfigFile);
    const tsconfigContent = await readFile(tsconfigPath, 'utf-8');
    const tsconfig = JSON.parse(tsconfigContent);
    const updatedTsconfig = updateTsconfig(tsconfig);

    console.log('Содержимое файла tsconfig.json:', tsconfig);
    console.log('Обновленное содержимое файла tsconfig.json:', updatedTsconfig);

    await writeObjectToJsonFile(updatedTsconfig, tsconfigPath);
  } catch (err) {
    console.error('Ошибка:', err);
    throw err;
  }
}

async function getDirectories(dirPath) {
  try {
    const files = await readdir(dirPath, { withFileTypes: true });
    
    const directories = files
      .filter(item => item.isDirectory())
      .map(dir => dir.name)
      .map(dirName => path.join(dirPath, dirName, 'exercise'));

    console.log('Список папок:', directories);
    return directories;
  } catch (err) {
    console.error('Ошибка чтения директории', err);
    throw err;
  }
}

const updateJSON = (path) => {
  console.log('updating your JSON file:');

  return getDirectories(path)
    .then((exercisePaths) => {
        exercisePaths.forEach((path) => parseTsconfig(path) )
    })

}

export default updateJSON;
