# GAS on clasp Template

TypeScript, webpack, clasp を利用して、モダンな開発環境で Google Apps Script (GAS) を構築するためのテンプレートプロジェクトです。

## 🎯 このテンプレートの目的

-   **静的型付け**: TypeScript を導入し、コンパイル時の型チェックによってコードの品質と保守性を向上させます。
-   **モジュール管理**: 巨大になりがちな `.gs` ファイルを機能ごとにファイル分割し、webpack で一つにまとめることで、管理しやすいコードベースを実現します。
-   **CUI操作**: clasp を使い、GAS プロジェクトの作成、コードのアップロード/ダウンロード、デプロイ管理をすべてコマンドラインから実行します。
-   **高速な開発サイクル**: Bun を活用し、依存関係のインストールやスクリプトの実行を高速化します。

## 🛠️ 技術スタック

| テクノロジー                                                   | 役割                                                                                                             |
| :----------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| [**TypeScript**](https://www.typescriptlang.org/)            | JavaScript に静的な型を導入した言語。コードの安全性を高めます。                                                  |
| [**Google Apps Script**](https://developers.google.com/apps-script) | Google のサービスを自動化・連携させるためのサーバーサイドJavaScript実行環境。                                      |
| [**clasp**](https://github.com/google/clasp)                 | GAS プロジェクトをローカルで開発・管理するためのGoogle製公式コマンドラインツール。                               |
| [**webpack**](https://webpack.js.org/)                       | 複数のモジュール（`.ts` ファイルなど）を依存関係を解決しながら、1つのファイルにまとめる（バンドルする）ツール。 |
| [**Bun**](https://bun.sh/)                                   | 高速な JavaScript ランタイム兼パッケージマネージャ。`npm` や `yarn` の代替として使用します。                     |

## 🏁 はじめる

### 必要なもの

-   [Node.js](https://nodejs.org/) (clasp の内部で利用されます)
-   [Bun](https://bun.sh/)
-   [Google アカウント](https://www.google.com/account/about/)

### セットアップ手順

1.  **Google Apps Script API を有効にする**
    開発を始める前に、Google アカウントで [Apps Script API を有効](https://script.google.com/home/usersettings) にしてください。

2.  **依存パッケージをインストール**
    プロジェクトに必要なライブラリをインストールします。
    ```bash
    bun install
    ```

3.  **Google アカウントで clasp にログイン**
    GAS プロジェクトを操作するために、Google アカウントへのアクセス許可を行います。
    ```bash
    clasp login
    ```
    ブラウザが開き、認証が求められます。承認すると、認証情報がローカルに保存されます。

4.  **GAS プロジェクトを作成**
    Google Drive 上に新しい GAS プロジェクトを作成します。
    ```bash
    clasp create --title "新しいプロジェクト名" --rootDir ./dist
    ```
    コマンドを実行すると、`.clasp.json` に `scriptId` が自動で設定されます。

    > **ヒント**: 既存の GAS プロジェクトを使いたい場合は、`scriptId` を指定して `clasp clone <scriptId> --rootDir ./dist` を実行してください。

## 💻 開発の流れ

ソースコードはすべて `src` ディレクトリで管理します。メインファイルは `src/index.ts` です。

GAS から呼び出したい関数は、`global` オブジェクトに代入することでグローバル関数として公開します。このテンプレートでは `gas-webpack-plugin` がこの処理を自動化してくれるため、通常の `export` は不要です。

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

### 便利な開発用コマンド

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
