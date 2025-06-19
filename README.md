# GAS Gamil Notifier

## なにこれ

Gmailの特定のメールをSlackにWebhook通知するやつ

詳しい挙動はコード見てね

## ローカルに必要なもの

-   [Node.js](https://nodejs.org/) (clasp の内部で利用されます)
-   [Bun](https://bun.sh/)

### セットアップ手順

1.  **Google Apps Script API の有効化**
    開発を始める前に、Google アカウントで [Apps Script API を有効](https://script.google.com/home/usersettings) にする。

2.  **依存パッケージをインストール**
    プロジェクトに必要なライブラリをインストールします。
    ```bash
    bun install
    ```

3.  **Google アカウントで clasp にログイン**
    GAS プロジェクトを操作するために、Google アカウントへのアクセス許可を行います。
    ```bash
    bun run clasp login
    ```
    ブラウザが開き、認証が求められます。承認すると、認証情報がローカルに保存されます。

4.  **GAS プロジェクトを作成**
    [Google Apps Script Console](https://script.google.com/home) から「新しいプロジェクトを作成」してください

5. **ScriptIDを設定**
    プロジェクトのWebエディタを開き、URLの `https://script.google.com/home/projects/<HERE>/edit` から `<HERE>` の部分にある文字列をコピーし、 `.clasp.json` の `scriptId` に設定してください。

## 開発の流れ

ソースコードはすべて `src` ディレクトリで管理します。メインファイルは `src/index.ts` です。

webpackによるコンパイルが行われるため、複数ファイルでのソースコード管理が可能です。

GAS から呼び出したい関数は、`global` オブジェクトに代入することでグローバル関数として公開する必要があります。

**例: 新しい関数を追加する**

```typescript:src/index.ts
// GASのメニューから実行される関数
(global as any).onOpen = () => {
  SpreadsheetApp.getUi()
    .createMenu('カスタムメニュー')
    .addItem('挨拶', 'helloWorld')
    .addToUi();
};

// 上記メニューから呼び出される関数
(global as any).helloWorld = () => {
  Browser.msgBox('こんにちは、世界！');
};
```

### 基本的なコマンド

-   **ビルド**
    `src` 以下の TypeScript をコンパイルし、GAS で実行可能な `bundle.js` を `dist` ディレクトリに作成します。
    ```bash
    bun run build
    ```

-   **GAS へプッシュ**
    ビルドされた `dist` ディレクトリの内容（`bundle.js` と `appsscript.json`）を GAS プロジェクトにアップロードします。
    ```bash
    bun run push
    ```

-   **ビルドしてプッシュ**
    開発中は基本的にこのコマンドを使います。ビルドとプッシュを一度に実行します。
    ```bash
    bun run deploy
    ```

### 開発用コマンド

-   **自動ビルド**
    ファイルの変更を監視し、保存するたびに自動でビルドが実行されます。
    ```bash
    bun run build:watch
    ```

-   **自動プッシュ**
    ファイルの変更を監視し、保存するたびに自動でプッシュが実行されます。
    ```bash
    bun run push:watch
    ```

## 📁 ディレクトリ・ファイル構成

```
.
├── dist/                # ビルド後のファイルが格納される（clasp のプッシュ対象）
│   ├── appsscript.json  # GAS のマニフェストファイル
│   └── bundle.js        # webpack によってバンドルされた JS ファイル
├── src/                 # 開発用ソースコード
│   └── index.ts         # メインの TypeScript ファイル
├── .clasp.json          # clasp の設定ファイル (scriptId など)
├── package.json         # プロジェクト設定とスクリプト
├── tsconfig.json        # TypeScript のコンパイラ設定
└── webpack.config.js    # webpack の設定
```
```
