# Neo's World IndexNow

[Neo's World](https://neos21.net) のページを [IndexNow](https://www.indexnow.org/ja_jp/index) に一括登録するための Node.js スクリプト。

- `$ npm start` : `index.js`
    - Node.js 組み込みの `fetch()` のみ使用している (Node.js v22.19.0 で動作確認済)・外部の依存 npm パッケージなし
    - `url-list.txt` を読み込んで送信する・処理結果は `result-*.txt` に出力するが `url-list.txt` の内容は変更しない点に留意
- `url-list.txt`
    - 登録したい URL 一覧を書くファイル。1行につき URL を1つ書く
- `result-added.txt`
    - 最終操作日 : **2025-12-11**
    - 登録に成功した URL 一覧
- `result-failed.txt`
    - HTTP ステータスコード 429 が返ってきて登録に失敗した URL 一覧
- `result-http-【Status Code】.txt`
    - その他のステータスコードを受け取った場合に保存する URL 一覧
- `$ npm run duplicate` : `find-duplicate-urls.js`
    - `result-*.txt` 類を参照し、重複する URL が書かれた行がないかチェックする


## Links

- [Neo's World](https://neos21.net/)
