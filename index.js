import * as fs from 'node:fs/promises';

const host = 'neos21.net';
const key  = 'ae52213dcf6345ccb5cfd82813bbbe70';  // ファイルも置いてあることだし別に機密情報ではない

const endPointHost = 'api.indexnow.org';  // `www.bing.com` でも良い・どこかに送れば関連する検索エンジンに共有される

(async () => {
  try {
    console.log('Start ----------');
    
    const urlListText = await fs.readFile('./url-list.txt', 'utf-8');
    const urlList = urlListText.split('\n').filter(Boolean);  // 空行を消す
    if(urlList.length === 0) throw new Error('URL List Is Empty');
    
    const response = await fetch(`https://${endPointHost}/indexnow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host       : host,
        key        : key,
        keyLocation: `https://${host}/${key}.txt`,
        urlList    : urlList  // `urlList` は1回あたり最大1万件・429 がレスポンスされたら多すぎ
      })
    });
    console.log(`Status Code : ${response.status}`);
    
    const destFilePath = response.status === 200 ? './result-added.txt'
                       : response.status === 429 ? './result-failed.txt'
                       : `./result-http-${response.status}.txt`;
    await fs.appendFile(destFilePath, urlList.join('\n') + '\n', 'utf-8');
    
    console.log('Finished ==========');
  }
  catch(error) {
    console.error('ERROR ----------');
    console.error(error);
    console.error('ERROR ==========');
  }
})();
