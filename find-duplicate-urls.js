import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';

(async () => {
  try {
    console.log('Start ----------');
    
    // `./url-list.txt` か `./result-*.txt` のみを取得する
    const fileNames = await fs.promises.readdir('./');
    const resultFileNames = fileNames.filter(fileName => {
        fileName = path.basename(fileName);
        return fileName === 'url-list.txt' || (fileName.startsWith('result-') && fileName.endsWith('.txt'));
    });
    const filePaths = resultFileNames.map(fileName => `./${fileName}`);
    
    // 行の内容をキーとし、値に `{ filename, lineNumber }` のリストを持つ Map
    const lineLocations = new Map();
    
    let hasDuplicates = false;
    for(const filePath of filePaths) {
      const fileStream = fs.createReadStream(filePath);
      const readlineInterface = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });
      
      let lineNumber = 0;
      for await(const line of readlineInterface) {  // `readline` の 'line' イベントを待機するために Promise でラップする
        lineNumber++;
        const cleanLine = line.trim();
        if(!cleanLine) continue;
        
        if(!lineLocations.has(cleanLine)) lineLocations.set(cleanLine, []);
        lineLocations.get(cleanLine).push({ filePath, lineNumber });  // 場所の情報を追加する
      }
    }
    
    // 結果を出力する
    for(const [lineContent, locations] of lineLocations.entries()) {
      if(locations.length > 1) {
        hasDuplicates = true;
        console.log(`- ${lineContent} : ${locations.length} 回出現`);
        // 場所を行番号とファイル名でソートして表示する
        locations.sort((a, b) => a.filePath.localeCompare(b.filePath) || a.lineNumber - b.lineNumber);
        for(const location of locations) console.log(`  - ${location.filePath}:${location.lineNumber}`);  // コロンで繋げることで VSCode ターミナルから直接開ける
      }
    }
    if(!hasDuplicates) console.log('ファイル間に重複している行は見つかりませんでした');
    console.log('Finished ==========');
  }
  catch(error) {
    console.error('ERROR ----------');
    console.error(error);
    console.error('ERROR ==========');
  }
})();
